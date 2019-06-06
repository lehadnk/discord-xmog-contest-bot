import {DbAdapter} from "../DbAdapter";
import {IVoteRepository} from "./IVoteRepository";
import {Vote} from "../Models/Vote";
import {DatabaseError, DatabaseErrorCode} from "../Exceptions/DatabaseError";

export class VoteRepository implements IVoteRepository {
    private db: DbAdapter;

    constructor(db: DbAdapter) {
        this.db = db;
    }

    addVote(vote: Vote): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db.run(
                "INSERT INTO votes(participant_id, voter_discord_id) VALUES (?1, ?2);",
                {
                    1: vote.participantId,
                    2: vote.voterDiscordId,
                }
            ).then(result => {
                resolve();
            }).catch(reason => {
                if (reason.toString().substr(0, 17) == 'SQLITE_CONSTRAINT') {
                    reject(new DatabaseError(DatabaseErrorCode.ContraintViolation, 'This participant is already existing'));
                    return;
                }
                reject(new DatabaseError(DatabaseErrorCode.Other, reason.toString()));
            });
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