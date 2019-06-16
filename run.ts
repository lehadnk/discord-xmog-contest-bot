import {config as dotenvInit} from 'dotenv';
import {DiscordService} from "./src/DiscordService";
import {Database} from "sqlite3";
import {SqliteDbAdapter} from "./src/SqliteDbAdapter";
import {ParticipantRepository} from "./src/Repositories/ParticipantRepository";
import {VoteRepository} from "./src/Repositories/VoteRepository";
import {ContestSettings} from "./src/DTO/ContestSettings";
import {ContestService} from "./src/ContestService";
import {Client} from "discord.js";
import {DiscordController} from "./src/Controllers/DiscordController";

dotenvInit();

let announcerIds = JSON.parse(process.env.CONTEST_ANNOUNCER_IDS);
let contestStartTime = Date.parse(process.env.CONTEST_STARTS_AT);
let contestEndTime = Date.parse(process.env.CONTEST_ENDS_AT);
let votingStartTime = Date.parse(process.env.VOTING_STARTS_AT);

let db = new Database('./test-db.db3');
let adapter = new SqliteDbAdapter(db);
let participantRepository = new ParticipantRepository(adapter);
let votesRepository = new VoteRepository(adapter);
let contestSettings = new ContestSettings(contestStartTime, contestEndTime, votingStartTime);
let contestService = new ContestService(participantRepository, votesRepository, contestSettings);
let discordController = new DiscordController(contestService, announcerIds);
let discordClient = new Client();
let service = new DiscordService(
    contestService,
    discordController,
    discordClient,
    process.env.DISCORD_BOT_TOKEN,
    process.env.CONTEST_CHANNEL_NAME
);

service.start();