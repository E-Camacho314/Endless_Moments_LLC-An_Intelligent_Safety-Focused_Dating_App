#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID=${PROJECT_ID:?set PROJECT_ID}
REGION=${REGION:-us-central1}
INSTANCE_NAME=${INSTANCE_NAME:-lyra-sql}
DB_NAME=${DB_NAME:-lyra}
DB_USER=${DB_USER:-lyra_user}
DB_PASS=${DB_PASS:-'StrongPass123!'}
SERVICE_NAME=${SERVICE_NAME:-lyra-backend}
REPO_NAME=${REPO_NAME:-lyra-repo}

gcloud config set project $PROJECT_ID

gcloud sql instances create $INSTANCE_NAME   --database-version=POSTGRES_15   --cpu=1 --memory=4GiB --region=$REGION || true
gcloud sql databases create $DB_NAME --instance=$INSTANCE_NAME || true
gcloud sql users create $DB_USER --instance=$INSTANCE_NAME --password "$DB_PASS" || true

CONNECTION_NAME="$PROJECT_ID:$REGION:$INSTANCE_NAME"
export DATABASE_URL="postgresql+psycopg2://${DB_USER}:${DB_PASS}@/${DB_NAME}?host=/cloudsql/${CONNECTION_NAME}"

gcloud artifacts repositories create $REPO_NAME --repository-format=docker --location=$REGION --description="Lyra images" || true
gcloud auth configure-docker ${REGION}-docker.pkg.dev -q

pushd backend
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:$(date +%Y%m%d-%H%M%S)"
docker build -t $IMAGE .
docker push $IMAGE
popd

gcloud run deploy $SERVICE_NAME   --image $IMAGE   --region $REGION   --platform managed   --allow-unauthenticated   --add-cloudsql-instances $CONNECTION_NAME   --set-env-vars "DATABASE_URL=${DATABASE_URL}"   --set-env-vars "OPENAI_API_KEY=${OPENAI_API_KEY:-}"   --set-env-vars "STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-}"   --set-env-vars "STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET:-}"   --set-env-vars "PERSONA_API_KEY=${PERSONA_API_KEY:-}"   --set-env-vars "PERSONA_TEMPLATE_ID=${PERSONA_TEMPLATE_ID:-}"   --set-env-vars "PERSONA_ENV=${PERSONA_ENV:-production}"

SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format='value(status.url)')
echo "Cloud Run URL: $SERVICE_URL"

pushd backend
alembic -x DATABASE_URL="${DATABASE_URL}" upgrade head || true
popd
