import {DiscordAttachment} from "./DiscordAttachment";

export class DiscordMessage {
    public readonly authorId: string;
    public readonly authorCreatedAt: string;
    public readonly serverId: string;
    public readonly channelId: string;
    public readonly authorName: string;
    public readonly message: string;
    public readonly attachedImages: DiscordAttachment[];

    constructor(authorId: string, authorCreatedAt: string, authorName: string, serverId: string, channelId: string, message: string, attachedImages: DiscordAttachment[]) {
        this.authorId = authorId;
        this.authorCreatedAt = authorCreatedAt;
        this.authorName = authorName;
        this.serverId = serverId;
        this.channelId = channelId;
        this.message = message;
        this.attachedImages = attachedImages;
    }
}