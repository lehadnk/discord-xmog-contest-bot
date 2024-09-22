import {Client, MessageActionRow, MessageButton, MessageEmbed} from 'discord.js';
import {DiscordMessage} from "./DTO/DiscordMessage";
import {DiscordController} from "./Controllers/DiscordController";
import {ContestService} from "./ContestService";
import {getClassColor, getMsgAuthorName} from "./Helpers/ChatMessageHelpers";
import {DiscordAttachment} from "./DTO/DiscordAttachment";
import {DiscordControllerResponse} from "./DTO/DiscordControllerResponse";
import {VoteForParticipantRequest} from "./DTO/Requests/VoteForParticipantRequest";

export class DiscordService {
    private readonly discordClient;
    private readonly token: string;
    private readonly controller: DiscordController;
    private readonly contestChannel: string;
    private readonly messageLifeTime: number;

    constructor(contestService: ContestService, controller: DiscordController, discordClient: Client, token: string, contestChannel: string) {
        this.discordClient = discordClient;
        this.token = token;
        this.contestChannel = contestChannel;
        // It's not injectable, since DiscordService logic is highly couped with DiscordController
        this.controller = controller;
        this.messageLifeTime = process.env.MESSAGE_LIFE_SPAN != undefined ? parseInt(process.env.MESSAGE_LIFE_SPAN) : 10000;
        this.setupHandlers();
    }

    private setupHandlers() {
        this.discordClient.on('interactionCreate', interaction => {
            if (!interaction.isButton()) {return;}
            if (interaction.customId.startsWith("VOTE__")) {
                let participantName = interaction.customId.split("__")[1];
                let participantRealm = interaction.customId.split("__")[2];
                let msg = new VoteForParticipantRequest(
                    interaction.user.id,
                    participantName,
                    participantRealm,
                    interaction.user.username,
                    interaction.user.createdAt,
                )
                this.controller.handleVoteForParticipantRequest(msg).then(
                    result => {
                        if (result.responseMessage) {
                            interaction.reply({ content: result.responseMessage, ephemeral: true })
                            return;
                        }
                    }
                )
            } else {
                interaction.reply({ content: "Ошибка", ephemeral: true })
            }
        });


        this.discordClient.on("messageCreate", msg => {
            if (msg.channel.name != this.contestChannel) {
                return;
            }

            if (msg.author.bot) {
                return;
            }

            let attachedImages: DiscordAttachment[] = [];
            msg.attachments.forEach(attachment => {
                if (attachment.name.match(/\.(jpeg|jpg|gif|png)$/) != null) {
                    attachedImages.push(new DiscordAttachment(attachment.url, attachment.filesize));
                }
            });

            let parsedMessage = new DiscordMessage(
                msg.author.id,
                msg.author.createdAt,
                getMsgAuthorName(msg),
                msg.guild.id,
                msg.channel.id,
                msg.content,
                attachedImages
            );

            this.controller
                .dispatch(parsedMessage)
                .then(result => {
                    if (result.syncMessageData) {
                        this.syncMessage(msg, result);
                    }
                    if (result.removeOriginalMessage) {
                        setTimeout( () => {
                            msg.delete().catch(reason => {
                                console.error("Unable to delete message in server " + msg.guild.name + ", reason: " + reason);
                            });
                        }, this.messageLifeTime)
                    }
                    if (result.responseMessage) {
                        msg.channel
                            .send(result.responseMessage)
                            .then(m => setTimeout(() => m.delete({ timeout: this.messageLifeTime }), this.messageLifeTime));
                    }
                });
        });
    }

    private syncMessage(msg, controllerResponse: DiscordControllerResponse)
    {
        const embed = new MessageEmbed()
            .setAuthor(getMsgAuthorName(msg), msg.author.displayAvatarURL)
            .setDescription(msg.content)
            .setColor(getClassColor(msg.guild.id));

        if (msg.attachments.first() !== undefined) {
            // embed.setImage(controllerResponse.metadata.imageUrl ? controllerResponse.metadata.imageUrl: msg.attachments.first().url);
            embed.setImage(msg.attachments.first().url);
        }

        this.discordClient.guilds.cache.forEach(function (guild) {
            if (guild.id !== msg.guild.id || controllerResponse.removeOriginalMessage) {
                const channels = guild.channels.cache
                const channel = channels.find(c => c.name == msg.channel.name);
                if (channel !== null) {
                    let row = null;
                    if (controllerResponse.metadata.newParticipantCharacterName) {
                        row = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId(`VOTE__${controllerResponse.metadata.newParticipantCharacterName}__${controllerResponse.metadata.newParticipantRealm}`)
                                    .setLabel('Голосовать')
                                    .setStyle('PRIMARY')
                                    // .setDisabled(true)
                            );
                    }
                    let payload = {embeds: [embed]};
                    if (row !== null) {
                        payload["components"] = [row]
                    }
                    channel.send(payload).catch(r => console.error("Unable to sync message to " + guild.name + ": " + r));
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