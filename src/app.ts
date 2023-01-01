import { Bot, BotOptionFlags, LoginParameters, UUID } from '@caspertech/node-metaverse';
import { Client } from "discord.js";
import ready from "../listeners/ready";
import interactionCreate from "../listeners/interactionCreate";
const loginParameters = new LoginParameters();
loginParameters.firstName = 'ctrlshiftcaramel';
loginParameters.lastName = 'Resident';
loginParameters.password = 'n7mkc4njmXzpB4F';
loginParameters.start = 'last';

const token = "MTA1ODg4MzMwNjQxMTgwNjcyMQ.GsBSFY.7Kd1XxzzOY6ZTVBGUlhKKDV4ywwuWj1uw52Bw0";

const options = BotOptionFlags.None;
export const bot = new Bot(loginParameters, options);

const govGroup = new UUID('06e63916-d370-e304-990f-a615472cd183');
const pwGroup = new UUID('cd8d875e-f0f7-5148-9d54-7f701317f838');
const merchantsGroup = new UUID('cd8d875e-f0f7-5148-9d54-7f701317f838');
const residnetsGroup = new UUID('cd8d875e-f0f7-5148-9d54-7f701317f838');

const client = new Client({
    intents: []
});

client.login(token);
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

