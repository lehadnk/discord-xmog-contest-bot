export class AddParticipantRequest {
    public readonly participantImageUrl: string;
    public readonly participantName: string;
    public readonly participantRealm: string;

    constructor(participantName: string, participantRealm: string, participantImageUrl: string) {
        this.participantName = participantName;
        this.participantRealm = participantRealm;
        this.participantImageUrl = participantImageUrl;
    }
}