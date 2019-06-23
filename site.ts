import {config as dotenvInit} from 'dotenv';
import {Database} from "sqlite3";
import {SqliteDbAdapter} from "./src/SqliteDbAdapter";
import SiteService from "./src/SiteService";

dotenvInit();

let db = new Database('./prod-db.db3');
let adapter = new SqliteDbAdapter(db);
let siteService = new SiteService(adapter);

siteService.start();