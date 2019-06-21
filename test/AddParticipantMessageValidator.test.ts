import {expect} from "chai";
import {DiscordMessage} from "../src/DTO/DiscordMessage";
import {AddParticipantMessageValidator} from "../src/Validators/AddParticipantMessageValidator";

describe('Tests VoteForParticipantMessageValidator', () => {
    it('should validate correct message', () => {
        let msg = new DiscordMessage(
            '208939653426839552',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            'Энмеркар - Азурегос',
            ['http://google.com/123.jpg']
        );
        let result = AddParticipantMessageValidator.validate(msg);
        expect(result.isValid).to.be.true;
    });

    it('should invalidate empty message', () => {
        let msg = new DiscordMessage(
            '208939653426839552',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            '',
            ['http://google.com/123.jpg']
        );
        let result = AddParticipantMessageValidator.validate(msg);
        expect(result.isValid).to.be.false;
    });

    it('should invalidate message with no image', () => {
        let msg = new DiscordMessage(
            '208939653426839552',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            'Энмеркар - Азурегос',
            []
        );
        let result = AddParticipantMessageValidator.validate(msg);
        expect(result.isValid).to.be.false;
    });

    it('should invalidate message with no character name', () => {
        let msg = new DiscordMessage(
            '208939653426839552',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            ' - Азурегос',
            ['http://google.com/123.jpg']
        );
        let result = AddParticipantMessageValidator.validate(msg);
        expect(result.isValid).to.be.false;
    });

    it('should invalidate message with no realm mane', () => {
        let msg = new DiscordMessage(
            '208939653426839552',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            'Энмеркар - ',
            ['http://google.com/123.jpg']
        );
        let result = AddParticipantMessageValidator.validate(msg);
        expect(result.isValid).to.be.false;
    });

    it('should invalidate malformed message', () => {
        let msg = new DiscordMessage(
            '208939653426839552',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            'Энмеркар азурегосч',
            ['http://google.com/123.jpg']
        );
        let result = AddParticipantMessageValidator.validate(msg);
        expect(result.isValid).to.be.false;
    });

    it('should validate message with pass description', () => {
        let msg = new DiscordMessage(
            '208939653426839552',
            'lehadnk',
            '512034124935426920',
            '120359014053436256',
            'Энмеркар - Азурегос/nMy description',
            ['http://google.com/123.jpg']
        );
        let result = AddParticipantMessageValidator.validate(msg);
        expect(result.isValid).to.be.true;
    });
});