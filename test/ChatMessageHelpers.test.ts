import {expect} from "chai";
import {normalizeRealmName} from "../src/Helpers/ChatMessageHelpers";

describe('Tests ChatMessageHelpers', () => {
    it('should bring realm name to lower case', () => {
        expect(normalizeRealmName('Азурегос')).to.equal('азурегос');
    });

    it('should cut whitespaces from realm name', () => {
        expect(normalizeRealmName('Пиратская Бухта')).to.equal('пиратскаябухта');
    });

    it('should remove special chars from realm name', () => {
        expect(normalizeRealmName("Azhol'nerub")).to.equal('azholnerub');
    });
});