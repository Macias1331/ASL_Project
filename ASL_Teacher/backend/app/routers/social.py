from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app import schemas, models
from app.core import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.User])
async def list_friends(
    db: AsyncSession = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    # Logic to get accepted friends
    # Since existing logic is complex self-referential, simplified here:
    # Need to query Friendship table where (user_id=me OR friend_id=me) AND status='accepted'
    # Then fetch the *other* user.
    
    # Simplified approach for v1: just return users who I sent requests to and they accepted
    # Production would need a Union query
    
    stmt = (
        select(models.User)
        .join(models.Friendship, models.Friendship.friend_id == models.User.id)
        .where(models.Friendship.user_id == current_user.id)
        .where(models.Friendship.status == models.FriendshipStatus.ACCEPTED.value)
    )
    result = await db.execute(stmt)
    friends_sent = result.scalars().all()
    
    stmt2 = (
        select(models.User)
        .join(models.Friendship, models.Friendship.user_id == models.User.id)
        .where(models.Friendship.friend_id == current_user.id)
        .where(models.Friendship.status == models.FriendshipStatus.ACCEPTED.value)
    )
    result2 = await db.execute(stmt2)
    friends_received = result2.scalars().all()
    
    return friends_sent + friends_received

@router.post("/request/{username}")
async def send_request(
    username: str,
    db: AsyncSession = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    target_result = await db.execute(select(models.User).filter_by(username=username))
    target_user = target_result.scalars().first()
    
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if target_user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot friend yourself")
        
    # Create request
    # Check existing
    existing = await db.execute(
        select(models.Friendship).where(
            ((models.Friendship.user_id == current_user.id) & (models.Friendship.friend_id == target_user.id)) |
            ((models.Friendship.user_id == target_user.id) & (models.Friendship.friend_id == current_user.id))
        )
    )
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail="Friendship or request already exists")
        
    new_friendship = models.Friendship(
        user_id=current_user.id,
        friend_id=target_user.id,
        status=models.FriendshipStatus.PENDING.value
    )
    db.add(new_friendship)
    await db.commit()
    return {"message": "Friend request sent"}
