# API Samples

## Health
GET /health

## Safety Badges
GET /safety/badges/1

## AI
POST /ai/profile-prompts
{"seed":"street food, indie films"}

## Matches
POST /matches/like
{"actor_id":1,"target_id":2}

## Chat (REST)
POST /chat/messages
{"conversation_id":1,"sender_id":1,"text":"Hi!"}

## Guardian
POST /guardian/check
{"text":"send money please","tone":"witty"}

## Events
GET /events
