import {expect} from "chai";
import {Database} from "sqlite3";
import {SqliteDbAdapter} from "../src/SqliteDbAdapter";
import {ParticipantRepository} from "../src/Repositories/ParticipantRepository";
import {VoteRepository} from "../src/Repositories/VoteRepository";
import {ContestService} from "../src/ContestService";
import {AddParticipantRequest} from "../src/DTO/Requests/AddParticipantRequest";
import {VoteForParticipantRequest} from "../src/DTO/Requests/VoteForParticipantRequest";
import {ContestSettings} from "../src/DTO/ContestSettings";

let db = new Database('./db/test-db.db3');
let adapter = new SqliteDbAdapter(db);
let participantRepository = new ParticipantRepository(adapter);
let votesRepository = new VoteRepository(adapter);
let time = Date.now();
let contestSettings = new ContestSettings(time - 1000, time + 2000, time - 500);
let contestService = new ContestService(participantRepository, votesRepository, contestSettings);

describe('Test Participant Repository', () => {
    it('attempts to add new participant', async () => {
        let result = await contestService.handleAddParticipantRequest(
            new AddParticipantRequest(
                'Нейшира',
                'Азурегос',
                'http://google.com/123.jpg',
                '203465345326192353',
                Date.parse("2024-09-01").valueOf().toString()
            )
        );

        expect(result.isSuccess).to.be.true;
    });

    it('attempts to add the same participant again from another discord account', async () => {
        let result = await contestService.handleAddParticipantRequest(
            new AddParticipantRequest(
                'Нейшира',
                'Азурегос',
                'http://google.com/123.jpg',
                '138623940202949514',
                Date.parse("2024-09-01").valueOf().toString()
            )
        );

        expect(result.isSuccess).to.be.false;
    });

    it('attempts to add the another character from same discord account', async () => {
        let result = await contestService.handleAddParticipantRequest(
            new AddParticipantRequest(
                'Нейшира',
                'Азурегос',
                'http://google.com/123.jpg',
                '203465345326192353',
                Date.parse("2024-09-01").valueOf().toString()
            )
        );

        expect(result.isSuccess).to.be.false;
    });

    it('attempts to vote for existing participant', async() => {
        let result = await contestService.handleVoteForParticipantRequest(
            new VoteForParticipantRequest(
                '208939653426839552',
                'Нейшира',
                'Азурегос',
                'lehadnk',
                '',
            )
        );

        expect(result.isSuccess).to.be.true;
    });

    it('attempts to vote for existing participant twice', async() => {
        let result = await contestService.handleVoteForParticipantRequest(
            new VoteForParticipantRequest(
                '208939653426839552',
                'Нейшира',
                'Азурегос',
                'lehadnk',
                '',
            )
        );

        expect(result.isSuccess).to.be.false;
    });

    it('attempts person to vote himself', async() => {
        let result = await contestService.handleVoteForParticipantRequest(
            new VoteForParticipantRequest(
                '203465345326192353',
                'Нейшира',
                'Азурегос',
                'lehadnk',
                '',
            )
        );

        expect(result.isSuccess).to.be.false;
    });

    it('attempts to race condition attack registration', async() => {
        let addParticipantResult1 = contestService.handleAddParticipantRequest(
            new AddParticipantRequest(
                'Таллиссия',
                'Азурегос',
                'http://google.com/123.jpg',
                '320553294329843929',
                Date.parse("2024-09-01").valueOf().toString(),
            )
        );

        let addParticipantResult2 = contestService.handleAddParticipantRequest(
            new AddParticipantRequest(
                'Таллиссия',
                'Азурегос',
                'http://google.com/123.jpg',
                '320553294329843929',
                Date.parse("2024-09-01").valueOf().toString(),
            )
        );

        expect(
            (await addParticipantResult1).isSuccess !== (await addParticipantResult2).isSuccess
        ).to.be.true;
    });

    it('attempts to race condition attack voting for existing participant', async() => {
        await contestService.handleAddParticipantRequest(
            new AddParticipantRequest(
                'Нейши',
                'Азурегос',
                'http://google.com/123.jpg',
                '950191302893824532',
                Date.parse("2024-09-01").valueOf().toString(),
            )
        );

        let voteResult1 = contestService.handleVoteForParticipantRequest(
            new VoteForParticipantRequest(
                '208939653426839552',
                'Нейши',
                'Азурегос',
                'lehadnk',
                '',
            )
        );
        let voteResult2 = contestService.handleVoteForParticipantRequest(
            new VoteForParticipantRequest(
                '208939653426839552',
                'Нейши',
                'Азурегос',
                'lehadnk',
                '',
            )
        );

        expect(
            (await voteResult1).isSuccess !== (await voteResult2).isSuccess
        ).to.be.true;
    });

    it('attempts to vote for non-existing participant', async() => {
        let result = await contestService.handleVoteForParticipantRequest(
            new VoteForParticipantRequest(
                '208939653426839552',
                'Энмеркар',
                'Азурегос',
                'lehadnk',
                '',
            )
        );

        expect(result.isSuccess).to.be.false;
    });

    it('attempts to add participant before contest started', async () => {
        let notStartedContestSettings = new ContestSettings(time + 20000, time + 30000, time + 25000);
        let notStartedContestService = new ContestService(participantRepository, votesRepository, notStartedContestSettings);

        let result = await notStartedContestService.handleAddParticipantRequest(
            new AddParticipantRequest(
                'Вульфер',
                'Азурегос',
                'http://google.com/123.jpg',
                '943428493289250329',
                Date.parse("2024-09-01").valueOf().toString(),
            )
        );

        expect(result.isSuccess).to.be.false;
    });

    it('attempts to vote for participant before voting starts', async () => {
        let votingNotStartedContestSettings = new ContestSettings(time - 20000, time + 30000, time + 25000);
        let votingNotStartedContestService = new ContestService(participantRepository, votesRepository, votingNotStartedContestSettings);

        let result = await votingNotStartedContestService.handleVoteForParticipantRequest(
            new VoteForParticipantRequest(
                '326323265432253234',
                'Нейшира',
                'Азурегос',
                'lehadnk',
                '',
            )
        );

        expect(result.isSuccess).to.be.false;
    });
});