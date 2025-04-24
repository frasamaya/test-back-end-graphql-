# Test Back-End GraphQL

A GraphQL-based back-end application built with **Node.js**, **TypeScript**, **Prisma**, and **Apollo Server**.

## ✨ Features

- GraphQL API for managing **Proposals**, **Steps**, and **Days**
- Supports **pagination**, **filtering**, and **sorting**
- **Prisma ORM** for database management
- **TypeScript** for type safety
- **Prettier** and **ESLint** for code formatting and linting

---

## 🚀 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) (v8 or later)
- [PostgreSQL](https://www.postgresql.org/) or another supported database

---

## 🛠️ Getting Started

### 1. Clone the Repository

```
git clone https://github.com/your-repo/test-back-end-graphql.git
cd test-back-end-graphql
```

### 2. Install Dependencies

```
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and add the following:

```
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
PORT=4000
```

> Replace `username`, `password`, `localhost`, `5432`, and `database_name` with your actual PostgreSQL credentials.

---

## 🧱 Database Setup

### 1. Generate Prisma Client

```
npx prisma generate
```

### 2. Run Database Migrations

```
npx prisma migrate dev --name init
```

This will apply the migrations and create the necessary tables.

---

## 💻 Running the Application

### 1. Start the Development Server

```
npm run dev
```

> The server will run on `http://localhost:4000` (or your custom port in `.env`).

### 2. Access the GraphQL Playground

Open your browser and go to:

```
http://localhost:4000/graphql
```

Use the Playground to test and explore your GraphQL API.

---

## 📜 Available Scripts

| Command           | Description                               |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the development server (hot-reload) |
| `npm run start`   | Compile & start the production server     |
| `npm run lint`    | Check for ESLint issues                   |
| `npm run format`  | Format the codebase using Prettier        |
| `npm run test`    | Run unit tests via Jest                   |
| `npm run compile` | Compile TypeScript to JavaScript          |

---

## ✅ Testing

To run unit tests:

```
npm run test
```

---

## 💡 Code Quality

### Linting

```
npm run lint
```

### Formatting

```
npm run format
```

---

## 📁 Folder Structure

```
test-back-end-graphql/
├── prisma/             # Prisma schema and migrations
├── src/
│   ├── resolvers/      # GraphQL resolvers
│   ├── schema/         # GraphQL schema definitions
│   └── index.ts        # Application entry point
├── .env                # Environment configuration
├── package.json
└── tsconfig.json
```

---

## 🛠️ Troubleshooting

### ❌ Database Connection Error

- Check `DATABASE_URL` in your `.env` file
- Ensure your database server is running

### ⚠️ Prisma Client Not Found

- Run `npx prisma generate` to regenerate the client

### 🔁 Port Already in Use

- Change the `PORT` value in the `.env` file to a free port

---

## 📄 License

This project is licensed under the **ISC License**.
