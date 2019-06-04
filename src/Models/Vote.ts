export class Vote {
    public id: number;
    public voterDiscordId: string;
    public participantId: number;

    constructor(id: number, voterDiscordId: string, participantId: number) {
        this.id = id;
        this.voterDiscordId = voterDiscordId;
        this.participantId = participantId;
    }
}