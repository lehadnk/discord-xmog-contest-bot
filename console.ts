import {CommandService} from "./src/CommandService";
import {config as dotenvInit} from "dotenv";
import {Database} from "sqlite3";
import {SqliteDbAdapter} from "./src/SqliteDbAdapter";
import {ParticipantRepository} from "./src/Repositories/ParticipantRepository";
import {Client} from 'discord.js';

dotenvInit();

let db = new Database('./db/prod-db.db3');
let adapter = new SqliteDbAdapter(db);
let participantRepository = new ParticipantRepository(adapter);
let discordClient = new Client();

let commandService = new CommandService(participantRepository, discordClient, adapter);

if (process.argv.length < 3) {
    console.error("You should specify the command");
    process.exit(0);
}

let command = process.argv[2];
let args = process.argv.splice(0, 3);

discordClient.login(process.env.DISCORD_BOT_TOKEN).then(() => {
    commandService.run(command, args);
});