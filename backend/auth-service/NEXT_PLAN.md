# Krish Hortus Backend: Next Steps & Roadmap

## Current Status
- [x] Auth-Service: Production-ready (JWT, refresh, migrations, docs)
- [ ] User-Service: Next up
- [ ] Tree-Service
- [ ] Media-Service
- [ ] Analytics-Service
- [ ] AI-Service
- [ ] API-Gateway

---

## Next Steps (User-Service)
- [ ] Review User entity and DB schema (UUID, fields)
- [ ] Implement endpoints: get/update profile, change password
- [ ] Integrate with Auth-Service (JWT, user ID)
- [ ] Add Flyway migrations for user tables
- [ ] Add validation, error handling, docs
- [ ] Test endpoints (Postman)
- [ ] Document with Swagger/OpenAPI

## General Execution Plan (For All Services)
1. Review current code and DB schema
2. Align entities and DB (UUIDs, constraints)
3. Implement/complete all endpoints
4. Secure endpoints (JWT, roles)
5. Add/verify Flyway migrations
6. Add validation, error handling, and JavaDoc
7. Test endpoints (Postman, automated tests)
8. Document endpoints (Swagger/OpenAPI)

## Production-Readiness Checklist
- [ ] Secure secrets and config
- [ ] Logging and monitoring
- [ ] CI/CD pipeline
- [ ] Automated tests
- [ ] API documentation
- [ ] Security review

---

## How to Update This File
- Check off items as you complete them
- Add new tasks as needed
- Keep this as the single source of truth for backend progress

---
Next up:
Review and align the user-service code, schema, and documentation, following the same high standards.
**For detailed setup and usage, see `README.md` in each service.** 