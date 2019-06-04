export class Participant {
    public id: number;
    public name: string;
    public realm: string;

    constructor(id: number, name: string, realm: string) {
        this.id = id;
        this.name = name;
        this.realm = realm;
    }
}