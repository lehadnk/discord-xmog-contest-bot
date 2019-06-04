import {Database} from "sqlite3";

export class DbAdapter {

    private db: Database;

    constructor(dbConnection: Database) {
        this.db = dbConnection;
    }

    async value(sql:string, placeholders?: object): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.db.get(sql, placeholders, (err, row) => {
                if (err !== null) {
                    reject(err);
                    return;
                }

                let keys = Object.keys(row);

                if (keys.length === 0) {
                    reject("Query returned no result!");
                }

                resolve(row[keys[0]]);
            });
        });
    }

    async one(sql:string, placeholders?: object): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.get(sql, placeholders, (err, row) => {
                if (err !== null) {
                    reject(err);
                    return;
                }

                resolve(row);
            });
        });
    }

    async all(sql: string, placeholders?: object): Promise<any[]> {
        return new Promise<object[]>((resolve, reject) => {
            this.db.all(sql, placeholders, (err, rows) => {
                if (err !== null) {
                    reject(err);
                    return;
                }

                resolve(rows);
            });
        });
    }

    async run(sql: string, placeholders?: object): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.db.run(sql, placeholders, (err) => {
                if (err !== null) {
                    reject(err.message);
                    return;
                }

                resolve();
            });
        });
    }
}