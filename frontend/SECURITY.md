# Security Notes

- Use HTTPS in production (Ingress/Load Balancer TLS). Consider cert-manager for Kubernetes.
- Store secrets in a secret manager; never commit. Provide `SECRET_KEY`, DB creds via env.
- JWT: rotate secrets periodically; use short-lived access tokens and refresh rotation.
- CORS: restrict origins in production using `CORS_ORIGINS`.
- Rate limiting: basic in-app limiter available; prefer Redis-backed solutions (FastAPI-Limiter) in prod.
- CSP headers recommended on frontend via reverse proxy (Nginx) or platform settings.
- Dependency scanning: set up Dependabot and container scanning (Trivy/GHAS).
- Set `SENTRY_DSN` to enable error reporting. Avoid logging secrets.
