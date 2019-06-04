export class VoteForParticipantRequest {
    public voterDiscordId: string;
    public characterName: string;
    public characterRealm: string;

    constructor(voterDiscordId: string, characterName: string, characterRealm: string) {
        this.voterDiscordId = voterDiscordId;
        this.characterName = characterName;
        this.characterRealm = characterRealm;
    }
}