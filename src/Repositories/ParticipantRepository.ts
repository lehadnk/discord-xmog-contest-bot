import {Participant} from "../Models/Participant";
import {IParticipantRepository} from "./IParticipantRepository";
import {DatabaseError, DatabaseErrorCode} from "../Exceptions/DatabaseError";
import {IDbAdapter} from "../IDbAdapter";
import {normalizeRealmName} from "../Helpers/ChatMessageHelpers";

export class ParticipantRepository implements IParticipantRepository {
    private db: IDbAdapter;

    constructor(db: IDbAdapter) {
        this.db = db;
    }

    addParticipant(participant: Participant): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db.run("INSERT INTO participants(name, realm, realmNormalized, imageUrl, discordUserId) VALUES (?1, ?2, ?3, ?4, ?5);", {
                1: participant.name,
                2: participant.realm,
                3: participant.realmNormalized,
                4: participant.imageUrl,
                5: participant.discordUserId,
            }).then(() => {
                resolve();
            }).catch(reason => reject(reason));
        });
    }

    getParticipant(characterName: string, realmName: string): Promise<Participant> {
        return new Promise<Participant>(resolve => {
            this.db.one("SELECT * FROM participants WHERE name = ?1 AND realmNormalized = ?2", {
                1: characterName,
                2: normalizeRealmName(realmName)
            }).then(row => {
                if (row === undefined) {
                    return resolve(null);
                }

                resolve(new Participant(row.id, row.name, row.realm, row.realmNormalized, row.discordUserId, row.imageUrl));
            });
        });
    }
}