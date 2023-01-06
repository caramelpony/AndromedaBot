import * as dotenv from 'dotenv';
dotenv.config();

import { ServiceContainer } from './classes/ServiceContainer';
import { SLBot } from "./slbot/SLBot";
import { DiscordBot } from './discordbot/DiscordBot';

const serviceContainer = new ServiceContainer();

// Bootstrap the Bot instance.
const slBot = new SLBot(serviceContainer);
serviceContainer.setSlBot(slBot);
slBot.run();

// Bootstrap the Discord Bot.
const dBot = new DiscordBot(serviceContainer);
serviceContainer.setDiscordBot(dBot);
dBot.run();
