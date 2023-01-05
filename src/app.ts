import { Bot, BotOptionFlags, LoginParameters, UUID } from '@caspertech/node-metaverse';
import 'dotenv/config'
import { Client } from "discord.js";
import ready from "../listeners/ready";
import interactionCreate from "../listeners/interactionCreate";
const loginParameters = new LoginParameters();
loginParameters.firstName = (process.env.SL_FIRSTNAME as string);
loginParameters.lastName = (process.env.SL_LASTNAME as string);
loginParameters.password = (process.env.SL_PASSWORD as string);
loginParameters.start = (process.env.SL_PASSWORD as string);

const options = BotOptionFlags.None;
const bot = new Bot(loginParameters, options);

export const getBot = () => {
    return bot;
};

const govGroup = new UUID(process.env.GROUPS_GOV as string);
const pwGroup = new UUID(process.env.GROUPS_WORKS as string);
const merchantsGroup = new UUID(process.env.GROUPS_MERCHANTS as string);
const residnetsGroup = new UUID(process.env.GROUPS_RESIDENTS as string);

const client = new Client({
    intents: []
});

client.login(process.env.DISCORD_TOKEN);
ready(client);
interactionCreate(client);

bot.login().then((response) =>
{
    console.log("Login complete");

    //Establish circuit with region
    return bot.connectToSim();
}).then(() =>
{
    console.log("Connected to " + bot.currentRegion.regionName);
}).catch((error) =>
{
    console.error(error);
});

