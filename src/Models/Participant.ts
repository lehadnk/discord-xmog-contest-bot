export class Participant {
    public id: number;
    public name: string;
    public realm: string;
    public realmNormalized: string;
    public imageUrl: string;
    public discordUserId: string;

    constructor(id: number, name: string, realm: string, realmNormalized: string, discordUserId: string, imageUrl: string) {
        this.id = id;
        this.name = name;
        this.realm = realm;
        this.realmNormalized = realmNormalized;
        this.discordUserId = discordUserId;
        this.imageUrl = imageUrl;
    }
}