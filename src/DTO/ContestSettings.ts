export class ContestSettings {
    public readonly contestStartsAt: number;
    public readonly contestEndsAt: number;
    public readonly votingStartsAt: number;

    constructor(contestStartsAt: number, contestEndsAt: number, votingStartsAt: number) {
        this.contestStartsAt = contestStartsAt;
        this.contestEndsAt = contestEndsAt;
        this.votingStartsAt = votingStartsAt;

        let error = this.validate();
        if (error != null) {
            throw error;
        }
    }

    private validate(): string {
        if (this.contestStartsAt > this.contestEndsAt) {
            return "Contest start time cannot be greater than contest end time";
        }

        if (this.votingStartsAt > this.contestEndsAt) {
            return "Voting start time cannot be greater than contest end time";
        }

        return null;
    }
}