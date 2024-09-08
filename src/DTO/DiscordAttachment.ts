export class DiscordAttachment {
    public readonly imageUrl: string;
    public readonly filesizeBytes: number;

    constructor(imageUrl: string, filesizeBytes: number) {
        this.imageUrl = imageUrl;
        this.filesizeBytes = filesizeBytes;
    }
}