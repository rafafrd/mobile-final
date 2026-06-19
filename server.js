const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

// Banco de dados SQLite na raiz do projeto
const db = new Database(path.join(__dirname, 'dados.db'));

app.use(cors());
app.use(express.json());

// Cria tabelas se não existirem e insere dados iniciais
db.exec(`
  CREATE TABLE IF NOT EXISTS categoria (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    dc_categoria TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS produto (
    id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
    dc_produto TEXT NOT NULL,
    vl_produto REAL NOT NULL,
    id_categoria INTEGER NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
  );
`);

// Seed inicial somente se estiver vazio
const totalCat = db.prepare('SELECT COUNT(*) as total FROM categoria').get();
if (totalCat.total === 0) {
  db.prepare('INSERT INTO categoria (dc_categoria) VALUES (?)').run('Bebidas');
  db.prepare('INSERT INTO categoria (dc_categoria) VALUES (?)').run('Alimentos');
  db.prepare('INSERT INTO categoria (dc_categoria) VALUES (?)').run('Limpeza');

  db.prepare('INSERT INTO produto (dc_produto, vl_produto, id_categoria) VALUES (?, ?, ?)').run('Refrigerante 2L', 8.5, 1);
  db.prepare('INSERT INTO produto (dc_produto, vl_produto, id_categoria) VALUES (?, ?, ?)').run('Arroz 5kg', 24.9, 2);
  db.prepare('INSERT INTO produto (dc_produto, vl_produto, id_categoria) VALUES (?, ?, ?)').run('Detergente', 3.5, 3);
}

// ─── CATEGORIAS ───────────────────────────────────────────────

app.get('/categoria', (req, res) => {
  const recurso = db.prepare('SELECT * FROM categoria ORDER BY id_categoria').all();
  res.json({ recurso });
});

app.get('/categoria/:id', (req, res) => {
  const recurso = db.prepare('SELECT * FROM categoria WHERE id_categoria = ?').get(req.params.id);
  if (!recurso) return res.status(404).json({ erro: 'Categoria não encontrada.' });
  res.json({ recurso });
});

app.post('/categoria', (req, res) => {
  const { dc_categoria } = req.body;
  if (!dc_categoria || dc_categoria.trim().length < 2)
    return res.status(400).json({ erro: 'Nome da categoria inválido.' });

  const result = db.prepare('INSERT INTO categoria (dc_categoria) VALUES (?)').run(dc_categoria.trim());
  const recurso = db.prepare('SELECT * FROM categoria WHERE id_categoria = ?').get(result.lastInsertRowid);
  res.status(201).json({ recurso });
});

app.put('/categoria/:id', (req, res) => {
  const { dc_categoria } = req.body;
  if (!dc_categoria || dc_categoria.trim().length < 2)
    return res.status(400).json({ erro: 'Nome da categoria inválido.' });

  const info = db.prepare('UPDATE categoria SET dc_categoria = ? WHERE id_categoria = ?').run(dc_categoria.trim(), req.params.id);
  if (info.changes === 0) return res.status(404).json({ erro: 'Categoria não encontrada.' });

  const recurso = db.prepare('SELECT * FROM categoria WHERE id_categoria = ?').get(req.params.id);
  res.json({ recurso });
});

app.delete('/categoria/:id', (req, res) => {
  const info = db.prepare('DELETE FROM categoria WHERE id_categoria = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ erro: 'Categoria não encontrada.' });
  res.status(204).send();
});

// ─── PRODUTOS ─────────────────────────────────────────────────

app.get('/produto', (req, res) => {
  const recurso = db.prepare('SELECT * FROM produto ORDER BY id_produto').all();
  res.json({ recurso });
});

app.get('/produto/:id', (req, res) => {
  const recurso = db.prepare('SELECT * FROM produto WHERE id_produto = ?').get(req.params.id);
  if (!recurso) return res.status(404).json({ erro: 'Produto não encontrado.' });
  res.json({ recurso });
});

app.post('/produto', (req, res) => {
  const { dc_produto, vl_produto, id_categoria } = req.body;
  if (!dc_produto || dc_produto.trim().length < 2)
    return res.status(400).json({ erro: 'Nome do produto inválido.' });
  if (vl_produto == null || Number(vl_produto) < 0)
    return res.status(400).json({ erro: 'Valor do produto inválido.' });
  if (!id_categoria)
    return res.status(400).json({ erro: 'Categoria obrigatória.' });

  const result = db.prepare('INSERT INTO produto (dc_produto, vl_produto, id_categoria) VALUES (?, ?, ?)').run(dc_produto.trim(), Number(vl_produto), Number(id_categoria));
  const recurso = db.prepare('SELECT * FROM produto WHERE id_produto = ?').get(result.lastInsertRowid);
  res.status(201).json({ recurso });
});

app.put('/produto/:id', (req, res) => {
  const { dc_produto, vl_produto, id_categoria } = req.body;
  if (!dc_produto || dc_produto.trim().length < 2)
    return res.status(400).json({ erro: 'Nome do produto inválido.' });
  if (vl_produto == null || Number(vl_produto) < 0)
    return res.status(400).json({ erro: 'Valor do produto inválido.' });
  if (!id_categoria)
    return res.status(400).json({ erro: 'Categoria obrigatória.' });

  const info = db.prepare('UPDATE produto SET dc_produto = ?, vl_produto = ?, id_categoria = ? WHERE id_produto = ?').run(dc_produto.trim(), Number(vl_produto), Number(id_categoria), req.params.id);
  if (info.changes === 0) return res.status(404).json({ erro: 'Produto não encontrado.' });

  const recurso = db.prepare('SELECT * FROM produto WHERE id_produto = ?').get(req.params.id);
  res.json({ recurso });
});

app.delete('/produto/:id', (req, res) => {
  const info = db.prepare('DELETE FROM produto WHERE id_produto = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ erro: 'Produto não encontrado.' });
  res.status(204).send();
});

// Inicia o servidor em todas as interfaces para ser acessível na rede local
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API rodando em http://0.0.0.0:${PORT}`);
  console.log(`Acesse pelo mobile: http://10.87.169.91:${PORT}`);
});
