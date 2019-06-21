export class VoteForParticipantRequest {
    public readonly voterDiscordId: string;
    public readonly voterDiscordName: string;
    public readonly characterName: string;
    public readonly characterRealm: string;

    constructor(voterDiscordId: string, characterName: string, characterRealm: string, voterDiscordName: string) {
        this.voterDiscordName = voterDiscordName;
        this.voterDiscordId = voterDiscordId;
        this.characterName = characterName;
        this.characterRealm = characterRealm;
    }
}