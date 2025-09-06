# Project: Science Olympiad CodeBusters 2025 Cipher Practice

## 📝 Project Overview

This is a comprehensive web application designed to help middle school students practice various ciphers for Science Olympiad competitions. It provides an interactive platform with different cipher types, progressive difficulty levels, real-time feedback, statistics tracking, user profiles with Google OAuth, and a tutorial system. The application also includes educational content on cryptography and engineering articles.

## 🛠️ Technology Stack

*   **Backend:** Python Flask with SQLAlchemy (ORM)
*   **Frontend:** HTML5, CSS3, JavaScript
*   **Database:** SQLite (for local development) / PostgreSQL (for production)
*   **Authentication:** Google OAuth 2.0
*   **Deployment:** Google App Engine
*   **Storage:** Google Cloud Storage (for user profiles)

## 🚀 Building and Running

### Prerequisites

*   Python 3.11 or higher
*   Google Cloud SDK (for deployment)
*   Git

### Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd scioly
    ```
2.  **Set up environment variables:**
    Copy the template and fill in your actual credentials for Google OAuth and local database.
    ```bash
    cp .env.template .env
    # Edit .env with your actual credentials
    ```
3.  **Install dependencies and run the server:**
    This script will create a virtual environment, install all necessary Python packages, and start the Flask development server.
    ```bash
    ./dev.sh
    ```
    The application will typically be available at `http://localhost:8080`.

### Production Deployment (Google App Engine)

1.  **Set up Google Cloud credentials:**
    Copy the template and fill in your actual production credentials for Google OAuth and Cloud SQL.
    ```bash
    cp app.yaml.template app.yaml
    # Edit app.yaml with your production credentials (DB_USER, DB_PASS, DB_NAME, DB_HOST, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
    ```
    **Important:** Ensure your Cloud SQL database user has `ALL PRIVILEGES` on the database and its tables/sequences. If not, connect to your PostgreSQL instance via Cloud Shell and run:
    ```sql
    GRANT ALL PRIVILEGES ON DATABASE "your_db_name" TO "your_db_user";
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "your_db_user";
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "your_db_user";
    ```
2.  **Deploy to Google App Engine:**
    This script will deploy your application to Google App Engine. It will interactively ask for your Google Cloud Project ID.
    ```bash
    ./deploy.sh
    ```
    Your application will be live at a `*.uc.r.appspot.com` URL.

## 📐 Development Conventions

*   **Code Structure:**
    *   `main.py`: Core Flask application logic and routes.
    *   `static/`: Contains static assets like CSS (`styles.css`), JavaScript (`script.js`), and images.
    *   `templates/`: Stores Jinja2 HTML templates (e.g., `index.html`, `dashboard.html`).
    *   `articles/`: Houses educational engineering articles (e.g., `time_systems.html`).
    *   `requirements.txt`: Lists all Python package dependencies.
    *   `dev.sh`, `deploy.sh`: Shell scripts for local development and cloud deployment workflows.
    *   `.env.template`, `app.yaml.template`: Templates for environment-specific configurations.
*   **Security Best Practices:**
    *   Sensitive credentials (like API keys and database passwords) are managed through environment variables and are explicitly excluded from version control (`.gitignore`).
    *   Google OAuth 2.0 is implemented for secure user authentication.
    *   SQLAlchemy ORM is used to prevent SQL injection vulnerabilities.
*   **Styling:** The application uses a warm color theme, with a focus on accessibility and a unified visual design language across different sections.
*   **Client-Side Logic:** Interactive elements and cipher implementations are handled by JavaScript in `static/js/script.js`.
*   **Testing:** The `main.py` includes a `runTests()` function, suggesting a pattern for client-side testing and debugging.
*   **Database Migrations:** The `main.py` includes logic for assigning `public_id` to users, indicating a pattern for database schema evolution or data migration.
