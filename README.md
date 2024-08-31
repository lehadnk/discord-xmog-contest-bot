# Docker
Copy an empty DB:

`cp ./prod-db.dist.db3 ./db/prod-db.db3`

Run backend:

`docker-compose down && docker-compose up -d`

Manual DB updates are not synced to container until restart

# Installation (old)
```
node: 12.14.1
(npm: 6.13.4)

npm install
npm run compile
node build/run.js
node build/site.js
node build/console.js

.env.example => .env

SyncParticipantMessages: update year to current year
```

# Init SQL (sort of works)
executed in node build/site.js
```sql
CREATE TABLE participants
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR NOT NULL,
    realm VARCHAR NOT NULL,
    realmNormalized VARCHAR NOT NULL,
    imageUrl VARCHAR NOT NULL,
    discordUserId VARCHAR NOT NULL,
    CONSTRAINT uq_discordUSerId UNIQUE (discordUserId)
);

CREATE TABLE votes
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participant_id INTEGER REFERENCES participants(id) NOT NULL,
    voter_discord_id VARCHAR NOT NULL,
    voter_discord_name VARCHAR NOT NULL,
    CONSTRAINT uq_voter_participant UNIQUE (participant_id, voter_discord_id)
);

```

# Urls
Participants API endpoint: http://localhost:9000/participants
(there are few more)
