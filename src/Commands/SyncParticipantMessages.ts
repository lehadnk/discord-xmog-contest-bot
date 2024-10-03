import {default as ICommand} from "./ICommand";
import AbstractCommand from "./AbstractCommand";
import {Participant} from "../Models/Participant";
import {Guild, TextChannel, Message, Collection, MessageEmbed, MessageActionRow, MessageButton} from 'discord.js';
import {getClassColor, normalizeRealmName} from "../Helpers/ChatMessageHelpers";

export default class SyncParticipantMessages extends AbstractCommand {
    name: string = 'sync-messages';


    async run(args: string[], channelId: string) {
        let participants = await this.participantRepository.getAllParticipants();
        let guildChannels: Map<string, TextChannel> = new Map<string, TextChannel>();
        let msgBuckets: Map<string, Collection<string, Message>> = new Map<string, Collection<string, Message>>();

        let guilds = Array.from(this.discordClient.guilds.cache.values());
        let keys = Object.keys(guilds);
        for (let k in keys) {
            let guild = guilds[k];
            console.log('Reading ' + guild.name + ' messages... ' + guild.id);
            // const channels = guild.channels.cache;
            let channel = guild.channels.cache.find(c => c.name == process.env.CONTEST_CHANNEL_NAME && c.type == "GUILD_TEXT");
            if (!channel) {
                console.log('Channel ' + guild.name + ' not found');
                continue;
            }

            if (!channelId || channel.id == channelId) {
                guildChannels.set(guild.id, channel);

                let messages = await this.fetchServerMessages(guild, channel);
                if (messages != undefined) {
                    msgBuckets.set(guild.id, messages);
                    console.log('Adding ' + guild.name + ' posts...');
                }
            }
        }

        // let channel = this.guildChannels.get(guildId);
        msgBuckets.forEach((bucket, guildId) => {
            // let channel = guildChannels.get(guildId);
            let guild= this.discordClient.guilds.cache.get(guildId)
            let channel = guild.channels.cache.find(c => c.name == process.env.CONTEST_CHANNEL_NAME && c.type == "GUILD_TEXT");

            participants.forEach(participant => {
                let participantPosts = bucket.filter(msg => this.isParticipantPost(msg, participant.name, participant.realm));
                if (participantPosts.size == 0) {
                    this.syncParticipantMessage(participant, guildId, channel);
                    console.log(participant.name + ' - ' + participant.realm + " is not synced with " + guildId);
                }
            });
        });
    }

    private async fetchServerMessages(guild: Guild, channel): Promise<Collection<string, Message>> {
        // @ts-ignore
        console.log('fetchChannelMessages for ' + guild.name + ' in channel ' + channel.id);
        // channel.send("test?");

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
        console.log(`messages received for channel (${messages.size})`);
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

        let check = characterName == participantName && normalizeRealmName(characterRealm) === normalizeRealmName(participantRealm);
        if (!check) {
            let b = 0;
        }

        return characterName == participantName && normalizeRealmName(characterRealm) === normalizeRealmName(participantRealm);
    }

    private syncParticipantMessage(participant: Participant, guildId: string, channel)
    {
        const embed = new MessageEmbed()
            .setDescription(participant.name + ' - ' + participant.realm)
            .setColor(getClassColor(guildId));
        embed.setImage(participant.imageUrl);

        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`VOTE__${participant.name}__${participant.realm}`)
                    .setLabel('Голосовать')
                    .setStyle('PRIMARY')
                // .setDisabled(true)
            );

        let payload = {embeds: [embed]};
        if (row !== null) {
            payload["components"] = [row]
        }

        channel.send(payload).catch(r => console.error("Unable to sync message to " + guildId + ": " + r));
    }
}