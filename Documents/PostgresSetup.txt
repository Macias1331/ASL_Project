# ASL Project — PostgreSQL Setup & Running Guide

How to install PostgreSQL, set up the database, and run the project locally.

---

## Step 1 — Install PostgreSQL 18

1. Go to **postgresql.org/download** and click **Windows**
2. Click "Download the installer" and download the latest version
3. Run the installer and keep all default options
4. When asked for a password — set it to: `asl_secure_password`
5. Keep the default port: `5432`
6. When Stack Builder pops up at the end — click **Skip** or **Cancel**

---

## Step 2 — Make Sure PostgreSQL is Running

1. Press **Windows + R**, type `services.msc`, and hit Enter
2. Scroll down and find **postgresql-x64-18**
3. If it says **Stopped** → right-click → **Start**
4. If it says **Running** → you are good to go

---

## Step 3 — Create the Database

1. Open **pgAdmin 4** from your Start menu
2. In the left panel expand **Servers → PostgreSQL 18**
3. Enter `asl_secure_password` when asked for the password
4. Expand **Databases** → click on **postgres** to select it
5. Click **Tools** in the top menu → **Query Tool**

Run the first query (click Execute or press F5):
```sql
CREATE USER asl_admin WITH PASSWORD 'asl_secure_password';
```

Clear the editor, then run the second query:
```sql
CREATE DATABASE asl_teacher_db OWNER asl_admin;
```

Both should say: **Query returned successfully**

> **Note:** Run the two queries separately — not at the same time.

---

## Step 4 — Install Python Dependencies

First make sure you have Python 3.11 installed. Then in a terminal run:

cd ASL_Teacher/backend
py -3.11 -m venv venv
venv\Scripts\activate

Then install all required packages:

pip install -r requirements.txt
pip install opencv-python scipy pandas scikit-learn bcrypt==4.0.1

---

## Step 5 — Install Frontend Dependencies

cd ASL_Teacher/frontend
npm install

---

## Step 6 — Running the Project

Open **3 terminals** in VS Code every time you want to run the project:

### Terminal 1 — Auth Backend
```bash
cd ASL_Teacher/backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```
You should see: `INFO: Uvicorn running on http://127.0.0.1:8000`

### Terminal 2 — CV Backend
```bash
cd ASL_Teacher/backend
venv\Scripts\activate
uvicorn main:app --reload --port 8001
```
You should see: `INFO: Uvicorn running on http://127.0.0.1:8001`

### Terminal 3 — Frontend
```bash
cd ASL_Teacher/frontend
npm run dev
```
Then open your browser and go to: **http://localhost:5173**

---

## Troubleshooting

### Connection timeout or password failed in pgAdmin
- Open Services (Windows + R → `services.msc`) and make sure **postgresql-x64-18** is Running
- If the password is wrong, open **SQL Shell (psql)** from the Start menu
- Press Enter through all prompts, then run:
```sql
ALTER USER postgres WITH PASSWORD 'asl_secure_password';
```

### "CREATE DATABASE cannot run inside a transaction block"
- Run the two SQL queries **separately** — not together at the same time
- Run the `CREATE USER` query first, then clear and run `CREATE DATABASE`

### "Could not reach the server" on the login page
- Make sure PostgreSQL is running in Services
- Make sure all 3 terminals are running (see Step 6)
- Check that the `.env` file exists in `ASL_Teacher/backend/`

### Port already in use
- Another process is using port 8000 or 8001
- Close the other terminal running the backend, or restart your computer
