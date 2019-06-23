import {IParticipantRepository} from "./Repositories/IParticipantRepository";
import {IVoteRepository} from "./Repositories/IVoteRepository";
import {AddParticipantResult} from "./DTO/Results/AddParticipantResult";
import {Participant} from "./Models/Participant";
import {AddParticipantRequest} from "./DTO/Requests/AddParticipantRequest";
import {VoteForParticipantResult} from "./DTO/Results/VoteForParticipantResult";
import {Vote} from "./Models/Vote";
import {VoteForParticipantRequest} from "./DTO/Requests/VoteForParticipantRequest";
import {DatabaseError, DatabaseErrorCode} from "./Exceptions/DatabaseError";
import {ContestSettings} from "./DTO/ContestSettings";
import {normalizeRealmName} from "./Helpers/ChatMessageHelpers";

export class ContestService {
    private participantRepository: IParticipantRepository;
    private votesRepository: IVoteRepository;
    private contestSettings: ContestSettings;

    constructor(participantRepository: IParticipantRepository, votesRepository: IVoteRepository, contestSettings: ContestSettings) {
        this.participantRepository = participantRepository;
        this.votesRepository = votesRepository;
        this.contestSettings = contestSettings;
    }

    handleAddParticipantRequest(request: AddParticipantRequest): Promise<AddParticipantResult> {
        return new Promise<AddParticipantResult>(resolve => {
            if (Date.now() < this.contestSettings.contestStartsAt) {
                resolve(new AddParticipantResult(false, "Прием заявок на конкурс еще не начался"));
                return;
            }

            if (Date.now() > this.contestSettings.contestEndsAt) {
                resolve(new AddParticipantResult(false, "Конкурс уже окончился. Увидимся в следующем году!"))
                return;
            }

            this.participantRepository
                .getParticipant(request.participantName, request.participantRealm)
                .then(participant => {
                    if (participant) {
                        resolve(new AddParticipantResult(false, 'Вы уже зарегистрированы в конкурсе'));
                        return;
                    } else {

                        let participant = new Participant(null,
                            request.participantName,
                            request.participantRealm,
                            normalizeRealmName(request.participantRealm),
                            request.participantDiscordUserId,
                            request.participantImageUrl
                        );

                        this.participantRepository
                            .addParticipant(participant)
                            .then(() => {
                                resolve(new AddParticipantResult(true));
                            }).catch(reason => {
                                if (reason.code == undefined) {
                                    console.error(reason);
                                    resolve(new AddParticipantResult(false, 'Произошла системная ошибка, попробуйте позднее'));
                                    return;
                                }

                                let msg = reason.code == DatabaseErrorCode.ConstraintViolation ? 'Вы уже участвуете в конкурсе' : 'Произошла системная ошибка, попробуйте позднее';
                                resolve(new AddParticipantResult(false, msg));
                            });
                    }
                })
        });
    }

    handleVoteForParticipantRequest(request: VoteForParticipantRequest): Promise<VoteForParticipantResult> {
        return new Promise<VoteForParticipantResult>(resolve => {

            if (Date.now() < this.contestSettings.votingStartsAt) {
                let votingStartsDate = new Date(this.contestSettings.votingStartsAt);
                let votingStartsDateString = votingStartsDate.toLocaleDateString() + " " + votingStartsDate.toLocaleTimeString();
                resolve(new VoteForParticipantResult(false, "Голосование еще не началось. Прием голосов начнется " + votingStartsDateString + "."))
                return;
            }

            if (Date.now() > this.contestSettings.contestEndsAt) {
                resolve(new VoteForParticipantResult(false, "Конкурс уже окончился. Увидимся в следующем году!"))
                return;
            }

            this.participantRepository
                .getParticipant(request.characterName, request.characterRealm)
                .then(participant => {
                    if (participant == null) {
                        resolve(new VoteForParticipantResult(false, 'Такой персонаж не участвует в конкурсе. Вы точно правильно указали его имя?'));
                        return;
                    }

                    if (participant.discordUserId == request.voterDiscordId) {
                        resolve(new VoteForParticipantResult(false, 'Вы не можете голосовать за себя'));
                        return;
                    }

                    let vote = new Vote(null, request.voterDiscordId, participant.id, request.voterDiscordName);
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
                                }).catch(reason => {
                                    if (reason.code == undefined) {
                                        console.error(reason);
                                        resolve(new VoteForParticipantResult(false, 'Произошла системная ошибка, попробуйте позднее'));
                                        return;
                                    }

                                    let msg = reason.code == DatabaseErrorCode.ConstraintViolation ? 'Вы уже голосовали за этого персонажа!' : 'Произошла системная ошибка, попробуйте позднее';
                                    resolve(new VoteForParticipantResult(false, msg));
                            });
                        })
                })
        });
    }
}