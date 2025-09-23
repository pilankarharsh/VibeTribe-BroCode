# 🚀 VibeTribe API Demo Workflow

This demonstrates the complete user journey through your Instagram-like app.

## Prerequisites
1. Start the server: `cd backend && npm run dev`
2. Server should be running on http://localhost:5000

## 🔥 **Complete API Workflow Demo**

### Step 1: Create First User (Bootstrap)
Since invite codes require authentication, we need to manually create the first invite code in MongoDB or modify the system temporarily. For demo purposes:

```bash
# Option A: Create first user without invite code (modify controller temporarily)
# Or Option B: Add a seed user to database directly
```

### Step 2: Generate Invite Code
```bash
curl -X POST http://localhost:5000/api/auth/invite-code \
  -H "Authorization: Bearer YOUR_FIRST_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"intendedFor": "newuser@example.com"}'

# Response: {"_id":"...","code":"ABC123",...}
```

### Step 3: Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com", 
    "password": "StrongPass123!",
    "inviteCode": "ABC123"
  }'

# Response: {"token":"eyJ...","user":{...}}
```

### Step 4: Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "johndoe",
    "password": "StrongPass123!"
  }'

# Response: {"token":"eyJ...","user":{...}}
# Save this token as USER_TOKEN
```

### Step 5: Update Profile
```bash
curl -X PATCH http://localhost:5000/api/users/USER_ID \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "John Doe",
    "bio": "Hello VibeTribe! 👋",
    "avatarUrl": "https://example.com/avatar.jpg"
  }'
```

### Step 6: Create Posts
```bash
# Create first post
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "caption": "My first post on VibeTribe! 🎉",
    "mediaUrls": ["https://example.com/image1.jpg"]
  }'

# Create second post
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "caption": "Beautiful sunset today 🌅",
    "mediaUrls": ["https://example.com/sunset.jpg"]
  }'

# Response: {"id":"POST_ID","caption":"...","likeCount":0,...}
```

### Step 7: Interact with Posts
```bash
# Like a post
curl -X POST http://localhost:5000/api/posts/POST_ID/like \
  -H "Authorization: Bearer USER_TOKEN"

# Add comment
curl -X POST http://localhost:5000/api/posts/POST_ID/comments \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Amazing shot! 📸"}'

# Get post comments
curl -X GET http://localhost:5000/api/posts/POST_ID/comments
```

### Step 8: Social Features
```bash
# Search for users
curl -X GET "http://localhost:5000/api/users/search?q=john"

# Follow another user
curl -X POST http://localhost:5000/api/users/OTHER_USER_ID/follow \
  -H "Authorization: Bearer USER_TOKEN"

# Get user's followers
curl -X GET http://localhost:5000/api/users/USER_ID/followers

# Get user's following
curl -X GET http://localhost:5000/api/users/USER_ID/following
```

### Step 9: View Feeds
```bash
# Get home feed (posts from followed users)
curl -X GET http://localhost:5000/api/feed/home \
  -H "Authorization: Bearer USER_TOKEN"

# Get explore feed (trending posts)
curl -X GET http://localhost:5000/api/feed/explore
```

### Step 10: Account Management
```bash
# Change password
curl -X POST http://localhost:5000/api/account/change-password \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "StrongPass123!",
    "newPassword": "EvenStronger456!"
  }'
```

## 🌐 **Interactive API Testing**

For easier testing, open the Swagger documentation:
- http://localhost:5000/api-docs
- Click "Authorize" button
- Enter: `Bearer YOUR_TOKEN`
- Test all endpoints interactively!

## 📊 **Verification Checklist**

- [ ] ✅ User registration works (with invite code)
- [ ] ✅ User login returns JWT token
- [ ] ✅ Profile updates work
- [ ] ✅ Posts can be created, edited, deleted
- [ ] ✅ Likes and comments work
- [ ] ✅ Follow/unfollow functionality works
- [ ] ✅ Feeds return relevant posts
- [ ] ✅ Search finds users
- [ ] ✅ Account management works
- [ ] ✅ Authentication middleware protects routes
- [ ] ✅ Error handling works properly

## 🎉 **Success!**

If all these steps work, your Instagram-like app backend is fully functional and ready for production use!

**Next**: Build your React/React Native frontend and integrate with these APIs.
