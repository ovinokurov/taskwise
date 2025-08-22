## Project Overview

This is a full-stack AI-powered task management application named **TaskWise**. It is built with [Next.js](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/), uses [PostgreSQL](https://www.postgresql.org/) for the database with [Prisma](https://www.prisma.io/) as the ORM, and is styled with [Tailwind CSS](https://tailwindcss.com/).

The application allows users to manage tasks through a modern interface. The core features include:
- An interactive calendar for task visualization.
- AI-powered task creation from natural language.
- A chat interface to query tasks using natural language.
- AI-generated productivity analysis and reports.
- Full CRUD (Create, Read, Update, Delete) functionality for tasks.
- Task prioritization and status tracking.
- Light and dark mode support.

The AI functionalities are powered by the [OpenAI API](https://openai.com/api/).

## Building and Running

### Prerequisites
- Node.js (v18 or later)
- npm
- PostgreSQL

### Setup and Execution
1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Database Setup:**
    - Ensure your PostgreSQL server is running.
    - Create a `.env` file from the `.env.example` file.
    - Configure the `DATABASE_URL` and `OPENAI_API_KEY` in the `.env` file.
3.  **Run Database Migrations:**
    ```bash
    npx prisma migrate dev
    ```
4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

### Other Commands
-   **Build for Production:**
    ```bash
    npm run build
    ```
-   **Start Production Server:**
    ```bash
    npm run start
    ```
-   **Lint the Code:**
    ```bash
    npm run lint
    ```

## Development Conventions

### Code
- The project is written in **TypeScript**.
- The codebase is located in the `src` directory.
- **Next.js App Router** is used for routing. The pages and API routes are located in `src/app`.
- **React Server Components** and **Client Components** are used. Look for the `'use client';` directive at the top of files.
- Global layout is defined in `src/app/layout.tsx`.

### Styling
- **Tailwind CSS** is used for styling.
- The configuration is in `tailwind.config.ts`.
- Global styles are in `src/app/globals.css`.
- **`next-themes`** is used for light/dark mode, configured in `tailwind.config.ts` with `darkMode: "class"`.

### Database
- **Prisma** is the ORM.
- The database schema is defined in `prisma/schema.prisma`.
- Database migrations are managed by Prisma Migrate.

### API
- API routes are located in `src/app/api`.
- The project uses the OpenAI API for AI-powered features.

### Linting
- **ESLint** is used for linting. The configuration is in `eslint.config.mjs`.
