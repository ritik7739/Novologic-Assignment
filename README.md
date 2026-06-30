# Novologic Online Workbook

Novologic Online Workbook is a full-stack rich text workbook application built with Next.js, NestJS, GraphQL, Prisma, PostgreSQL, and local file uploads. It supports editable workbook content, image/PDF uploads, inline PDF page embedding, autosave, version history, restore, and file deletion from both the database and the upload folder.

This README is written so a new developer can clone the project, configure it, seed it, run it, and understand how the main pieces work.

## Table Of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Install Dependencies](#install-dependencies)
- [Migrations And Seeding](#migrations-and-seeding)
- [Run The Application](#run-the-application)
- [URLs](#urls)
- [How Uploads Work](#how-uploads-work)
- [How Autosave And Versions Work](#how-autosave-and-versions-work)
- [GraphQL API](#graphql-api)
- [Useful Commands](#useful-commands)
- [Troubleshooting](#troubleshooting)
- [Development Notes](#development-notes)

## Features

- Rich text workbook editor powered by Tiptap.
- Image upload support with direct insertion into the workbook.
- PDF upload support that renders each PDF page as an image and appends those images directly into the workbook content.
- Drag and drop upload support.
- Local static file serving from the backend.
- Autosave for workbook content.
- Manual save with keyboard shortcut support.
- Version history with restore support.
- File list sidebar with insert and delete actions.
- File deletion removes both:
  - the database metadata row
  - the physical file from the backend upload folder
- Seed script creates the first user, workbook, and initial version.
- GraphQL API for user, workbook, file metadata, and version operations.

## Tech Stack

### Frontend

- Next.js 14 App Router
- React 18
- TypeScript
- Apollo Client
- Tiptap editor
- PDF.js through `pdfjs-dist` for client-side PDF page rendering
- Tailwind CSS
- Framer Motion
- Sonner toasts
- Lucide icons

### Backend

- NestJS 10
- GraphQL with Apollo Server
- Prisma ORM
- PostgreSQL
- Multer for file upload
- Local static file serving for uploaded files

### Infrastructure

- Docker Compose for local PostgreSQL
- Local filesystem upload storage

## Project Structure

```text
Assignment-Novologic/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   ├── src/
│   │   ├── file/
│   │   ├── user/
│   │   ├── workbook/
│   │   ├── version/
│   │   ├── prisma/
│   │   └── main.ts
│   ├── uploads/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   ├── .env.example
│   └── package.json
├── docker-compose.yml
├── package.json
└── README.md
```

## Prerequisites

Install these before running the project:

- Node.js 18 or newer
- npm
- Docker and Docker Compose
- Git

Recommended versions:

```bash
node -v
npm -v
docker --version
docker compose version
```

PostgreSQL can be run with Docker using the included `docker-compose.yml`. You can also use a hosted PostgreSQL database such as Neon, Supabase, Railway, or Render, but the `.env` values must point to a reachable database.

## Environment Setup

Create environment files from the examples.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### Backend Environment

File: `backend/.env`

For local Docker PostgreSQL, use:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/novologic_db?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/novologic_db?schema=public"
PORT=4000
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB=10
NODE_ENV=development
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

For Neon or another hosted PostgreSQL provider, use the provider connection strings:

```env
DATABASE_URL="postgresql://USER:PASSWORD@YOUR_POOLER_HOST/DB_NAME?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@YOUR_DIRECT_HOST/DB_NAME?sslmode=require"
PORT=4000
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB=10
NODE_ENV=development
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

Backend variable details:

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Prisma app connection string. Used by the backend at runtime. |
| `DIRECT_URL` | Yes | Prisma migration connection string. For local PostgreSQL it can match `DATABASE_URL`. |
| `PORT` | Yes | Backend port. Default expected by the frontend is `4000`. |
| `UPLOAD_DIR` | Yes | Folder where uploaded image/PDF files are stored. |
| `MAX_FILE_SIZE_MB` | Yes | Maximum upload size in MB. |
| `NODE_ENV` | No | Use `development` locally. |
| `CORS_ORIGINS` | No | Comma-separated frontend origins allowed by the backend. |

### Frontend Environment

File: `frontend/.env.local`

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_UPLOAD_URL=http://localhost:4000/upload
NEXT_PUBLIC_FILES_BASE_URL=http://localhost:4000
```

Frontend variable details:

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_GRAPHQL_URL` | Yes | GraphQL endpoint used by Apollo Client and server-side user loading. |
| `NEXT_PUBLIC_UPLOAD_URL` | Yes | REST upload endpoint used for image/PDF uploads. |
| `NEXT_PUBLIC_FILES_BASE_URL` | Yes | Base URL used when rendering uploaded files in the editor. |

## Database Setup

### Option 1: Local PostgreSQL With Docker

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Check that PostgreSQL is running:

```bash
docker ps
```

Expected container:

```text
novologic-postgres
```

The Docker database uses:

| Setting | Value |
| --- | --- |
| Host | `localhost` |
| Port | `5432` |
| Database | `novologic_db` |
| User | `postgres` |
| Password | `password` |

Stop PostgreSQL:

```bash
docker compose down
```

Stop PostgreSQL and delete local database data:

```bash
docker compose down -v
```

### Option 2: Hosted PostgreSQL

If you use Neon or another hosted database:

1. Create a PostgreSQL database.
2. Copy the pooled connection string into `DATABASE_URL`.
3. Copy the direct connection string into `DIRECT_URL`.
4. Confirm your network can reach the database host.
5. Run migrations and seed as shown below.

If the backend prints `PrismaClientInitializationError: P1001`, the database is not reachable from your machine or the connection string is wrong.

## Install Dependencies

Install backend and frontend dependencies:

```bash
npm run install:all
```

This runs:

```bash
npm i --prefix backend
npm i --prefix frontend
```

You can also install manually:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Migrations And Seeding

Run these commands after the database is running and `.env` files are configured.

### 1. Apply Prisma Migrations

```bash
npm run db:migrate --prefix backend
```

This creates the database tables defined in `backend/prisma/schema.prisma`.

Main tables:

- `User`
- `Workbook`
- `WorkbookVersion`
- `File`

### 2. Seed Initial Data

From the root folder:

```bash
npm run seed
```

Or from the backend folder:

```bash
cd backend
npm run seed
```

The seed script creates or updates this user:

```text
Name: Ritik
Email: ritik@novologic.com
Address: Noida, Uttar Pradesh, India
Phone: +91 9135855899
```

It also creates one workbook for that user if no workbook exists yet.

Initial workbook content:

```text
Novologic Workbook
Start writing your workbook...
```

It also creates the first workbook version.

### 3. Reset Local Database From Scratch

Use this only when you want to delete local Docker database data.

```bash
docker compose down -v
docker compose up -d postgres
npm run db:migrate --prefix backend
npm run seed
```

## Run The Application

Use two terminals. This is the most reliable local startup flow.

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

Expected backend URL:

```text
http://localhost:4000
```

GraphQL endpoint:

```text
http://localhost:4000/graphql
```

Upload endpoint:

```text
http://localhost:4000/upload
```

Uploaded files are served from:

```text
http://localhost:4000/uploads/<filename>
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

Expected frontend URL:

```text
http://localhost:3000
```

Open:

```text
http://localhost:3000
```

### Optional Root Dev Script

The root `package.json` has:

```bash
npm run dev
```

This script uses `concurrently`. If `concurrently` is not installed in the root project, install it first or use the two-terminal flow above.

```bash
npm install --save-dev concurrently
npm run dev
```

## URLs

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend | `http://localhost:4000` |
| GraphQL | `http://localhost:4000/graphql` |
| Upload REST endpoint | `http://localhost:4000/upload` |
| Uploaded files | `http://localhost:4000/uploads/<filename>` |

## How Uploads Work

The frontend uploads files using the REST endpoint:

```text
POST http://localhost:4000/upload
```

The request sends:

- `file`
- `workbookId`

The backend:

1. Validates file size using `MAX_FILE_SIZE_MB`.
2. Allows only:
   - `image/jpeg`
   - `image/png`
   - `image/gif`
   - `image/webp`
   - `application/pdf`
3. Saves the physical file into `UPLOAD_DIR`.
4. Generates a UUID-based filename.
5. Returns upload metadata to the frontend.

The frontend then saves file metadata through GraphQL:

```graphql
mutation UploadFileMetadata {
  uploadFileMetadata(
    workbookId: "..."
    name: "..."
    mimeType: "..."
    size: 123
    storageKey: "/uploads/..."
  ) {
    id
    name
    storageKey
  }
}
```

### Image Upload Behavior

For image files, the frontend:

1. Uploads the image through `POST /upload`.
2. Saves the returned metadata through `uploadFileMetadata`.
3. Inserts a regular Tiptap `image` node into the editor using the uploaded file URL.

### PDF Upload Behavior

PDFs are not embedded with an iframe or native browser PDF viewer.

For PDF files, the frontend:

1. Uploads the original PDF through `POST /upload`.
2. Saves the original PDF metadata through `uploadFileMetadata`, so it remains visible in the Files sidebar for reference/download.
3. Uses PDF.js on the client to parse the PDF page by page.
4. Renders each page into an off-screen canvas at scale `2`.
5. Converts each canvas to a PNG image blob.
6. Uploads each rendered page image through the same `POST /upload` endpoint.
7. Saves metadata for each page image.
8. Inserts the rendered page images into the Tiptap document as normal `image` nodes, in original page order.
9. Adds paragraph breaks between page images so the PDF appears as a vertical stack of pages in the workbook.

Only the rendered page images are inserted into `Workbook.content`. The original PDF is stored as a separate uploaded file record and is not used as the embedded editor content.

The frontend caps PDF embedding at 50 pages. If a PDF has more pages, only the first 50 pages are rendered and inserted.

The old custom Tiptap PDF node has been removed. The editor should not render `<iframe>` elements for PDFs.

### File Deletion Behavior

When a file is deleted from the UI:

1. The frontend calls the GraphQL `deleteFile` mutation.
2. The backend finds the file metadata row.
3. The backend deletes the physical file from `UPLOAD_DIR`.
4. The backend deletes the database row.
5. The workbook query is refetched so the sidebar updates.

If the physical file is already missing, deletion still succeeds and the database row is removed.

## How Autosave And Versions Work

The editor stores Tiptap JSON content in the `Workbook.content` JSON column.

Autosave flow:

1. User edits the workbook.
2. Tiptap emits an update.
3. The frontend schedules a save.
4. The frontend calls the `saveWorkbook` GraphQL mutation.
5. The backend updates the workbook content.
6. The backend records a workbook version.

Version behavior:

- Versions are stored in `WorkbookVersion`.
- Restore uses the `restoreVersion` mutation.
- Version history is capped by backend service logic.
- Restoring a version updates the current workbook editor content.

## GraphQL API

GraphQL endpoint:

```text
http://localhost:4000/graphql
```

### Queries

```graphql
query CurrentUser {
  currentUser {
    id
    name
    email
    address
    phone
  }
}
```

```graphql
query GetWorkbook($userId: String!) {
  workbook(userId: $userId) {
    id
    content
    updatedAt
    files {
      id
      name
      mimeType
      size
      storageKey
      createdAt
    }
  }
}
```

```graphql
query GetVersions($workbookId: String!) {
  workbookVersions(workbookId: $workbookId) {
    id
    content
    savedAt
  }
}
```

### Mutations

```graphql
mutation SaveWorkbook($workbookId: String!, $content: JSONObject!) {
  saveWorkbook(workbookId: $workbookId, content: $content) {
    id
    content
    updatedAt
  }
}
```

```graphql
mutation DeleteFile($fileId: String!) {
  deleteFile(fileId: $fileId)
}
```

```graphql
mutation RestoreVersion($versionId: String!) {
  restoreVersion(versionId: $versionId) {
    id
    content
    updatedAt
  }
}
```

## Data Model

### User

Represents the current user. The seed creates one user.

Important fields:

- `id`
- `name`
- `email`
- `address`
- `phone`

### Workbook

Represents editable workbook content.

Important fields:

- `id`
- `userId`
- `content`
- `createdAt`
- `updatedAt`

### WorkbookVersion

Stores saved snapshots of workbook content.

Important fields:

- `id`
- `workbookId`
- `content`
- `savedAt`

### File

Stores upload metadata.

Important fields:

- `id`
- `workbookId`
- `name`
- `mimeType`
- `size`
- `storageKey`
- `createdAt`

## Useful Commands

### Root

```bash
npm run install:all
npm run seed
npm run build:all
```

### Backend

```bash
cd backend
npm run dev
npm run build
npm run start
npm run db:migrate
npm run db:push
npm run db:studio
npm run seed
npm run test
npm run test:e2e
```

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run start
npm run type-check
npm run lint
```

## Verification Checklist

After setup, verify these:

1. PostgreSQL is running.

```bash
docker ps
```

2. Migrations completed successfully.

```bash
npm run db:migrate --prefix backend
```

3. Seed completed successfully.

```bash
npm run seed
```

4. Backend starts without Prisma connection errors.

```bash
cd backend
npm run dev
```

5. GraphQL responds.

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { currentUser { id name email } }"}'
```

6. Frontend starts.

```bash
cd frontend
npm run dev
```

7. Browser opens the workbook.

```text
http://localhost:3000
```

8. Upload an image and confirm:

- it appears in the sidebar
- it is inserted into the editor as an image
- it exists in `backend/uploads`

9. Upload a multi-page PDF and confirm:

- the original PDF appears in the sidebar
- each PDF page appears in the editor as a separate stacked image
- page order matches the PDF order
- no iframe appears in the editor
- the rendered page images exist in `backend/uploads`
- reloading the workbook keeps the embedded page images

10. Delete the file from the UI and confirm:

- it disappears from the sidebar
- the physical file is removed from `backend/uploads`

## Troubleshooting

### Workbook failed to load

This usually means the frontend cannot load data from GraphQL.

Check:

1. Backend is running.

```bash
cd backend
npm run dev
```

2. GraphQL URL is correct in `frontend/.env.local`.

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

3. Database is reachable.

If backend logs show:

```text
PrismaClientInitializationError: P1001
```

Then the database host cannot be reached. Fix `DATABASE_URL` and `DIRECT_URL`, or start local PostgreSQL:

```bash
docker compose up -d postgres
```

4. Database is migrated and seeded.

```bash
npm run db:migrate --prefix backend
npm run seed
```

### GraphQL returns Workbook not found

The seed data is missing.

Run:

```bash
npm run seed
```

### Upload fails

Check:

- Backend is running on port `4000`.
- `NEXT_PUBLIC_UPLOAD_URL` is `http://localhost:4000/upload`.
- File type is supported.
- File size is less than `MAX_FILE_SIZE_MB`.
- `backend/uploads` exists or can be created by the backend process.

### Uploaded file appears broken in the editor

Check:

- `NEXT_PUBLIC_FILES_BASE_URL=http://localhost:4000`
- Backend static file serving is running.
- The file exists in `backend/uploads`.
- The stored `storageKey` begins with `/uploads/`.

### Delete removes file from UI but not folder

The backend delete mutation should remove both metadata and the physical upload. Confirm the backend is running the latest code and that the `UPLOAD_DIR` points to the same folder where uploads are saved.

For the default local setup:

```env
UPLOAD_DIR="./uploads"
```

The folder is:

```text
backend/uploads
```

### CORS error

Add the frontend URL to backend `CORS_ORIGINS`.

```env
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

Restart the backend after changing `.env`.

### Port already in use

Find the process:

```bash
lsof -i :4000
lsof -i :3000
```

Stop the process or change the port.

If changing the backend port, update all frontend URLs in `frontend/.env.local`.

### Prisma Studio

Open Prisma Studio to inspect database rows:

```bash
cd backend
npm run db:studio
```

## Production Notes

This project currently uses local filesystem uploads. That is fine for local development, but production deployments usually need object storage.

Recommended production changes:

- Use S3, Cloudflare R2, Supabase Storage, or similar for uploads.
- Store public file URLs or storage keys in the database.
- Keep `DATABASE_URL` and `DIRECT_URL` in the deployment provider secrets.
- Configure production CORS origins.
- Use a managed PostgreSQL database.
- Run Prisma migrations during deployment.

## Development Notes

- GraphQL schema is generated automatically by NestJS.
- The generated schema file is `backend/src/schema.gql`.
- Prisma schema is `backend/prisma/schema.prisma`.
- Seed file is `backend/prisma/seed.ts`.
- Frontend Apollo queries and mutations are in `frontend/src/lib/graphql`.
- Editor logic is in `frontend/src/components/editor`.
- File upload UI is in `frontend/src/components/files`.
- PDF page rendering utility is in `frontend/src/lib/utils/pdfToImages.ts`.
- Upload orchestration for images and PDFs is in `frontend/src/hooks/useFileUpload.ts`.
- Version history UI is in `frontend/src/components/versions`.

## Fresh Setup Summary

For a completely fresh local setup:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Update `backend/.env` for local Docker PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/novologic_db?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/novologic_db?schema=public"
PORT=4000
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB=10
NODE_ENV=development
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

Then run:

```bash
docker compose up -d postgres
npm run install:all
npm run db:migrate --prefix backend
npm run seed
```

Start backend:

```bash
cd backend
npm run dev
```

Start frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:3000
```
