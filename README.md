# 🌟 VibeTribe — A Social Media Platform

## 📝 Project Description

VibeTribe is a social media platform designed to offer a refreshing alternative to today’s negativity-driven online spaces. Our goal is to create an emotionally safe, humorous, and uplifting environment where creators can express themselves authentically and build meaningful connections. The app will focus on witty content, positive interactions, and mental well-being

## 👥 Team Members

- [Harsh Pilankar](https://github.com/harshpilankar)
- [Rudresh Arabekar](https://github.com/rudevhub)
- [Krupal Maulangker](https://github.com/krupal46)
- [Atharv Pednekar](https://github.com/atharv446546454)
- [Subodh Ambekar](https://github.com/subodh0504)

## 🛠 Tech Stack

Frontend:
- Web: **Next.js** (React)
- Mobile: **React Native + Expo**

Backend:
- **Node.js** + **Express**

Database:
- **PostgreSQL**
- **MongoDB**

APIs:
- **REST** / **GraphQL** (TBD)

Deployment:
- Web: **Vercel**
- Backend: **Railway**
- Mobile: **Expo EAS**

> _Some tools may be finalized during development._

---

## 🚀 Getting Started (Clone & Run)

### Prerequisites
- Node.js 18+ (tested with Node 22)
- MongoDB (local or Atlas)

### 1) Clone the repo
```bash
git clone https://github.com/<your-org-or-user>/<your-repo>.git
cd <your-repo>
```

### 2) Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend`:
```env
PORT=5000
MONGO_URI=UR Mongodb URI
JWT_SECRET=change-me-to-a-strong-secret
```

Start the server:
```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected Successfully
```

### 3) API Docs (Swagger)
Open your browser at:
- http://localhost:5000/api-docs

## 📚 API Usage Walkthrough (Step-by-step)
### 0) Generate an invite code
Invite-only registration requires a code. In development you can create one via the API.

```bash
curl -X POST http://localhost:5000/api/auth/invite-codes \

'{ "intended_for": "someone@example.com" }'
# => { "code": "ABC123", ... }
```

Copy the `code` from the response.

### 1) Register using the invite code
```bash
curl -X POST http://localhost:5000/api/auth/register \
 '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "StrongPassw0rd!",
    "invite_code": "ABC123"
  }'
# => { "token": "<JWT>" }
```

### 2) Log in (get a token)
```bash
curl -X POST http://localhost:5000/api/auth/login 
    '{ 
        "identifier": "johndoe", 
        "password": "StrongPassw0rd!" 
    }'
# => { "token": "<JWT>" }
```

Save the token for subsequent requests:
### 3) Past the token in authorize

Use it as: `"Authorization:TOKEN"`.

### 5) Create a post
```bash
curl -X POST http://localhost:5000/api/posts \
  '{
    "caption": "Hello VibeTribe!",
    "media_urls": []
  }'
# => { "id": "<postId>", ... }
```

### 6) Explore feeds
```bash
# Explore (public)
curl http://localhost:5000/api/feed/explore

# Home feed (requires auth)
http://localhost:5000/api/feed/home
```

### 7) Like and comment on a post
```bash
POST_ID="<postId>"

curl -X POST http://localhost:5000/api/posts/$POST_ID/like \

curl -X POST http://localhost:5000/api/posts/$POST_ID/comments \
  '{ "content": "Nice post!" }'
```

### 8) Find users and follow
```bash
# Search users
curl "http://localhost:5000/api/users/search?q=john"
# => pick a userId from results

curl -X POST http://localhost:5000/api/users/$USER_ID/follow \
```

### 9) Account actions
```bash
# Change password
curl -X POST http://localhost:5000/api/account/change-password \
  -d '{ "old_password": "StrongPassw0rd!", "new_password": "EvenStronger1!" }'

# Logout
curl -X POST http://localhost:5000/api/auth/logout \
```

