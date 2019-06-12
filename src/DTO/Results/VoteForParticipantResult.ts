export class VoteForParticipantResult {
    public readonly messageResponse: string;
    public readonly isSuccess: boolean;

    constructor(isSuccess: boolean, messageResponse?: string) {
        this.isSuccess = isSuccess;
        this.messageResponse = messageResponse;
    }
}