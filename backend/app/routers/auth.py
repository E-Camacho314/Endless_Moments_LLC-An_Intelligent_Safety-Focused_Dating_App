from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
import google.auth.transport.requests
import requests
import os

router = APIRouter()

# ----------------------------
# Step 1: Google Login Endpoint
# ----------------------------
@router.get("/auth/google")
def google_login():
    flow = Flow.from_client_secrets_file(
        "app/client_secret.json",
        scopes=[
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "openid",
        ],
        redirect_uri="http://127.0.0.1:8000/auth/callback",
    )
    auth_url, _ = flow.authorization_url(prompt="consent")
    return RedirectResponse(url=auth_url)


# ----------------------------
# Step 2: Google Callback Endpoint
# ----------------------------
@router.get("/auth/callback")
def google_callback(request: Request):
    try:
        flow = Flow.from_client_secrets_file(
            "app/client_secret.json",
            scopes=[
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
                "openid",
            ],
            redirect_uri="http://127.0.0.1:8000/auth/callback",
        )

        flow.fetch_token(authorization_response=str(request.url))
        credentials = flow.credentials

        session = requests.Session()
        token = credentials.token
        user_info = session.get(
            "https://www.googleapis.com/oauth2/v1/userinfo",
            headers={"Authorization": f"Bearer {token}"},
        ).json()

        print("✅ User Info:", user_info)

        frontend_url = (
            f"http://localhost:3000/auth/success?"
            f"name={user_info.get('name', '')}"
            f"&email={user_info.get('email', '')}"
            f"&picture={user_info.get('picture', '')}"
        )

        return RedirectResponse(url=frontend_url)

    except Exception as e:
        print("❌ Error in Google Callback:", str(e))
        return {"error": str(e)}
