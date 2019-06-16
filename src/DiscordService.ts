import {Client, RichEmbed} from 'discord.js';
import {DiscordMessage} from "./DTO/DiscordMessage";
import {DiscordController} from "./Controllers/DiscordController";
import {ContestService} from "./ContestService";
import {getClassColor, getMsgAuthorName} from "./Helpers/ChatMessageHelpers";

export class DiscordService {
    private readonly discordClient;
    private readonly token: string;
    private readonly controller: DiscordController;
    private readonly contestChannel: string;
    messageLifeTime: number;

    constructor(contestService: ContestService, discordClient: Client, token: string, contestChannel: string) {
        this.discordClient = discordClient;
        this.token = token;
        this.contestChannel = contestChannel;
        // It's not injectable, since DiscordService logic is highly couped with DiscordController
        this.controller = new DiscordController(contestService);
        this.messageLifeTime = process.env.MESSAGE_LIFE_SPAN != undefined ? parseInt(process.env.MESSAGE_LIFE_SPAN) : 10000;
        this.setupHandlers();
    }

    private setupHandlers() {
        this.discordClient.on("message", msg => {
            if (msg.channel.name != this.contestChannel) {
                return;
            }

            if (msg.author.bot) {
                return;
            }

            let imageUrls: string[] = [];
            msg.attachments.forEach(attachment => {
                if (attachment.url.match(/\.(jpeg|jpg|gif|png)$/) != null) {
                    imageUrls.push(attachment.url);
                }
            });

            let parsedMessage = new DiscordMessage(
                msg.author.id,
                msg.guild.id,
                msg.channel.id,
                msg.content,
                imageUrls
            );

            this.controller
                .dispatch(parsedMessage)
                .then(result => {
                    if (result.removeOriginalMessage) {
                        msg.delete(1);
                    }
                    if (result.responseMessage) {
                        msg.channel
                            .send(result.responseMessage)
                            .then(m => m.delete(this.messageLifeTime));
                    }
                    if (result.syncMessageData) {
                        this.syncMessage(msg);
                    }
                });
        });
    }

    private syncMessage(msg)
    {
        const embed = new RichEmbed()
            .setAuthor(getMsgAuthorName(msg), msg.author.displayAvatarURL)
            .setDescription(msg.content)
            .setColor(getClassColor(msg));

        if (msg.attachments.first() !== undefined) {
            embed.setImage(msg.attachments.first().url);
        }

        this.discordClient.guilds.forEach(function (guild) {
            if (guild.id !== msg.guild.id) {
                const channel = guild.channels.find(c => c.name == msg.channel.name);
                if (channel !== null) {
                    channel.send({embed}).catch(r => console.error("Unable to sync message to " + guild.name + ": " + r));
                }
            }
        });
    };

    start() {
        this.discordClient
            .login(this.token)
            .then(() => {
                console.info('Bot is up!');
            })
    }
}