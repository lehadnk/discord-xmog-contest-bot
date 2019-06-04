export class AddParticipantRequest {
    public participantImageUrl: string;
    public participantName: string;
    public participantRealm: string;

    constructor(participantName: string, participantRealm: string, participantImageUrl: string) {
        this.participantName = participantName;
        this.participantRealm = participantRealm;
        this.participantImageUrl = participantImageUrl;
    }
}