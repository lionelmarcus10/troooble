# Challenge Orchestrator Service

API service built with Go and Chi router.

## Requirements

- Go 1.25.1 or higher

## I. Installation

### 1. Install Go

Follow the official installation guide: https://go.dev/doc/install

Verify installation:

```bash
go version
```

### 2. Install dependencies

```bash
cd challenge-orchestrator-service
go mod download
```

## II. Running the service

### 1. Development

```bash
go run ./cmd/api
```

The server starts on port `5000`.

### 2. Build and run

```bash
go build -o bin/api ./cmd/api
./bin/api
```

## Project Structure

```
challenge-orchestrator-service/
    cmd/
        api/          # Application (API) entrypoints
    internal/         # Private application code
```

### cmd/

Contains application entrypoints. Each subdirectory is an executable.

| Folder | Description |
|--------|-------------|
| `api/` | Main HTTP server entrypoint |

### internal/

Contains private packages not importable by external projects.

| Folder | Description |
|--------|-------------|
| `config/` | Configuration loading and validation |
| `domain/` | Core business entities |
| `handlers/` | HTTP request handlers and route registration |
| `middleware/` | HTTP middleware (auth, logging, etc.) |
| `repository/` | Database access layer |
| `services/` | Business logic |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |


## Backend todo

- [ ] Add new routes for : 
    - [ ] Destroying a challenge infrastructure ( undeploy )
    - [ ] Creating a challenge infrastructure ( deploy )
    - [ ] Getting the status of a challenge infrastructure ( validation )    
    - [ ] webhook endpoint to receive updates from jenkins about the status of the pipelines

- [ ] send requests to jenkins to trigger pipelines for deploying and undeploying challenge infrastructures
    - [ ] Send update to db
    - [ ] Send notification updates to user