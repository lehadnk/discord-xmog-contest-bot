import {IParticipantRepository} from "./Repositories/IParticipantRepository";
import {IVoteRepository} from "./Repositories/IVoteRepository";
import {AddParticipantResult} from "./DTO/Results/AddParticipantResult";
import {Participant} from "./Models/Participant";
import {AddParticipantRequest} from "./DTO/Requests/AddParticipantRequest";
import {VoteForParticipantResult} from "./DTO/Results/VoteForParticipantResult";
import {Vote} from "./Models/Vote";
import {VoteForParticipantRequest} from "./DTO/Requests/VoteForParticipantRequest";
import {DatabaseError, DatabaseErrorCode} from "./Exceptions/DatabaseError";

export class ContestService {
    private participantRepository: IParticipantRepository;
    private votesRepository: IVoteRepository;

    constructor(participantRepository: IParticipantRepository, votesRepository: IVoteRepository) {
        this.participantRepository = participantRepository;
        this.votesRepository = votesRepository;
    }

    handleAddParticipantRequest(request: AddParticipantRequest): Promise<AddParticipantResult> {
        return new Promise<AddParticipantResult>(resolve => {
            this.participantRepository
                .getParticipant(request.participantName, request.participantRealm)
                .then(participant => {
                    if (participant) {
                        resolve(new AddParticipantResult(false, 'Вы уже зарегистрирваны в конкурсе'));
                        return;
                    } else {
                        let participant = new Participant(null, request.participantName, request.participantRealm);
                        this.participantRepository
                            .addParticipant(participant)
                            .then(() => {
                                resolve(new AddParticipantResult(true));
                            }).catch(reason => {
                                if (typeof reason != DatabaseError.name) {
                                    resolve(new AddParticipantResult(false, 'Произошла системная ошибка, попробуйте позднее'));
                                    return;
                                }

                                let msg = reason.code == DatabaseErrorCode.ContraintViolation ? 'Вы уже учавствуете в конкурсе' : 'Произошла системная ошибка, попробуйте позднее';
                                resolve(new AddParticipantResult(false, msg));
                            });
                    }
                })
        });
    }

    handleVoteForParticipantRequest(request: VoteForParticipantRequest): Promise<VoteForParticipantResult> {
        return new Promise<VoteForParticipantResult>(resolve => {
            this.participantRepository
                .getParticipant(request.characterName, request.characterRealm)
                .then(participant => {
                    if (participant == null) {
                        resolve(new VoteForParticipantResult(false, 'Такой персонаж не учавствует в конкурсе. Вы точно правильно указали его имя?'));
                        return;
                    }

                    let vote = new Vote(null, request.voterDiscordId, participant.id);
                    this.votesRepository
                        .isVoteExists(vote)
                        .then(result => {
                            if (result == true) {
                                resolve(new VoteForParticipantResult(false, 'Вы уже голосовали за этого персонажа!'));
                                return;
                            }

                            this.votesRepository
                                .addVote(vote)
                                .then(result => {
                                    resolve(new VoteForParticipantResult(true));
                                })
                                .catch(reason => {
                                    if (typeof reason != DatabaseError.name) {
                                        resolve(new VoteForParticipantResult(false, 'Произошла системная ошибка, попробуйте позднее'));
                                        return;
                                    }

                                    let msg = reason.code == DatabaseErrorCode.ContraintViolation ? 'Вы уже голосовали за этого персонажа!' : 'Произошла системная ошибка, попробуйте позднее';
                                    resolve(new VoteForParticipantResult(false, msg));
                                });
                        })
                });
        });
    }
}