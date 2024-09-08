import {IVoteRepository} from "./IVoteRepository";
import {Vote} from "../Models/Vote";
import {DatabaseError, DatabaseErrorCode} from "../Exceptions/DatabaseError";
import {IDbAdapter} from "../IDbAdapter";

export class VoteRepository implements IVoteRepository {
    private db: IDbAdapter;

    constructor(db: IDbAdapter) {
        this.db = db;
    }

    addVote(vote: Vote): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db.run(
                "INSERT INTO votes(participant_id, voter_discord_id, voter_discord_name, voter_created_at) VALUES (?1, ?2, ?3, ?4);",
                {
                    1: vote.participantId,
                    2: vote.voterDiscordId,
                    3: vote.voterDiscordName,
                    4: vote.voterCreatedAt
                }
            ).then(result => {
                resolve();
            }).catch(reason => reject(reason));
        });
    }

    isVoteExists(vote: Vote): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this.db.value(
                "SELECT count(id) FROM votes WHERE participant_id = ?1 AND voter_discord_id = ?2",
                {
                    1: vote.participantId,
                    2: vote.voterDiscordId,
                }
            ).then(result => {
                resolve(parseInt(result) > 0);
            })
        });
    }
}