# Docker
.env.example => .env

Run backend:

`docker-compose down && docker-compose up -d`

Database will be automatically created on startup as /db/prod-db.db3

Manual DB updates are not synced to container until restart

voter_created_at field is needed to track voter user creation date.
observable by smth like this: 
```
SELECT *, DATETIME(ROUND(voter_created_at / 1000), 'unixepoch') AS voter_created FROM votes
```

# Debug
modify DB path `./db/prod-db.db3` to `../db/prod-db.db3` in run.ts or site.ts

`npm run compile`

then run with debug build/run.js or build/site.js


# Installation (old)
```
node: 12.14.1
(npm: 6.13.4)
(upd - had issues with this version, node 21.7.1 worked fine)

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

# Tests
`npm run test`
DB-related tests are failing, not sure how to fix. Migrations do not work and prod db is initialized directly from the code.