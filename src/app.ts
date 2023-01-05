import * as dotenv from 'dotenv';
dotenv.config();

import { SLBot } from "./classes/SLBot";

// Bootstrap the Bot instance.
const slBot = new SLBot();
slBot.run();