import {Client} from 'discord.js';
import {DiscordMessage} from "./DTO/DiscordMessage";
import {DiscordController} from "./Controllers/DiscordController";
import {ContestService} from "./ContestService";

export class DiscordService {
    private readonly discordClient;
    private readonly token: string;
    private readonly controller: DiscordController;

    constructor(contestService: ContestService, discordClient: Client, token: string) {
        this.discordClient = discordClient;
        this.token = token;
        // It's not injectable, since DiscordService logic is highly couped with DiscordController
        this.controller = new DiscordController(contestService);
    }

    private setupHandlers() {
        this.discordClient.on("message", msg => {
            let parsedMessage = new DiscordMessage(msg.author.id, msg.guild.id, msg.channel.id, msg.content, msg.attachments.first());
            this.controller
                .dispatch(parsedMessage)
                .then(result => {
                    if (result.removeOriginalMessage) {
                        msg.delete();
                    }
                    if (result.responseMessage) {
                        msg.channel
                            .send(result.responseMessage)
                            // @todo move to setting
                            .then(m => m.delete(10));
                    }
                    if (result.syncMessageData) {
                        // console.log(result.syncMessageData);
                    }
                });
        });
    }

    start() {
        this.discordClient.login(this.token);
    }
}