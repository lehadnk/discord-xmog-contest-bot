export class Participant {
    public id: number;
    public name: string;
    public realm: string;
    public imageUrl: string;
    public discordUserId: string;

    constructor(id: number, name: string, realm: string, discordUserId: string, imageUrl: string) {
        this.id = id;
        this.name = name;
        this.realm = realm;
        this.discordUserId = discordUserId;
        this.imageUrl = imageUrl;
    }
}