## Setup

### 1. Start Keycloak
```bash
docker-compose up -d
```
Wait 30 seconds, then open http://localhost:8096/admin (admin/admin)

### 2. Start auth-service
```bash
cd TaskFlow_backend/auth-service
npm install
npm start
```

### 3. Start backend services
Open IntelliJ → run Eureka, ApiGateway, Task_service

### 4. Start frontend
```bash
cd frontend
npm install
ng serve
```

### 5. Login
Go to http://localhost:4200/authentication/login
- Admin: admin@taskflow.com / Admin@1234
- Or register a new account