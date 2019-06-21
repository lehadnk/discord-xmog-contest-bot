import {IParticipantRepository} from "../Repositories/IParticipantRepository";
import {Client} from "discord.js";

export default interface ICommand {
    name: string;
    participantRepository: IParticipantRepository;
    discordClient: Client;

    run(args: string[]);
}