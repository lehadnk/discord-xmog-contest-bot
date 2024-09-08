import {ValidatorResult} from "../DTO/ValidatorResult";
import {DiscordMessage} from "../DTO/DiscordMessage";

export class AddParticipantMessageValidator {

    public static validate(msg: DiscordMessage): ValidatorResult
    {
        let chunks = msg.message.split('\n');
        if (chunks.length == 0) {
            return new ValidatorResult(false, "Пожалуйста, укажите имя и сервер вашего персонажа");
        }

        // We're removing the command argument first
        let characterFields = chunks[0].split('-');
        if (characterFields.length != 2) {
            return new ValidatorResult(false, "Пожалуйста, укажите имя и сервер персонажа первой строкой, через дефис");
        }

        let characterName = characterFields[0].trim();
        let characterRealm = characterFields[1].trim();

        if (characterName.length < 3) {
            return new ValidatorResult(false, "Пожалуйста, введите имя вашего персонажа");
        }

        if (characterRealm.length < 4) {
            return new ValidatorResult(false, "Пожалуйста, введите ваш рилм");
        }

        if (characterName.length > 30) {
            return new ValidatorResult(false, "Пожалуйста, введите корректное имя персонажа");
        }

        if (characterRealm.length > 30) {
            return new ValidatorResult(false, "Пожалуйста, введите корректное название рилма");
        }

        if (msg.attachedImages.length == 0) {
            return new ValidatorResult(false, "Вы должны добавить одно изображение к сообщению");
        }

        if (msg.attachedImages.length > 1) {
            return new ValidatorResult(false, "Вы можете добавить не более одного изображения к сообщению");
        }

        let imageToShow = msg.attachedImages[0];
        if (imageToShow.filesizeBytes > Number(process.env.MAX_IMAGE_SIZE_MB) * 1024 * 1024) {
            return new ValidatorResult(false, `Размер изображения должен быть не более ${process.env.MAX_IMAGE_SIZE_MB} мегабайт`);
        }

        return new ValidatorResult(true, null, {
            characterName,
            characterRealm,
            embedImageUrl: imageToShow.imageUrl,
            authorDiscordId: msg.authorId,
        });
    }
}