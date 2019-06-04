import {Vote} from "../Models/Vote";

export interface IVoteRepository {
    addVote(vote: Vote): Promise<void>;
    isVoteExists(vote: Vote): Promise<boolean>;
}