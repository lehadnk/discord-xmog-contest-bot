export class DiscordMessage {
    public readonly authorId: string;
    public readonly serverId: string;
    public readonly channelId: string;
    public readonly message: string;
    public readonly embedImageUrl: string[];

    constructor(authorId: string, serverId: string, channelId: string, message: string, embedImageUrl: string[]) {
        this.authorId = authorId;
        this.serverId = serverId;
        this.channelId = channelId;
        this.message = message;
        this.embedImageUrl = embedImageUrl;
    }
}