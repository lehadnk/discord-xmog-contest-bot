export class Vote {
    public id: number;
    public voterDiscordId: string;
    public voterDiscordName: string;
    public participantId: number;

    constructor(id: number, voterDiscordId: string, participantId: number, voterDiscordName: string) {
        this.voterDiscordName = voterDiscordName;
        this.id = id;
        this.voterDiscordId = voterDiscordId;
        this.participantId = participantId;
    }
}