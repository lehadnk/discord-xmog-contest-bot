import {Participant} from "../Models/Participant";
import {IParticipantRepository} from "./IParticipantRepository";
import {DatabaseError, DatabaseErrorCode} from "../Exceptions/DatabaseError";
import {IDbAdapter} from "../IDbAdapter";

export class ParticipantRepository implements IParticipantRepository {
    private db: IDbAdapter;

    constructor(db: IDbAdapter) {
        this.db = db;
    }

    addParticipant(participant: Participant): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db.run("INSERT INTO participants(name, realm) VALUES (?1, ?2);", {
                1: participant.name,
                2: participant.realm,
            }).then(() => {
                resolve();
            }).catch(reason => reject(reason));
        });
    }

    getParticipant(characterName: string, realmName: string): Promise<Participant> {
        return new Promise<Participant>(resolve => {
            this.db.one("SELECT * FROM participants WHERE name = ?1 AND realm = ?2", {
                1: characterName,
                2: realmName
            }).then(row => {
                if (row === undefined) {
                    return resolve(null);
                }

                resolve(new Participant(row.id, row.name, row.realm));
            });
        });
    }
}