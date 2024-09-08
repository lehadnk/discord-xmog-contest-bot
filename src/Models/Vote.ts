export class Vote {
    public id: number;
    public voterDiscordId: string;
    public voterDiscordName: string;
    public participantId: number;
    public voterCreatedAt: string;

    constructor(id: number, voterDiscordId: string, participantId: number, voterDiscordName: string, voterCreatedAt: string) {
        this.voterDiscordName = voterDiscordName;
        this.id = id;
        this.voterDiscordId = voterDiscordId;
        this.participantId = participantId;
        this.voterCreatedAt = voterCreatedAt;
    }
}