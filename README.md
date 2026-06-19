# Projeto Integração Mobile + Backend

Atividade escolar SENAI — aplicativo Expo + React Native consumindo uma API REST local com banco de dados MySQL.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

---

## Estrutura do projeto

```
/
├── server.ts                        ← API backend (Express + TypeScript)
├── src/database/connection.ts       ← Pool MySQL2 (singleton)
├── .env                             ← credenciais do banco (não commitado)
├── docs/db.sql                      ← script SQL do banco
├── package.json                     ← dependências do backend
└── Integrate-Mobile-and-Backend/    ← app mobile (Expo + React Native)
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- MySQL rodando localmente na porta `3306`
- [Expo Go](https://expo.dev/go) instalado no celular
- Celular e computador na **mesma rede Wi-Fi**

---

## 1. Configurar o banco de dados

Execute o script SQL no seu MySQL:

```bash
mysql -u root -p < docs/db.sql
```

Isso cria o banco `stockmobile`, as tabelas e insere os dados iniciais.

---

## 2. Configurar o `.env`

Crie um arquivo `.env` na raiz com as credenciais:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=1234
DB_DATABASE=stockmobile

PORT=3000
```

---

## 3. Subir a API (backend)

Na raiz do projeto, instale as dependências na primeira vez:

```bash
npm install
```

### Scripts disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| Desenvolvimento | `npm start` | Executa com `ts-node` (sem compilar) |
| Build | `npm run build` | Compila TypeScript para `dist/` |
| Produção | `npm run start:prod` | Executa o JavaScript compilado em `dist/` |

#### Desenvolvimento (recomendado)

```bash
npm start
```

#### Produção

```bash
npm run build
npm run start:prod
```

O terminal deve exibir:

```
API rodando em http://0.0.0.0:3000
DB: root@localhost:3306/stockmobile
```

> **Atenção:** se o IP da máquina mudar, atualize `BASE_URL` em  
> `Integrate-Mobile-and-Backend/src/api/api.ts` para o novo IP.

### Endpoints disponíveis

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/categoria` | Lista todas as categorias |
| POST | `/categoria` | Cria uma categoria |
| PUT | `/categoria/:id` | Atualiza uma categoria |
| DELETE | `/categoria/:id` | Remove uma categoria |
| GET | `/produto` | Lista todos os produtos |
| POST | `/produto` | Cria um produto |
| PUT | `/produto/:id` | Atualiza um produto |
| DELETE | `/produto/:id` | Remove um produto |

---

## 4. Subir o app mobile (Expo)

Em um **novo terminal**, entre na pasta do mobile:

```bash
cd Integrate-Mobile-and-Backend
```

Instale as dependências na primeira vez:

```bash
npm install
```

Inicie o Expo:

```bash
npx expo start
```

Escaneie o QR code exibido no terminal com o app **Expo Go** no celular.

---

## Resumo (rodar os dois ao mesmo tempo)

**Terminal 1 — API:**
```bash
npm start
```

**Terminal 2 — Mobile:**
```bash
cd Integrate-Mobile-and-Backend && npx expo start
```
