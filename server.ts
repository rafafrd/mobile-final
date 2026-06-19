import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './src/database/connection';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// ─── CATEGORIAS ───────────────────────────────────────────────

app.get('/categoria', async (req, res) => {
  try {
    const [recurso] = await db.execute('SELECT * FROM categoria ORDER BY id_categoria');
    res.json({ recurso });
  } catch (err: unknown) {
    res.status(500).json({ erro: err instanceof Error ? err.message : 'Erro interno' });
  }
});

app.get('/categoria/:id', async (req, res) => {
  try {
    const [rows]: any = await db.execute('SELECT * FROM categoria WHERE id_categoria = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Categoria não encontrada.' });
    res.json({ recurso: rows[0] });
  } catch (err: unknown) {
    res.status(500).json({ erro: err instanceof Error ? err.message : 'Erro interno' });
  }
});

app.post('/categoria', async (req, res) => {
  const { dc_categoria } = req.body as { dc_categoria?: string };
  if (!dc_categoria || dc_categoria.trim().length < 2)
    return res.status(400).json({ erro: 'Nome da categoria inválido.' });
  try {
    const [result]: any = await db.execute('INSERT INTO categoria (dc_categoria) VALUES (?)', [dc_categoria.trim()]);
    const [rows]: any = await db.execute('SELECT * FROM categoria WHERE id_categoria = ?', [result.insertId]);
    res.status(201).json({ recurso: rows[0] });
  } catch (err: unknown) {
    res.status(500).json({ erro: err instanceof Error ? err.message : 'Erro interno' });
  }
});

app.put('/categoria/:id', async (req, res) => {
  const { dc_categoria } = req.body as { dc_categoria?: string };
  if (!dc_categoria || dc_categoria.trim().length < 2)
    return res.status(400).json({ erro: 'Nome da categoria inválido.' });
  try {
    const [result]: any = await db.execute('UPDATE categoria SET dc_categoria = ? WHERE id_categoria = ?', [dc_categoria.trim(), req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Categoria não encontrada.' });
    const [rows]: any = await db.execute('SELECT * FROM categoria WHERE id_categoria = ?', [req.params.id]);
    res.json({ recurso: rows[0] });
  } catch (err: unknown) {
    res.status(500).json({ erro: err instanceof Error ? err.message : 'Erro interno' });
  }
});

app.delete('/categoria/:id', async (req, res) => {
  try {
    const [result]: any = await db.execute('DELETE FROM categoria WHERE id_categoria = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Categoria não encontrada.' });
    res.status(204).send();
  } catch (err: unknown) {
    res.status(500).json({ erro: err instanceof Error ? err.message : 'Erro interno' });
  }
});

// ─── PRODUTOS ─────────────────────────────────────────────────

app.get('/produto', async (req, res) => {
  try {
    const [recurso] = await db.execute('SELECT * FROM produto ORDER BY id_produto');
    res.json({ recurso });
  } catch (err: unknown) {
    res.status(500).json({ erro: err instanceof Error ? err.message : 'Erro interno' });
  }
});

app.get('/produto/:id', async (req, res) => {
  try {
    const [rows]: any = await db.execute('SELECT * FROM produto WHERE id_produto = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json({ recurso: rows[0] });
  } catch (err: unknown) {
    res.status(500).json({ erro: err instanceof Error ? err.message : 'Erro interno' });
  }
});

app.post('/produto', async (req, res) => {
  const { dc_produto, vl_produto, id_categoria } = req.body as { dc_produto?: string; vl_produto?: number; id_categoria?: number };
  if (!dc_produto || dc_produto.trim().length < 2)
    return res.status(400).json({ erro: 'Nome do produto inválido.' });
  if (vl_produto == null || Number(vl_produto) < 0)
    return res.status(400).json({ erro: 'Valor do produto inválido.' });
  if (!id_categoria)
    return res.status(400).json({ erro: 'Categoria obrigatória.' });
  try {
    const [result]: any = await db.execute(
      'INSERT INTO produto (dc_produto, vl_produto, id_categoria) VALUES (?, ?, ?)',
      [dc_produto.trim(), Number(vl_produto), Number(id_categoria)]
    );
    const [rows]: any = await db.execute('SELECT * FROM produto WHERE id_produto = ?', [result.insertId]);
    res.status(201).json({ recurso: rows[0] });
  } catch (err: unknown) {
    res.status(500).json({ erro: err instanceof Error ? err.message : 'Erro interno' });
  }
});

app.put('/produto/:id', async (req, res) => {
  const { dc_produto, vl_produto, id_categoria } = req.body as { dc_produto?: string; vl_produto?: number; id_categoria?: number };
  if (!dc_produto || dc_produto.trim().length < 2)
    return res.status(400).json({ erro: 'Nome do produto inválido.' });
  if (vl_produto == null || Number(vl_produto) < 0)
    return res.status(400).json({ erro: 'Valor do produto inválido.' });
  if (!id_categoria)
    return res.status(400).json({ erro: 'Categoria obrigatória.' });
  try {
    const [result]: any = await db.execute(
      'UPDATE produto SET dc_produto = ?, vl_produto = ?, id_categoria = ? WHERE id_produto = ?',
      [dc_produto.trim(), Number(vl_produto), Number(id_categoria), req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Produto não encontrado.' });
    const [rows]: any = await db.execute('SELECT * FROM produto WHERE id_produto = ?', [req.params.id]);
    res.json({ recurso: rows[0] });
  } catch (err: unknown) {
    res.status(500).json({ erro: err instanceof Error ? err.message : 'Erro interno' });
  }
});

app.delete('/produto/:id', async (req, res) => {
  try {
    const [result]: any = await db.execute('DELETE FROM produto WHERE id_produto = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.status(204).send();
  } catch (err: unknown) {
    res.status(500).json({ erro: err instanceof Error ? err.message : 'Erro interno' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n API rodando em http://0.0.0.0:${PORT}`);
  console.log(` DB: ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}\n`);
});
