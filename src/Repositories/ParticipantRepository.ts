import {DbAdapter} from "../DbAdapter";
import {Participant} from "../Models/Participant";
import {IParticipantRepository} from "./IParticipantRepository";

export class ParticipantRepository implements IParticipantRepository {
    private db: DbAdapter;

    constructor(db: DbAdapter) {
        this.db = db;
    }

    addParticipant(participant: Participant): Promise<void> {
        return this.db.run("INSERT INTO participants(name, realm) VALUES (?1, ?2);", {
            1: participant.name,
            2: participant.realm,
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