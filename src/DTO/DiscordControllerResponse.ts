import {DiscordMessage} from "./DiscordMessage";
import {DiscordControllerResponseMetadata} from "./DiscordControllerResponseMetadata";

export class DiscordControllerResponse {
    public responseMessage: string;
    public syncMessageData: DiscordMessage;
    public removeOriginalMessage: boolean;
    public metadata: DiscordControllerResponseMetadata;

    constructor(responseMessage?: string, syncMessageData?: DiscordMessage, removeOriginalMessage: boolean = true) {
        this.responseMessage = responseMessage;
        this.syncMessageData = syncMessageData;
        this.removeOriginalMessage = removeOriginalMessage;
        this.metadata = new DiscordControllerResponseMetadata();
    }
}