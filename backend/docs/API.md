# Solo Sparks API Documentation

## Authentication

### Register
**POST** `/api/auth/register`  
Register a new user.

**Body:**  
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "mood": "string", // optional
  "personality": { "loveType": "string", "openness": 0.5, "extraversion": 0.5 }, // optional
  "emotionalNeeds": ["string"] // optional
}
```
**Response:**  
```json
{ "token": "JWT_TOKEN" }
```

---

### Login
**POST** `/api/auth/login`  
Login an existing user.

**Body:**  
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**  
```json
{ "token": "JWT_TOKEN" }
```

---

### Get Current User
**GET** `/api/auth/me`  
Get the logged-in user's profile.

**Headers:**  
`Authorization: Bearer <token>`

**Response:**  
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "mood": "string",
  "personality": { ... },
  "emotionalNeeds": ["string"],
  "rewards": ["string"],
  "analytics": { "completions": 0, "growth": 0 },
  "avatar": "string"
}
```

---

### Update Profile (with Avatar)
**PUT** `/api/auth/me`  
Update profile info and/or upload avatar.

**Headers:**  
`Authorization: Bearer <token>`

**Body:**  
- `name` (string)
- `mood` (string)
- `emotionalNeeds` (comma-separated string)
- `reflectionPhoto` (file, optional)

**Response:**  
Updated user object.

---

## Quests

### Get All Quests
**GET** `/api/quests`  
Get all quests for the logged-in user.

**Headers:**  
`Authorization: Bearer <token>`

**Response:**  
Array of quest objects.

---

### Create Quest
**POST** `/api/quests`  
Create a new quest.

**Headers:**  
`Authorization: Bearer <token>`

**Body:**  
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "difficulty": "easy|medium|hard",
  "points": 10
}
```
**Response:**  
Created quest object.

---

### Update Quest
**PUT** `/api/quests/:id`  
Update a quest (e.g., mark as completed).

**Headers:**  
`Authorization: Bearer <token>`

**Body:**  
```json
{
  "status": "pending|completed",
  "userResponse": "string"
}
```
**Response:**  
Updated quest object.

---

## Rewards Store

### Get All Rewards
**GET** `/api/rewardstore`  
Get all available rewards.

**Response:**  
Array of reward objects.

---

### Redeem Reward
**POST** `/api/rewards/redeem/:id`  
Redeem a reward by ID.

**Headers:**  
`Authorization: Bearer <token>`

**Response:**  
Updated user object.

---

## Analytics / Trends

### Trending Quests
**GET** `/api/analytics/trending-quests`  
Get most completed quests.

**Response:**  
```json
[
  { "_id": "Quest Title", "count": 5 }
]
```

---

### Trending Rewards
**GET** `/api/analytics/trending-rewards`  
Get most redeemed rewards.

**Response:**  
```json
[
  { "_id": "Reward Name", "count": 3 }
]
```

---

## Bonus: Social Sharing

**Frontend only:**  
Add a "Share" button on completed quests using the [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) or copy a shareable link.

---

## Error Responses

- `400 Bad Request` – Missing or invalid data
- `401 Unauthorized` – Missing or invalid token
- `404 Not Found` – Resource not found
- `500 Internal Server Error` – Server error

---

## Authentication

All protected endpoints require the header:  
`Authorization: Bearer <token>`
