# Pokémon Team Builder

A full-stack web application that allows users to search for Pokémon, build a team of up to 6, and save it with a shareable link.

## Live Demo
[pokemon-team-builder-client-five.vercel.app](https://pokemon-team-builder-client-five.vercel.app)

## Tech Stack

**Frontend**
- React + TypeScript
- Vite
- Material UI (MUI)
- React Router

**Backend**
- Node.js + Express
- Prisma ORM
- SQLite

## Features

- Search for any Pokémon by name via PokéAPI
- Add up to 6 Pokémon to your team
- View Pokémon sprites and types
- Save your team with a unique shareable link
- View any saved team via its URL

## Project Structure

```
pokemon-team-builder/
├── client/          # React + TypeScript frontend
└── server/          # Node.js + Express + Prisma backend
```

## Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/VinnyL12/pokemon-team-builder.git
cd pokemon-team-builder
```

2. Install root dependencies
```bash
npm install
```

3. Install and set up the server
```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
```

4. Install the client
```bash
cd ../client
npm install
```

### Running the App

Open two terminals:

**Terminal 1 — Backend**
```bash
cd server && npm run dev
```

**Terminal 2 — Frontend**
```bash
cd client && npm run dev
```

Then visit `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pokemon/search/:name` | Search for a Pokémon by name |
| GET | `/api/teams` | Get all saved teams |
| GET | `/api/teams/:slug` | Get a team by slug |
| POST | `/api/teams` | Create a new team |