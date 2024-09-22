export class AddParticipantResult {
    public readonly messageResponse: string;
    public readonly isSuccess: boolean;
    public newParticipantCharacterName: string;
    public newParticipantRealm: string;

    constructor(isSuccess: boolean, messageResponse?: string) {
        this.isSuccess = isSuccess;
        this.messageResponse = messageResponse;
    }
}