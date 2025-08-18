# TaskWise - AI-Powered Task Manager

TaskWise is a modern, AI-driven task management application built with Next.js and PostgreSQL. It leverages AI to provide intelligent suggestions for task creation and offers analytics to track your productivity.

## Features

-   **AI Task Suggestions:** Get smart suggestions for task titles, descriptions, priorities, and time estimates.
-   **Full CRUD Functionality:** Create, read, update, and delete tasks.
-   **Task Prioritization:** Assign priorities (Low, Medium, High, Urgent) to your tasks.
-   **Light/Dark Mode:** Switch between themes for your comfort.
-   **AI-Powered Reporting:** Analyze your task history to get insights into your productivity.
-   **Responsive Design:** Works beautifully on desktop and mobile devices.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/)
-   **Database:** [PostgreSQL](https://www.postgresql.org/)
-   **ORM:** [Prisma](https://www.prisma.io/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **AI Integration:** (Simulated) Gemini API

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [npm](https://www.npmjs.com/)
-   [PostgreSQL](https://www.postgresql.org/download/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd taskwise
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    -   Make sure your PostgreSQL server is running.
    -   Create a new database (e.g., `taskwise`).
    -   Create a `.env` file in the root of the project. You can copy the existing one but make sure to use your credentials.
    -   Update the `DATABASE_URL` in your `.env` file with your PostgreSQL connection string:
        ```
        DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
        ```
        (Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your credentials).

4.  **Run the database migration:**
    This will create the necessary tables in your database.
    ```bash
    npx prisma migrate dev
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## How to Use

-   Go to the homepage to manage your tasks.
-   Type an idea for a new task in the input field to get AI suggestions.
-   Accept the suggestions or fill out the form manually to create a new task.
-   Mark tasks as complete using the checkmark button.
-   Navigate to the `/reporting` page to get an AI-powered analysis of your activity.