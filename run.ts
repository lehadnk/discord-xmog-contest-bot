import {config as dotenvInit} from 'dotenv';
import {existsSync, unlinkSync} from "fs";
import {DiscordService} from "./src/DiscordService";
import {Database} from "sqlite3";
import {SqliteDbAdapter} from "./src/SqliteDbAdapter";
import {ParticipantRepository} from "./src/Repositories/ParticipantRepository";
import {VoteRepository} from "./src/Repositories/VoteRepository";
import {ContestSettings} from "./src/DTO/ContestSettings";
import {ContestService} from "./src/ContestService";
import {Client} from "discord.js";
import {exec} from "child_process";

dotenvInit();

const testDbFile = 'test-db.db3';

if (existsSync(testDbFile)) {
    unlinkSync(testDbFile);
    console.log('Test db removed...');
}

exec("npm run migrate up");

let db = new Database('./test-db.db3');
let adapter = new SqliteDbAdapter(db);
let participantRepository = new ParticipantRepository(adapter);
let votesRepository = new VoteRepository(adapter);
let time = Date.now();
let contestSettings = new ContestSettings(time - 100000, time + 200000, time - 50000);
let contestService = new ContestService(participantRepository, votesRepository, contestSettings);
let discordClient = new Client();
let service = new DiscordService(contestService, discordClient, process.env.DISCORD_BOT_TOKEN, process.env.CONTEST_CHANNEL_NAME);

service.start();