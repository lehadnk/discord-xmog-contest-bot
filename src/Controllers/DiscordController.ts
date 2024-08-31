import {DiscordMessage} from "../DTO/DiscordMessage";
import {ContestService} from "../ContestService";
import {AddParticipantRequest} from "../DTO/Requests/AddParticipantRequest";
import {DiscordControllerResponse} from "../DTO/DiscordControllerResponse";
import {VoteForParticipantRequest} from "../DTO/Requests/VoteForParticipantRequest";
import {AddParticipantMessageValidator} from "../Validators/AddParticipantMessageValidator";
import {VoteForParticipantMessageValidator} from "../Validators/VoteForParticipantMessageValidator";

export class DiscordController {
    private readonly contestService: ContestService;
    private readonly contestAnnouncerIds: string[];

    constructor(contestService: ContestService, contestAnnouncerIds: string[]) {
        this.contestAnnouncerIds = contestAnnouncerIds;
        this.contestService = contestService;
    }

    dispatch(msg: DiscordMessage): Promise<DiscordControllerResponse> {
        if (this.contestAnnouncerIds.indexOf(msg.authorId) != -1) {
            console.info('announcer msg');
            return this.handleAnnounceRequest(msg);
        }

        if (msg.embedImageUrl.length > 0) {
            console.info('participant msg');
            return this.handleAddParticipantRequest(msg);
        }

        if (msg.message.substr(0, 5) === '/vote') {
            console.info('voter msg');
            return this.handleVoteForParticipantRequest(msg);
        }

        console.info('spam msg');
        // Spam message - we're just clearing it
        return new Promise<DiscordControllerResponse>((resolve) => {
            resolve(new DiscordControllerResponse(null, null, true));
        });
    }

    private handleAddParticipantRequest(msg: DiscordMessage): Promise<DiscordControllerResponse> {
        return new Promise<DiscordControllerResponse>(resolve => {
            let validationResult = AddParticipantMessageValidator.validate(msg);

            if (!validationResult.isValid) {
                resolve(new DiscordControllerResponse(validationResult.errorMessage, null, true));
                return;
            }

            let addParticipantRequest = new AddParticipantRequest(
                validationResult.fields.characterName,
                validationResult.fields.characterRealm,
                validationResult.fields.embedImageUrl,
                validationResult.fields.authorDiscordId,
            );

            this.contestService
                .handleAddParticipantRequest(addParticipantRequest)
                .then(result => {
                    if (result.isSuccess) {
                        resolve(new DiscordControllerResponse(null, msg, false));
                        return;
                    }

                    resolve(new DiscordControllerResponse(result.messageResponse, null, true));
                })
                .catch(reason => {
                    // @todo error logging
                    resolve(new DiscordControllerResponse("С ботом происходит что-то очень нехорошее, попробуйте зарегистрироваться позднее :(", null, true))
                });
        });
    }

    private handleVoteForParticipantRequest(msg: DiscordMessage): Promise<DiscordControllerResponse> {
        return new Promise<DiscordControllerResponse>(resolve => {
            let validationResult = VoteForParticipantMessageValidator.validate(msg);

            if (!validationResult.isValid) {
                resolve(new DiscordControllerResponse(validationResult.errorMessage, null, true));
                return;
            }

            let voteForParticipantRequest = new VoteForParticipantRequest(
                msg.authorId,
                validationResult.fields.characterName,
                validationResult.fields.characterRealm,
                msg.authorName,
            );

            this.contestService
                .handleVoteForParticipantRequest(voteForParticipantRequest)
                .then(result => {
                    if (result.isSuccess) {
                        // @todo better response message
                        resolve(new DiscordControllerResponse("Ваш голос учтен!", null, true));
                        return;
                    }

                    resolve(new DiscordControllerResponse(result.messageResponse, null, true));
                })
                .catch(reason => {
                    // @todo error logging
                    resolve(new DiscordControllerResponse("С ботом происходит что-то очень нехорошее, попробуйте зарегистрироваться позднее :(", null, true))
                });
        });
    }

    private handleAnnounceRequest(msg: DiscordMessage): Promise<DiscordControllerResponse> {
        return new Promise<DiscordControllerResponse>((resolve) => {
            resolve(new DiscordControllerResponse(null, msg, false));
        });
    }
}