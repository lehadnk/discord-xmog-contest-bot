import {ValidatorResult} from "../DTO/ValidatorResult";
import {DiscordMessage} from "../DTO/DiscordMessage";

export class VoteForParticipantMessageValidator {

    public static validate(msg: DiscordMessage): ValidatorResult
    {
        let chunks = msg.message.split(' ');

        // We're removing the command from the string
        chunks.splice(0, 1);
        let characterFields = chunks.join('').split('-');
        if (characterFields.length < 2) {
            return new ValidatorResult(false, "Пожалуйста, укажите имя и сервер персонажа через дефис");
        }

        let characterName = characterFields[0].trim();
        let characterRealm = characterFields[1].trim();

        if (characterName.length < 3) {
            return new ValidatorResult(false, "Пожалуйста, укажите имя персонажа");
        }

        if (characterRealm.length < 4) {
            return new ValidatorResult(false, "Пожалуйста, укажите сервер персонажа, за которого голосуете");
        }

        return new ValidatorResult(true, null, {
            characterName,
            characterRealm,
        });
    }
}