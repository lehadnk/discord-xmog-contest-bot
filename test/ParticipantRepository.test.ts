import {expect} from "chai";
import {Database} from "sqlite3";
import {SqliteDbAdapter} from "../src/SqliteDbAdapter";
import {Participant} from "../src/Models/Participant";
import {ParticipantRepository} from "../src/Repositories/ParticipantRepository";

let db = new Database('./test-db.db3');
let adapter = new SqliteDbAdapter(db);
let repository = new ParticipantRepository(adapter);

describe('Test Participant Repository', () => {
    it('inserts participant to db', async () => {
        let result = await repository.addParticipant(new Participant(null, 'Name', 'Realm'));
        expect(result).to.be.undefined;
    });

    it('gets existing participant from db', async () => {
        let result = await repository.getParticipant('Name', 'Realm');
        expect(result).to.be.deep.include({
            name: 'Name',
            realm: 'Realm'
        });
    });

    it('attempts to get non-existing participant from db', async () => {
        let result = await repository.getParticipant('AnotherName', 'Realm');
        expect(result).to.be.equal(null);
    });
});