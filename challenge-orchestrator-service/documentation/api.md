# API Documentation

## Authentication

All `/challenges/*` routes require a Supabase JWT token in the Authorization header:

```
Authorization: Bearer <supabase_token>
```

## Endpoints

### Deploy Challenge

```
POST /challenges/deploy
```

**Body:**
```json
{
  "challengeId": "string"
}
```

**Response (202):**
```json
{
  "jobId": "uuid",
  "status": "pending"
}
```

---

### Destroy Deployment

```
POST /challenges/{deploymentId}/destroy
```

**Response (202):**
```json
{
  "jobId": "uuid",
  "status": "pending"
}
```

---

### Validate Challenge

```
POST /challenges/{deploymentId}/validate
```

**Body:**
```json
{
  "flag": "string"
}
```

**Response (202):**
```json
{
  "jobId": "uuid",
  "status": "pending"
}
```

---

### Jenkins Webhook

```
POST /jenkins/webhook
```

**Body:**
```json
{
  "jobName": "string",
  "buildNumber": 123,
  "status": "SUCCESS|FAILURE",
  "params": {}
}
```

**Response (200):**
```json
{
  "status": "received"
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_KEY` | Yes | Supabase anon key |
| `JENKINS_URL` | Yes | Jenkins server URL |
| `JENKINS_USER` | Yes | Jenkins username |
| `JENKINS_TOKEN` | Yes | Jenkins API token |
| `SERVER_PORT` | No | Server port (default: 5000) |
