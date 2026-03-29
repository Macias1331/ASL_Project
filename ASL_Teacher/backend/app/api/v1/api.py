from fastapi import APIRouter
from app.routers import auth, game, social

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(game.router, prefix="/game", tags=["game"])
api_router.include_router(social.router, prefix="/social", tags=["social"])
