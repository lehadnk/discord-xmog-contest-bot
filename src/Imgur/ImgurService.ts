export class ImgurService {
    private readonly imgurClientId;

    constructor() {
        this.imgurClientId = process.env.IMGUR_CLIENT_ID;
    }

    public async uploadImageToImgur(temporaryImageUrl: string): Promise<string> {
        let body = JSON.stringify({
            "image": temporaryImageUrl
        })

        let result = await fetch("https://api.imgur.com/3/image", {
            method: 'POST',
            headers: {
                "Authorization": `Client-ID ${this.imgurClientId}`,
                "Content-Type": "application/json",
            },
            body: body
        })
            .then(response => response.text())
            .then(result => {
                const parsedResponse = JSON.parse(result);
                return parsedResponse.data.link;
            })
            .catch(error => console.log('Imgur upload error', error));

        return result;
    };
}
