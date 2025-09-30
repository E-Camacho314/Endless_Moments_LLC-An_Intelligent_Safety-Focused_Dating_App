from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_form(request: Request):
    return templates.TemplateResponse("profile_form.html", {"request": request})

@app.post("/create_profile/", response_class=HTMLResponse)
async def create_profile(
    request: Request,
    name: str = Form(...),
    age: int = Form(...),
    gender: str = Form(...),
    email: str = Form(...),
    bio: str = Form(""),
    interests: str = Form(""),
    profile_picture: str = Form("")
):
    # simple validation
    if not name or not email:
        return templates.TemplateResponse("error.html", {
            "request": request,
            "message": "Name and Email are required fields!"
        })

    if age <= 0:
        return templates.TemplateResponse("error.html", {
            "request": request,
            "message": "Age must be a positive number!"
        })

    return templates.TemplateResponse("profile_success.html", {
        "request": request,
        "name": name,
        "age": age,
        "gender": gender,
        "email": email,
        "bio": bio,
        "interests": interests,
        "profile_picture": profile_picture
    })
