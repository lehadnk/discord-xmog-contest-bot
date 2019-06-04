import {DbAdapter} from "../DbAdapter";
import {Participant} from "../Models/Participant";
import {IParticipantRepository} from "./IParticipantRepository";
import {IVoteRepository} from "./IVoteRepository";
import {Vote} from "../Models/Vote";

export class VoteRepository implements IVoteRepository {
    private db: DbAdapter;

    constructor(db: DbAdapter) {
        this.db = db;
    }

    addVote(vote: Vote): Promise<void> {
        return new Promise<void>(resolve => {
            this.db.run(
                "INSERT INTO votes(participant_id, voter_discord_id) VALUES (?1, ?2);",
                {
                    1: vote.participantId,
                    2: vote.voterDiscordId,
                }
            ).then(result => {
                resolve();
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