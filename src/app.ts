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

// Cleanup on Bot shutdown. There may be rare cases where this does not catch the exit event, for example on an exception.
async function exitHandler(options: any, exitCode: any) {
  if (options.cleanup) {
    await serviceContainer.getSlBot()?.getBot().close();
  };
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { cleanup: true, exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { cleanup: true, exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { cleanup: true, exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { cleanup: true, exit: true }));