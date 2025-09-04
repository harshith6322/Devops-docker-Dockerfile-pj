# Docker Multi-Stack — README

**Project:** docker-multi-stack
**Author:** Harshith

---

## Overview

This repository contains production-ready Dockerfiles for multiple front-end and back-end stacks with a focus on small image size and reduced CVE exposure. The stacks included are:

1. `docker-for-reactapp` — React (TypeScript) build using `pnpm` and served with `nginx` (multi-stage).
2. `docker-for-angular` — Angular build (multi-stage) and served with `nginx`.
3. `docker-for-nodeapp` — Node.js API/app using a builder/runtime multi-stage, runs with a non-root user and `pm2-runtime` for process management.
4. `docker-for-mernapp` — MERN stack (uses same patterns as React + Node). A `docker-compose.yml` exists in the MERN folder but — per project decision — compose usage is not documented in-depth in this README.

Each Dockerfile follows multi-stage patterns, uses slim/alpine base images where appropriate, removes dev dependencies before the runtime image, and includes subtle production hardening steps (non-root user, healthchecks, STOPSIGNAL, cache cleaning).

---

## Goals & Principles

* **Small images:** multi-stage builds, slim/alpine images, remove build artifacts from final image.
* **Security-first:** minimal packages, non-root runtime, use `pnpm`/`npm ci`, `npm prune --production`, and recommended scanning with Trivy.
* **Production friendly:** healthchecks, STOPSIGNAL, explicit `CMD`, proper ownership of files served by `nginx`.
* **Reproducible builds:** use frozen lockfiles (`pnpm --frozen-lockfile`, `npm ci`) to ensure deterministic installs.

---

## Repo layout (example)

```
/docker-for-reactapp/
  └── Dockerfile
/docker-for-angular/
  └── Dockerfile
/docker-for-nodeapp/
  └── Dockerfile
/docker-for-mernapp/
  └── Dockerfile
  └── docker-compose.yml   # present but omitted from README usage
README.md
.dockerignore
```

> Tip: add a `.dockerignore` at each stack root to exclude `node_modules`, `dist`, `.git`, local env files, etc.

---

## Prerequisites

* Docker (Engine) installed (recommended >= 20.10)
* Optional: Docker Compose (if you want to use the `docker-compose.yml` for MERN locally)
* Trivy installed for CVE scanning (optional but recommended)

---

## Build & Run — examples

Below are example commands for building and running each stack. Run them from the repository root or the specific stack folder.

### 1) React (TypeScript) — `docker-for-reactapp`

**Build**

```bash
# from repo root (adjust path if needed)
docker build -t react-app:latest -f docker-for-reactapp/Dockerfile docker-for-reactapp
```

**Run**

```bash
docker run -d --rm -p 8080:80 --name react-app react-app:latest
# visit http://localhost:8080
```
<img width="1237" height="101" alt="Screenshot 2025-09-04 175334" src="https://github.com/user-attachments/assets/ac70038b-e91f-464a-a90c-bcffc92b7c98" />
<img width="1919" height="939" alt="Screenshot 2025-09-04 175107" src="https://github.com/user-attachments/assets/49e3a697-56ff-4fc6-83c3-1ab51b02f4fa" />
<img width="1889" height="590" alt="Screenshot 2025-09-04 173907" src="https://github.com/user-attachments/assets/3506729a-2bb3-4298-96b5-018e1ade8317" />


Notes: The Dockerfile uses `node:lts-trixie-slim` for build and `nginx:stable-alpine3.21-perl` for serving static files. The final image contains only the built `dist` served by nginx.

---

### 2) Angular — `docker-for-angular`

**Build**

```bash
docker build -t angular-app:latest -f docker-for-angular/Dockerfile docker-for-angular
```

**Run**

```bash
docker run -d --rm -p 8081:80 --name angular-app angular-app:latest
# visit http://localhost:8081
```
<img width="1916" height="955" alt="Screenshot 2025-09-04 153829" src="https://github.com/user-attachments/assets/853f8ed1-f0dc-4371-9701-507b04fac452" />
<img width="1336" height="265" alt="Screenshot 2025-09-04 153807" src="https://github.com/user-attachments/assets/e0162247-c32e-446c-891f-d79621537f6a" />
<img width="1882" height="772" alt="Screenshot 2025-09-04 173930" src="https://github.com/user-attachments/assets/8b2d0219-8168-41dd-94ae-759f56d02124" />


Notes: Make sure the `COPY --from=builder` path matches your Angular project name (`/app/dist/<project-name>`).

---

### 3) Node API / App — `docker-for-nodeapp`

