import {Database} from "sqlite3";
import {Client} from 'discord.js';
import {SqliteDbAdapter} from "./src/SqliteDbAdapter";
import {config as dotenvInit} from 'dotenv';

dotenvInit();

let db = new Database('./test-db.db3');
let adapter = new SqliteDbAdapter(db);
adapter.one("SELECT 1;", []).then((result) => {
    console.log(result);
});

let discordClient = new Client();

discordClient.on("message", msg => {
    console.log(msg.content);
});

discordClient.login(process.env.DISCORD_BOT_TOKEN);