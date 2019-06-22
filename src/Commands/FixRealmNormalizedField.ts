import {default as ICommand} from "./ICommand";
import AbstractCommand from "./AbstractCommand";
import {Participant} from "../Models/Participant";
import {Guild, TextChannel, Message, Collection, RichEmbed} from 'discord.js';
import {getClassColor, getMsgAuthorName, normalizeRealmName} from "../Helpers/ChatMessageHelpers";

export default class FixRealmNormalizedField extends AbstractCommand implements ICommand {
    name: string = 'fix-realm-normalized';

    private participants: Participant[];

    async run(args: string[]) {
        this.participants = await this.participantRepository.getAllParticipants();
        this.participants.forEach(participant => {
            this.db.run("UPDATE participants SET realmNormalized = ?1 WHERE id = ?2", {
                1: normalizeRealmName(participant.realmNormalized),
                2: participant.id,
            })
        });
    }
}