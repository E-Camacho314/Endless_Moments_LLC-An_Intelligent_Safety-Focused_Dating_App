from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
import google.auth.transport.requests
from urllib.parse import urlencode
import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# Google OAuth login
@router.get("/auth/google")
def google_login():
    # Read path from .env or default location
    secret_path = os.getenv("GOOGLE_CLIENT_SECRET_PATH", "app/client_secret.json")

    # Ensure the file exists
    if not os.path.exists(secret_path):
        raise FileNotFoundError(f"Missing or incorrect client_secret.json path: {secret_path}")

    # Build the OAuth flow
    flow = Flow.from_client_secrets_file(
        secret_path,
        scopes=[
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "openid",
        ],
        redirect_uri="http://127.0.0.1:8000/auth/callback",  # Backend redirect
    )
    auth_url, _ = flow.authorization_url(prompt="consent")
    return RedirectResponse(url=auth_url)


# Google OAuth callback
@router.get("/auth/callback")
def google_callback(request: Request):
    try:
        secret_path = os.getenv("GOOGLE_CLIENT_SECRET_PATH", "app/client_secret.json")

        flow = Flow.from_client_secrets_file(
            secret_path,
            scopes=[
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
                "openid",
            ],
            redirect_uri="http://127.0.0.1:8000/auth/callback",
        )

        # Exchange authorization code for access token
        flow.fetch_token(authorization_response=str(request.url))
        credentials = flow.credentials

        # Fetch user profile info
        session = requests.Session()
        token = credentials.token
        user_info = session.get(
            "https://www.googleapis.com/oauth2/v1/userinfo",
            headers={"Authorization": f"Bearer {token}"},
        ).json()

        print("✅ Google User Info:", user_info)

        # Redirect to frontend success page
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
        