import {Participant} from "../Models/Participant";

export interface IParticipantRepository {
    addParticipant(participant: Participant): Promise<void>;
    getParticipant(characterName: string, realmName: string): Promise<Participant>;
    getAllParticipants(): Promise<Participant[]>;
}