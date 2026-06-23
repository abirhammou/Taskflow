# TaskFlow

TaskFlow is a microservices-based task & project management platform with JWT authentication (Keycloak), service discovery (Eureka), an API Gateway, and asynchronous communication between services via RabbitMQ.

## Services

| Service | Stack | Port | Responsibility |
|---|---|---|---|
| Angular Frontend | Angular + Material/Bootstrap | 4200 | UI |
| API Gateway | Spring Cloud Gateway | 8085 | Routing, JWT validation, CORS |
| Eureka | Spring Cloud Netflix | 8761 | Service discovery |
| Task Service | Spring Boot, H2 | 8081 | Task CRUD, stats |
| Project Service | Spring Boot, H2 | 8082 | Project CRUD, task assignment |
| Auth Service | Node/Express, MongoDB | 3000 | User registration & profiles |
| Keycloak | Keycloak 24 | 8096 | OIDC / JWT identity provider |
| RabbitMQ | RabbitMQ 3 management | 5672 / 15672 | Async events (task ↔ project) |
| Prometheus | Prometheus | 9090 | Metrics scraping |
| Grafana | Grafana | 3001 | Metrics dashboards |

## Event-driven communication

When a task is assigned to a project, `project-service` publishes a `TaskAssignedEvent` to the `taskflow.exchange` topic exchange with routing key `task.assigned`. The `project.task.assigned` queue is consumed by `TaskEventConsumer`, which keeps the project's `taskIds` in sync. Acknowledgement is manual: success → `basicAck`, failure → `basicNack` without requeue.

## Prerequisites

- Docker & Docker Compose
- JDK 17+
- Node.js 18+
- Angular CLI

## Setup

### Option A — Full Docker Compose (recommended)

```bash
docker-compose up -d
```

This starts Keycloak, Eureka, RabbitMQ, MongoDB, Task Service, Project Service, API Gateway, Auth Service, Prometheus, and Grafana.

Wait ~30 seconds for Keycloak to import the realm, then check:

- Eureka dashboard: http://localhost:8761
- Keycloak admin console: http://localhost:8096/admin (admin/admin)
- RabbitMQ management: http://localhost:15672 (guest/guest)

### Option B — Hybrid (local development)

Useful when actively developing a backend service and you want hot-reload from your IDE.

1. Start infra only:
   ```bash
   docker-compose up -d rabbitmq keycloak mongo
   ```
2. Run `Eureka`, `ApiGateway`, `Task_service`, `Project_service` from IntelliJ, in that order.
3. Start `auth-service`:
   ```bash
   cd TaskFlow_backend/auth-service
   npm install
   npm start
   ```

### Frontend

```bash
cd frontend
npm install
ng serve
```

### Login

Go to http://localhost:4200/authentication/login

- Admin: `admin@taskflow.com` / `Admin@1234`
- Or register a new account

## API Documentation (Swagger / OpenAPI)

| Service | Swagger UI |
|---|---|
| Task Service | http://localhost:8081/swagger-ui/index.html |
| Project Service | http://localhost:8082/swagger-ui/index.html |
| Auth Service | http://localhost:3000/api-docs |

Raw OpenAPI specs are also reachable through the gateway, e.g. `http://localhost:8085/task-service/v3/api-docs`.

## Monitoring

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin)

## Git workflow

- Commit convention: `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`
- Regular, atomic commits per feature/fix — avoid a single "final version" commit
- One branch per feature, merged via pull request with a short description

## Project structure

```
TaskFlow/
├── TaskFlow_backend/
│   ├── Eureka/
│   ├── ApiGateway/
│   ├── Task_service/
│   ├── Project_service/
│   └── auth-service/
├── frontend/
├── docker-compose.yml
└── prometheus.yml
```
