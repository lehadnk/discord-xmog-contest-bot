import {expect} from "chai";
import {VoteForParticipantMessageValidator} from "../src/Validators/VoteForParticipantMessageValidator";
import {DiscordMessage} from "../src/DTO/DiscordMessage";

describe('Tests VoteForParticipantMessageValidator', () => {
    it('should validate correct message', () => {
        let msg = new DiscordMessage(
            '208939653426839552',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            '/vote Селанаар - Азурегос',
            []
        );
        let result = VoteForParticipantMessageValidator.validate(msg);
        expect(result.isValid).to.be.true;
    });

    it('should invalidate message with no /vote tag', () => {
        let msg = new DiscordMessage(
            '208939653426839552',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            'Селанаар - Азурегос',
            []
        );
        let result = VoteForParticipantMessageValidator.validate(msg);
        expect(result.isValid).to.be.false;
    });

    it('should invalidate message with no name', () => {
        let msg = new DiscordMessage(
            '208939653426839552',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            '/vote - Азурегос',
            []
        );
        let result = VoteForParticipantMessageValidator.validate(msg);
        expect(result.isValid).to.be.false;
    });

    it('should invalidate message with no realm', () => {
        let msg = new DiscordMessage(
            '208939653426839552',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            '/vote Селанаар - ',
            []
        );
        let result = VoteForParticipantMessageValidator.validate(msg);
        expect(result.isValid).to.be.false;
    });

    it('should invalidate message with incorrect character name', () => {
        let msg = new DiscordMessage(
            '208939653426839552',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            '/vote Эн - Азурегос',
            []
        );
        let result = VoteForParticipantMessageValidator.validate(msg);
        expect(result.isValid).to.be.false;
    });

    it('should invalidate message with incorrect realm name', () => {
        let msg = new DiscordMessage(
            '208939653426839552',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            '/vote Энмеркар - Азу',
            []
        );
        let result = VoteForParticipantMessageValidator.validate(msg);
        expect(result.isValid).to.be.false;
    });
});