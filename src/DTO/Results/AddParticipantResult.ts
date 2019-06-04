export class AddParticipantResult {
    public messageResponse: string;
    public isSuccess: boolean;

    constructor(isSuccess: boolean, messageResponse?: string) {
        this.isSuccess = isSuccess;
        this.messageResponse = messageResponse;
    }
}