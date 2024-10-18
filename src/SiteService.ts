import {IDbAdapter} from "./IDbAdapter";
import {createServer} from 'http';

export default class SiteService {

    private db: IDbAdapter;

    constructor(db: IDbAdapter) {
        this.db = db;
    }

    notFoundError(res) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end();
    }

    badRequestError(res) {
        res.writeHead(400, {'Content-Type': 'text/html'});
        res.end();
    }

    jsonSuccessResponse(res, data) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.writeHead(200, {'Content-Type': 'application/json'});

        let responseData = {
            error: false,
            errorMessage: null,
            data: data
        };
        res.write(JSON.stringify(responseData));
        res.end();
    }

    jsonErrorResponse(res, code, error) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.writeHead(code, {'Content-Type': 'application/json'});

        let responseData = {
            error: true,
            errorMessage: error,
        };
        res.write(JSON.stringify(responseData));
        res.end();
    }

    async start() {
        await this.initDb();

        createServer(async (req, res) => {
            let urlChunks = req.url.split('/');
            if (urlChunks.length < 2) {
                return this.notFoundError(res);
            }

            let result: any;
            switch(urlChunks[1]) {
                case 'participants':
                    result = await this.db
                        .all("SELECT p.*, IFNULL(ps.score, 0) - IFNULL(wv.weird_votes, 0) as votes\n" +
                            "FROM participants p\n" +
                            "LEFT JOIN (\n" +
                            "  SELECT participant_id, count(id) as score\n" +
                            "  FROM votes\n" +
                            "  GROUP BY participant_id\n" +
                            ") ps ON p.id = ps.participant_id\n" +
                            "LEFT JOIN (\n" +
                            "    SELECT participant_id, count(id) as weird_votes\n" +
                            "    FROM votes WHERE voter_discord_id IN (\n" +
                            "       SELECT v.voter_discord_id\n" +
                            "        FROM votes v\n" +
                            "               JOIN participants p ON v.participant_id = p.id\n" +
                            "               JOIN (SELECT voter_discord_id, count(id) as votes_cnt\n" +
                            "                     FROM votes\n" +
                            "                     GROUP BY voter_discord_id) vc\n" +
                            "                 ON v.voter_discord_id = vc.voter_discord_id\n" +
                            "               JOIN (SELECT participant_id, count(id) as score\n" +
                            "                     FROM votes\n" +
                            "                     GROUP BY participant_id) ps ON ps.participant_id = v.participant_id\n" +
                            "        WHERE votes_cnt < 3\n" +
                            "        ORDER BY ps.score DESC\n" +
                            "    )\n" +
                            "    GROUP BY participant_id\n" +
                            ") as wv ON p.id = wv.participant_id\n" +
                            "WHERE p.isBanned = FALSE\n" +
                            "GROUP BY p.name, p.realm\n" +
                            "ORDER BY RANDOM() DESC");

                    if (process.env.IS_VOTES_PUBLIC !== 'true') {
                        result.forEach(resultItem => {
                            resultItem['votes'] = null;
                        })
                    }

                    return this.jsonSuccessResponse(res, result);
                case 'participant':
                    if (urlChunks.length < 3) {
                        return this.badRequestError(res);
                    }

                    if (process.env.IS_VOTES_PUBLIC !== 'true') {
                        return this.badRequestError(res);
                    }

                    let participantId = urlChunks[2];

                    result = await this.db
                        .all("SELECT v.voter_discord_name, CASE WHEN dqv.voter_discord_id IS NULL THEN 0 ELSE 1 END as disqualified\n" +
                            "FROM votes v\n" +
                            "LEFT JOIN (SELECT DISTINCT v.voter_discord_id\n" +
                            "        FROM votes v\n" +
                            "               JOIN participants p ON v.participant_id = p.id\n" +
                            "               JOIN (SELECT voter_discord_id, count(id) as votes_cnt\n" +
                            "                     FROM votes\n" +
                            "                     GROUP BY voter_discord_id) vc\n" +
                            "                 ON v.voter_discord_id = vc.voter_discord_id\n" +
                            "               JOIN (SELECT participant_id, count(id) as score\n" +
                            "                     FROM votes\n" +
                            "                     GROUP BY participant_id) ps ON ps.participant_id = v.participant_id\n" +
                            "        WHERE votes_cnt < 3\n" +
                            "        ORDER BY ps.score DESC) dqv ON dqv.voter_discord_id = v.voter_discord_id\n" +
                            "WHERE participant_id = ?1" +
                            "ORDER BY disqualified", {
                            1: participantId,
                        });

                    return this.jsonSuccessResponse(res, result);
                case 'voters':
                    return this.jsonSuccessResponse(res, {});
                case 'voter':

                    if (urlChunks.length < 3) {
                        return this.badRequestError(res);
                    }

                    let voterId = urlChunks[2];

                    return this.jsonSuccessResponse(res, {});
            }
        }).listen(process.env.API_PORT || 9000);

        console.log('Website API is up, listening...');
    }

    private async initDb() {
        try {
            await this.db.run("CREATE TABLE participants\n" +
                "(\n" +
                "    id INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
                "    name VARCHAR NOT NULL,\n" +
                "    realm VARCHAR NOT NULL,\n" +
                "    realmNormalized VARCHAR NOT NULL,\n" +
                "    imageUrl VARCHAR NOT NULL,\n" +
                "    discordUserId VARCHAR NOT NULL,\n" +
                "    isBanned BOOLEAN NOT NULL DEFAULT(0),\n" +
                "    CONSTRAINT uq_discordUSerId UNIQUE (discordUserId)\n" +
                ");");
        } catch (e) {} finally {}

        try {
            await this.db.run("CREATE TABLE votes\n" +
                "(\n" +
                "    id INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
                "    participant_id INTEGER REFERENCES participants(id) NOT NULL,\n" +
                "    voter_discord_id VARCHAR NOT NULL,\n" +
                "    voter_discord_name VARCHAR NOT NULL,\n" +
                "    voter_created_at VARCHAR NOT NULL,\n" +
                "    CONSTRAINT uq_voter_participant UNIQUE (participant_id, voter_discord_id)\n" +
                ");");
        } catch (e) {} finally {}
    }
}