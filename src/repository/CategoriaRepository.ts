// import { getDB } from "../api/database";
// import { Categoria } from "../models/Categoria";
// import * as SQLite from "expo-sqlite";

// export class CategoriasRepository {

//   //usando async em todos os métodos para garantir que erros sejam capturados e tratados corretamente, e para manter a consistência na forma como as operações assíncronas são realizadas
//   async create(categoria: Categoria): Promise<SQLite.SQLiteRunResult> {
//     try {
//       const db = await getDB();
//       if (!db) throw new Error("Database não inicializada");
//       const result = await db.runAsync(`INSERT INTO categorias (nome) VALUES (?);`, [categoria.Nome]);
//       return result;
//     } catch (error) {
//       throw new Error("Erro ao criar categoria", { cause: error });
//     }
//   }

//   async findAll(): Promise<Categoria[]> {
//     try {
//       const db = await getDB();
//       if (!db) throw new Error("Database não inicializada");
//       const result = await db.getAllAsync<Categoria>(`SELECT * FROM categorias;`);
//       return result;
//     } catch (error) {
//       throw new Error("Erro ao buscar categorias", { cause: error });
//     }
//   }

//   async delete(id: number): Promise<SQLite.SQLiteRunResult> {
//     try {
//       const db = await getDB();
//       if (!db) throw new Error("Database não inicializada");
//       const result = await db.runAsync(`DELETE FROM categorias WHERE id = ?;`, [id]);
//       return result;
//     } catch (error) {
//       throw new Error("Erro ao deletar categoria", { cause: error });
//     }
//   }

//   async update(categoria: Categoria): Promise<SQLite.SQLiteRunResult> {
//     try {
//       const db = await getDB();
//       if (!db) throw new Error("Database não inicializada");
//       const result = await db.runAsync(`UPDATE categorias SET nome = ? WHERE id = ?;`, [categoria.Nome, categoria.Id]);
//       return result;
//     } catch (error) {
//       throw new Error("Erro ao atualizar categoria", { cause: error });
//     }
//   }
// }