**Build**

```bash
docker build -t node-app:latest -f docker-for-nodeapp/Dockerfile docker-for-nodeapp
```

**Run**

```bash
docker run -d --rm -p 3000:3000 --name node-app node-app:latest
```
<img width="689" height="288" alt="Screenshot 2025-09-04 175017" src="https://github.com/user-attachments/assets/46acb282-7b47-4fb4-9dd7-5c7bef290e1b" />
<img width="1422" height="422" alt="Screenshot 2025-09-04 174913" src="https://github.com/user-attachments/assets/33e9b040-b28a-4cd3-8ac6-7391eb3689a1" />

Notes:

* Dockerfile uses multi-stage with `npm ci` in the builder and `npm prune --production` to remove dev deps.
* The runtime creates a non-root user `appuser` and runs `pm2-runtime` to handle signals and clustering. If you prefer a single-process mode, replace the `CMD` to `node server.js` or adjust `pm2` config.
* A `HEALTHCHECK` probes `http://127.0.0.1:3000/health` — make sure your app exposes a `/health` endpoint (or update the command).

---

### 4) MERN — `docker-for-mernapp`

This repo contains a MERN implementation that reuses patterns from the React and Node Dockerfiles.

Per project note, `docker-compose.yml` exists in the MERN folder but composition usage is intentionally **not** documented in-depth here. If you want compose-based local development, that file will orchestrate frontend, backend, and database services.

---

## Security scanning with Trivy

Trivy is recommended to scan built images for known CVEs.

**Scan local image**

```bash
trivy image --severity HIGH,CRITICAL --no-progress react-app:latest
```

If you prefer a quick summary:

```bash
trivy image --format table --severity HIGH,CRITICAL react-app:latest
```

**Common remediation steps**

* Update the base image to a newer `node:lts-*-slim` or `nginx:stable-alpine` tag when a CVE affects the base.
* Pin package versions and update vulnerable npm packages (use `npm audit` / `pnpm audit`).
* Remove unnecessary packages and minimize package surface area.

---

## Image size & optimization checklist

The Dockerfiles already employ multiple optimizations. Use this checklist to keep images small:

* [x] Multi-stage builds (separate build and runtime stages)
* [x] Use slim/alpine base images
* [x] Remove build-time dependencies from final image (`npm prune --production` / not installing devDeps)
* [x] `npm cache clean --force`, `pnpm` cache best practices
* [x] Use `--frozen-lockfile` or `npm ci` for reproducible installs
* [x] Use `.dockerignore` to cut context size
* [x] Create a non-root runtime user
* [x] Combine `RUN` steps where possible to reduce layers (but keep readability)

---

## Production hardening & best-practices

* Set `NODE_ENV=production` in runtime images.
* Run as non-root user (already in Node Dockerfile).
* Add `HEALTHCHECK` to detect failing apps early.
* Explicit `STOPSIGNAL SIGTERM` to allow graceful shutdown.
* Avoid `apt-get upgrade` in Dockerfiles — prefer minimal base images and explicit package installs.
* Pin base image tags in CI (e.g., `node:18.20.0-slim`) and update them regularly.
* Consider multi-arch builds if you need ARM support.

---

## Common gotchas & troubleshooting (short)

* **Static files not found (React/Angular):** ensure the `COPY --from=builder` source path matches the build output. For Angular, the dist folder is usually `dist/<project-name>`.
* **Permission denied with nginx:** ensure final files are `chown`ed to `nginx:nginx` if your image expects that user.
* **Healthcheck failing:** verify the endpoint and port inside the container. Use `docker exec -it <id> wget -qO- http://127.0.0.1:3000/health` to test.
* **Port conflicts on host:** map to alternate ports (e.g., `-p 8080:80`).
* **Large final image:** inspect layers with `docker history <image>` and remove or squash layers that add large artifacts.

---

## CI/CD suggestions

* Build images in CI using pinned base image tags.
* Run `trivy` scans during the pipeline and fail on HIGH/CRITICAL CVEs.
* Push images to a registry with immutable tags (e.g., `registry.example.com/project/react-app:20250905-<git-sha>`).
* Use vulnerability gating or runtime scanning in your cluster (e.g., admission controller to block images with critical findings).

---

## Files to review / TODO

* Add or update `.dockerignore` for each stack
* Pin base image versions instead of floating `latest` variants
* Add small `Makefile` or helper scripts for `build`, `scan`, `run`, `clean`
* Add a minimal `README` in each stack folder pointing to this top-level README

---

## License & Credits

This project is by Harshith. Choose a license and add it to the repo (for example `MIT`).

---


