-- ============================================================
-- Banco de dados: stockmobile
-- Servidor: localhost:3306  |  Usuário: root
-- ============================================================

CREATE DATABASE IF NOT EXISTS stockmobile
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE stockmobile;

-- ─── TABELA: categoria ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS categoria (
  id_categoria INT          NOT NULL AUTO_INCREMENT,
  dc_categoria VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── TABELA: produto ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS produto (
  id_produto   INT            NOT NULL AUTO_INCREMENT,
  dc_produto   VARCHAR(255)   NOT NULL,
  vl_produto   DECIMAL(10, 2) NOT NULL,
  id_categoria INT            NOT NULL,
  PRIMARY KEY (id_produto),
  CONSTRAINT fk_produto_categoria
    FOREIGN KEY (id_categoria)
    REFERENCES categoria (id_categoria)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── DADOS INICIAIS ──────────────────────────────────────────

INSERT INTO categoria (dc_categoria) VALUES
  ('Bebidas'),
  ('Alimentos'),
  ('Limpeza'),
  ('Higiene');

INSERT INTO produto (dc_produto, vl_produto, id_categoria) VALUES
  ('Refrigerante 2L',    8.50,  1),
  ('Suco de Laranja 1L', 6.90,  1),
  ('Arroz 5kg',         24.90,  2),
  ('Feijão 1kg',         9.90,  2),
  ('Detergente 500ml',   3.50,  3),
  ('Água Sanitária 1L',  4.20,  3),
  ('Sabonete',           2.99,  4),
  ('Shampoo 400ml',     14.90,  4);
