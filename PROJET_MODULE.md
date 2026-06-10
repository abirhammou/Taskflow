# Module Projet — Backend `ms-projet` + Front `Projets/KPI`

Ce document décrit l'ajout du **module Gestion des projets** (microservice `ms-projet`)
et de son **front Angular** (écrans Projets, Phases, dashboard KPI) dans TaskFlow.

Branche : `projet-module`.

---

## 1. Ce qui a été ajouté

### Backend — `TaskFlow_backend/ms-projet/` (nouveau service)
- CRUD **Projets** + **Phases**, calcul **KPI temps réel**, scheduler de retards, events RabbitMQ.
- Spring Boot 3.3.4, H2 in-memory (seed automatique de 3 projets), Eureka, OpenFeign, RabbitMQ.
- **Port `8083`** (8081 = task-service, 8082 = user-service).
- `pom.xml` rendu **standalone** (aligné sur les autres services du repo, plus de parent multi-module).

### Front — `frontend/src/app/`
| Fichier | Rôle |
|---|---|
| `models/projet.model.ts` | Types Projet/Phase/Kpi/KpiSnapshot + enums + helpers couleurs |
| `services/projet.service.ts` | Appels REST vers le gateway (`http://localhost:8085`) |
| `frontoffice/projects/projects.component.*` | Liste réelle (filtres, recherche, stats, CRUD) |
| `frontoffice/projects/project-detail/*` | Détail : phases + **dashboard KPI ApexCharts** |
| `dialogs/projet-dialog.component.*` | Modale création/édition projet |
| `dialogs/phase-dialog.component.*` | Modale création/édition phase |

> L'écran `projects` existait mais affichait des données **codées en dur** : il est
> désormais branché sur le backend. La route `/app/projects` + l'entrée navbar existaient déjà.

### Fichiers partagés modifiés (à relire au merge)
1. `TaskFlow_backend/ApiGateway/.../ApiGatewayApplication.java`
   → route ajoutée : `/api/projets/**`, `/api/phases/**`, `/api/kpi/**` → `http://localhost:8083`.
2. `frontend/src/app/frontoffice/frontoffice.module.ts`
   → déclare `ProjectDetailComponent`, importe `NgApexchartsModule`.
3. `frontend/src/app/frontoffice/frontoffice-routing.module.ts`
   → route `projects/:id`.
4. `frontend/angular.json`
   → budget `initial` relevé (`1mb`/`2mb`) car le template de base dépassait déjà 1 MB.

---

## 2. Endpoints (via gateway `:8085`, JWT Keycloak requis)

```
GET    /api/projets            ?statut=&priorite=&chefId=
GET    /api/projets/{id}
POST   /api/projets
PUT    /api/projets/{id}
DELETE /api/projets/{id}

GET    /api/projets/{id}/phases
POST   /api/projets/{id}/phases
PUT    /api/phases/{phaseId}
DELETE /api/phases/{phaseId}

GET    /api/kpi/projets/{id}              # KPI temps réel
POST   /api/kpi/projets/{id}/snapshot     # historise un snapshot
GET    /api/kpi/projets/{id}/historique
```

Le token Keycloak est ajouté **automatiquement** par l'`AuthInterceptor` existant.

---

## 3. Lancer en local

```bash
# 1. Infra (Keycloak + Postgres + RabbitMQ)
docker compose up -d

# 2. Backend (IntelliJ ou mvn), dans l'ordre :
#    Eureka (8761) -> ApiGateway (8085) -> task-service / user-service / ms-projet (8083) -> auth-service (3000)
cd TaskFlow_backend/ms-projet && mvn spring-boot:run

# 3. Front
cd frontend && npm install && ng serve
# -> http://localhost:4200  (login Keycloak, realm 'taskflow')
# -> menu "Projects"
```

Vérifs : Eureka `http://localhost:8761` doit lister `MS-PROJET`.
Console H2 du service : `http://localhost:8083/h2-console` (JDBC `jdbc:h2:mem:projetdb`).

### Comptes de test (realm `taskflow`)
| Rôle | Email | Mot de passe | Redirige vers |
|---|---|---|---|
| USER | user@taskflow.com | User@1234 | `/app/tasks` |
| ADMIN | admin@taskflow.com | Admin@1234 | `/dashboard` |

> ⚠️ L'écran **Projets est dans le front-office** (`/app/projects`), protégé par `AuthGuard`
> qui **redirige les ADMIN vers `/dashboard`**. Pour tester les projets, connecte-toi en **USER**,
> puis menu « Projects ».

### Services minimaux pour tester l'écran Projets
Pas besoin de MongoDB ni de l'auth-service (ceux-ci ne servent qu'au profil) :
`docker-compose up -d` (Keycloak + RabbitMQ) → **Eureka** → **ApiGateway** → **ms-projet** → `ng serve`.

---

## 4. Point de coordination — KPI ↔ task-service

La KPI temps réel agrège les **tâches d'un projet** via Feign (`app.services.tache=task-service`).
Or `task-service` expose `/task/getAll` avec un modèle `{id,title,description,dueDate,completed}`
**sans `projetId`**. Tant que le contrat n'est pas aligné, la KPI reste **résiliente** (renvoie 0,
pas d'erreur). Pour des KPI réelles, s'accorder avec l'équipe Tâches sur :
- un endpoint `GET /api/taches?projetId=` (ou un champ `projetId` sur la tâche),
- l'event RabbitMQ `tache.completed` (déjà écouté par `ms-projet`).

En attendant, l'avancement par **phases** (saisi à la main) fonctionne sans dépendance.

---

## 5. Merge

```bash
git checkout -b projet-module       # déjà fait
git add .
git commit -m "feat(projet): microservice ms-projet + front Projets/Phases/KPI"
git push -u origin projet-module
# puis Pull Request projet-module -> main
```
