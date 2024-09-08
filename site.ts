import {config as dotenvInit} from 'dotenv';
import {Database} from "sqlite3";
import {SqliteDbAdapter} from "./src/SqliteDbAdapter";
import SiteService from "./src/SiteService";
import * as path from 'path';

dotenvInit({path: path.resolve(__dirname, '../.env') });

let db = new Database('./db/prod-db.db3');
let adapter = new SqliteDbAdapter(db);
let siteService = new SiteService(adapter);

siteService.start();