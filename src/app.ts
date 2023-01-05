import * as dotenv from 'dotenv';
dotenv.config();

import { SLBot } from "./slbot/SLBot";
import { DiscordBot } from './discordbot/DiscordBot';

// Bootstrap the Bot instance.
// const slBot = new SLBot();
// slBot.run();

// Bootstrap the Discord Bot.
const dBot = new DiscordBot();
dBot.run();
