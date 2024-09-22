import {default as ICommand} from "./ICommand";
import AbstractCommand from "./AbstractCommand";
import {Participant} from "../Models/Participant";
import {Guild, TextChannel, Message, Collection, MessageEmbed} from 'discord.js';
import {getClassColor, normalizeRealmName} from "../Helpers/ChatMessageHelpers";

export default class SyncParticipantMessages extends AbstractCommand implements ICommand {
    name: string = 'sync-messages';

    private participants: Participant[];
    private msgBuckets: Map<string, Collection<string, Message>> = new Map<string, Collection<string, Message>>();
    private guildChannels: Map<string, TextChannel> = new Map<string, TextChannel>();

    async run(args: string[]) {
        this.participants = await this.participantRepository.getAllParticipants();

        let guilds = this.discordClient.guilds.cache.array();
        let keys = Object.keys(guilds);
        for (let k in keys) {
            let guild = guilds[k];
            let messages = await this.fetchServerMessages(guild);
            if (messages != undefined) {
                this.msgBuckets.set(guild.id, messages);
                console.log('Adding ' + guild.name + ' posts...');
            }
        }

        this.participants.forEach(participant => {
            this.msgBuckets.forEach((bucket, guildId) => {
                let participantPosts = bucket.filter(msg => this.isParticipantPost(msg, participant.name, participant.realmNormalized));
                if (participantPosts.size == 0) {
                    this.syncParticipantMessage(participant, guildId);
                    console.log(participant.name + ' - ' + participant.realm + " is not synced with " + guildId);
                }
            });
        });
    }

    private async fetchServerMessages(guild: Guild): Promise<Collection<string, Message>> {
        let channel: TextChannel;
        // @ts-ignore
        const channels = guild.channels.cache;
        channel = guild.channels.cache.find(c => c.name == process.env.CONTEST_CHANNEL_NAME && c.type == 'text');
        if (!channel) {
            return;
        }

        this.guildChannels.set(guild.id, channel);

        let msgBucket = await this.fetchChannelMessages(channel, null);
        msgBucket = msgBucket.filter(msg => msg.createdAt.getFullYear() == 2024); // these warlocks...

        return msgBucket;

    }

    private async fetchChannelMessages(channel: TextChannel, before: string): Promise<Collection<string, Message>> {
        let request = {limit: 100};
        if (before != null) {
            request['before'] = before;
        }
        let messages = await channel.messages.fetch(request);
        let lastMessageId = messages.last() ? messages.last().id : null;

        let result = messages;
        if (messages.size == 100) {
            let messages2 = await this.fetchChannelMessages(channel, lastMessageId);
            result = result.concat(messages2);
        }

        return result;
    }

    private isParticipantPost(msg: Message, participantName: string, participantRealm: string): boolean {
        let isEmbed = msg.embeds.length > 0;
        let firstRow: string;
        if (isEmbed) {
            let embed = msg.embeds[0];
            firstRow = embed.description;
        } else {
            firstRow = msg.content;
        }

        let chunks = firstRow.split('\n');
        if (chunks.length == 0) {
            return false;
        }

        // We're removing the command argument first
        let characterFields = chunks[0].split('-');
        if (characterFields.length != 2) {
            return false;
        }

        let characterName = characterFields[0].trim();
        let characterRealm = characterFields[1].trim();

        return characterName == participantName && normalizeRealmName(characterRealm) === participantRealm;
    }

    private syncParticipantMessage(participant: Participant, guildId: string)
    {
        if (!this.guildChannels.has(guildId)) {
            throw new Error("Cannot find xmog contest channel for " + guildId);
        }
        let channel = this.guildChannels.get(guildId);

        const embed = new MessageEmbed()
            .setDescription(participant.name + ' - ' + participant.realm)
            .setColor(getClassColor(guildId));
        embed.setImage(participant.imageUrl);

        channel.send({embed}).catch(r => console.error("Unable to sync message to " + guildId + ": " + r));
    }
}