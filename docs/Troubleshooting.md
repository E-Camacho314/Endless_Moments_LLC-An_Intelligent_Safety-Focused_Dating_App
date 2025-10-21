# Troubleshooting
- 401/403: Ensure your proxy uses the correct NEXT_PUBLIC_API_BASE / EXPO_PUBLIC_API_BASE.
- 429: Add rate limits at gateway (Cloud Armor/Cloudflare) or FastAPI middleware.
- 5xx: Check Cloud Run logs; confirm DATABASE_URL points to Cloud SQL socket; run Alembic.
