export class AddParticipantRequest {
    public readonly participantImageUrl: string;
    public readonly participantName: string;
    public readonly participantDiscordUserId: string;
    public readonly participantRealm: string;

    constructor(participantName: string, participantRealm: string, participantImageUrl: string, participantDiscordUserId: string) {
        this.participantName = participantName;
        this.participantRealm = participantRealm;
        this.participantImageUrl = participantImageUrl;
        this.participantDiscordUserId = participantDiscordUserId;
    }
}