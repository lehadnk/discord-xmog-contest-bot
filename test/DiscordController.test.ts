import {DiscordController} from "../src/Controllers/DiscordController";
import {ContestService} from "../src/ContestService";
import {Database} from "sqlite3";
import {SqliteDbAdapter} from "../src/SqliteDbAdapter";
import {ParticipantRepository} from "../src/Repositories/ParticipantRepository";
import {VoteRepository} from "../src/Repositories/VoteRepository";
import {DiscordMessage} from "../src/DTO/DiscordMessage";
import {expect} from "chai";
import {ContestSettings} from "../src/DTO/ContestSettings";
import {DiscordAttachment} from "../src/DTO/DiscordAttachment";
import {ImgurService} from "../src/Imgur/ImgurService";

let db = new Database('./db/test-db.db3');
let adapter = new SqliteDbAdapter(db);
let participantRepository = new ParticipantRepository(adapter);
let votesRepository = new VoteRepository(adapter);
let time = Date.now();
let contestSettings = new ContestSettings(time - 1000, time + 2000, time - 500);
let contestService = new ContestService(participantRepository, votesRepository, contestSettings);
let controller = new DiscordController(contestService, ['111111111111111111'], new ImgurService());

describe('Test DiscordController:', () => {
    it('dispatches a valid add character message to controller', async () => {
        let msg = new DiscordMessage(
            '208939653426839552',
            '',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            'Селанаар - Азурегос',
            [new DiscordAttachment('http://google.com/123.jpg', 123)]
        );
        const result = await controller.dispatch(msg);

        expect(result.removeOriginalMessage).to.be.false;
        expect(result.responseMessage).to.be.null;
        expect(result.syncMessageData).to.contains({
            authorId: '208939653426839552',
            serverId: '512034124935426920',
            channelId: '120359014053436256',
            message: 'Селанаар - Азурегос',
        });
        expect(result.syncMessageData.attachedImages[0]).to.be.equal('http://google.com/123.png');
    });

    it('dispatches a malformed add character message to controller', async () => {
        let msg = new DiscordMessage(
            '208939653426839552',
            '',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            'Нейшира',
            [new DiscordAttachment('http://google.com/123.jpg', 123)]
        );
        const result = await controller.dispatch(msg);

        expect(result.removeOriginalMessage).to.be.true;
        expect(result.responseMessage).to.be.string;
        expect(result.syncMessageData).to.be.null;
    });

    it('dispatches a valid vote for character message to controller', async () => {
        let msg = new DiscordMessage(
            '943949230493204932',
            '',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            '/vote Селанаар - Азурегос',
            []
        );
        const result = await controller.dispatch(msg);

        expect(result.removeOriginalMessage).to.be.true;
        expect(result.responseMessage).to.be.equal("Ваш голос учтен!");
        expect(result.syncMessageData).to.be.null;
    });

    it('dispatches an invalid vote for character message to controller', async () => {
        let msg = new DiscordMessage(
            '208939653426839552',
            '',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            '/vote Селанаар',
            []
        );
        const result = await controller.dispatch(msg);

        expect(result.removeOriginalMessage).to.be.true;
        expect(result.responseMessage).to.be.equal("Пожалуйста, укажите имя и сервер персонажа через дефис");
        expect(result.syncMessageData).to.be.null;
    });

    it('tests announcer feature', async () => {
        let msg = new DiscordMessage(
            '111111111111111111',
            '',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            'Announce test',
            [new DiscordAttachment('http://google.com/123.jpg', 123)]
        );
        const result = await controller.dispatch(msg);

        expect(result.removeOriginalMessage).to.be.false;
        expect(result.responseMessage).to.be.null;
        expect(result.syncMessageData).to.contains({
            authorId: '111111111111111111',
            serverId: '512034124935426920',
            channelId: '120359014053436256',
            message: 'Announce test',
        });
        expect(result.syncMessageData.attachedImages[0]).to.be.equal('http://google.com/123.png');
    });
});