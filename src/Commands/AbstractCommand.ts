import {IParticipantRepository} from "../Repositories/IParticipantRepository";
import {Client} from 'discord.js';
import {IDbAdapter} from "../IDbAdapter";

export default class AbstractCommand {
    public participantRepository: IParticipantRepository;
    public discordClient: Client;
    public db: IDbAdapter;
}