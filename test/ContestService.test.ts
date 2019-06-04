import {expect} from "chai";
import {Database} from "sqlite3";
import {DbAdapter} from "../src/DbAdapter";
import {Participant} from "../src/Models/Participant";
import {ParticipantRepository} from "../src/Repositories/ParticipantRepository";
import {VoteRepository} from "../src/Repositories/VoteRepository";
import {ContestService} from "../src/ContestService";
import {AddParticipantRequest} from "../src/DTO/Requests/AddParticipantRequest";
import {VoteForParticipantRequest} from "../src/DTO/Requests/VoteForParticipantRequest";

let db = new Database('./test-db.db3');
let adapter = new DbAdapter(db);
let participantRepository = new ParticipantRepository(adapter);
let votesRepository = new VoteRepository(adapter);
let contestService = new ContestService(participantRepository, votesRepository);



describe('Test Participant Repository', () => {
    it('attempts to add new participant', async () => {
        let result = await contestService.handleAddParticipantRequest(
            new AddParticipantRequest(
                'Нейшира',
                'Азурегос',
                'http://google.com/123.jpg'
            )
        );

        expect(result.isSuccess).to.be.true;
    });

    it('attempts to add the same participant again', async () => {
        let result = await contestService.handleAddParticipantRequest(
            new AddParticipantRequest(
                'Нейшира',
                'Азурегос',
                'http://google.com/123.jpg'
            )
        );

        expect(result.isSuccess).to.be.false;
    });

    it('attempts to vote for existing participant', async() => {
        let result = await contestService.handleVoteForParticipantRequest(
            new VoteForParticipantRequest(
                '208939653426839552',
                'Нейшира',
                'Азурегос'
            )
        );

        expect(result.isSuccess).to.be.true;
    });

    it('attempts to vote for existing participant twice', async() => {
        let result = await contestService.handleVoteForParticipantRequest(
            new VoteForParticipantRequest(
                '208939653426839552',
                'Нейшира',
                'Азурегос'
            )
        );

        expect(result.isSuccess).to.be.false;
    });

    it('attempts to time attack voting for existing participant', async() => {
        await contestService.handleAddParticipantRequest(
            new AddParticipantRequest(
                'Нейши',
                'Азурегос',
                'http://google.com/123.jpg'
            )
        );

        let voteResult1 = contestService.handleVoteForParticipantRequest(
            new VoteForParticipantRequest(
                '208939653426839552',
                'Нейши',
                'Азурегос'
            )
        );
        let voteResult2 = contestService.handleVoteForParticipantRequest(
            new VoteForParticipantRequest(
                '208939653426839552',
                'Нейши',
                'Азурегос'
            )
        );

        let result1 = await voteResult1;
        let result2 = await voteResult2;
        expect(result1.isSuccess).to.be.true;
        expect(result2.isSuccess).to.be.false;
    });

    it('attempts to vote for non-existing participant', async() => {
        let result = await contestService.handleVoteForParticipantRequest(
            new VoteForParticipantRequest(
                '208939653426839552',
                'Энмеркар',
                'Азурегос'
            )
        );

        expect(result.isSuccess).to.be.false;
    });
});