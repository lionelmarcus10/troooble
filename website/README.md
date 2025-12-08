# Website

Next.js web application with Prisma ORM.

## Requirements

- Node.js 18+ or Bun 1.0+ (recommended)
- Docker (optional, for containerized deployment)

## I. Installation

### 1. Install runtime

**Bun (recommended):** https://bun.sh/docs/installation

**Node.js:** https://nodejs.org/en/download

Verify installation:

```bash
bun --version
# or
node --version
```

### 2. Install dependencies

```bash
cd website
```

**With Bun:**

```bash
bun install
bunx prisma generate
```

**With npm:**

```bash
npm install
npx prisma generate
```

## II. Running the application

### 1. Development

**With Bun:**

```bash
bun dev
```

**With npm:**

```bash
npm run dev
```

The server starts on http://localhost:3000

### 2. Production build

**With Bun:**

```bash
bun run build
bun start
```

**With npm:**

```bash
npm run build
npm start
```

## III. Docker

### 1. Requirements

**Docker:** https://docs.docker.com/get-docker/

### 2. Build image

```bash
docker build -t troooble-website .
```

### 3. Run container

```bash
docker run -p 3000:3000 troooble-website
```

The application is available at http://localhost:3000
