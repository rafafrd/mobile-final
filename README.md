# Projeto Integração Mobile + Backend

Atividade escolar SENAI — aplicativo Expo + React Native consumindo uma API REST local com banco de dados SQLite.

---

## Estrutura do projeto

```
/
├── server.js                        ← API backend (Express + SQLite)
├── package.json                     ← dependências do backend
├── dados.db                         ← banco SQLite gerado automaticamente
└── Integrate-Mobile-and-Backend/    ← app mobile (Expo + React Native)
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [Expo Go](https://expo.dev/go) instalado no celular
- Celular e computador na **mesma rede Wi-Fi**

---

## 1. Subir a API (backend)

Na raiz do projeto, instale as dependências na primeira vez:

```bash
npm install
```

Inicie o servidor:

```bash
node server.js
```

O terminal deve exibir:

```
API rodando em http://0.0.0.0:3000
Acesse pelo mobile: http://10.87.169.91:3000
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

## 2. Subir o app mobile (Expo)

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
node server.js
```

**Terminal 2 — Mobile:**
```bash
cd Integrate-Mobile-and-Backend && npx expo start
```
