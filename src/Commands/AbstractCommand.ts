import {IParticipantRepository} from "../Repositories/IParticipantRepository";
import {Client} from 'discord.js';
import ICommand from "./ICommand";

export default class AbstractCommand {
    public participantRepository: IParticipantRepository;
    public discordClient: Client;
}