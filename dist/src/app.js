"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBot = void 0;
const tslib_1 = require("tslib");
const node_metaverse_1 = require("@caspertech/node-metaverse");
require("dotenv/config");
const discord_js_1 = require("discord.js");
const ready_1 = tslib_1.__importDefault(require("../listeners/ready"));
const interactionCreate_1 = tslib_1.__importDefault(require("../listeners/interactionCreate"));
const loginParameters = new node_metaverse_1.LoginParameters();
loginParameters.firstName = process.env.SL_FIRSTNAME;
loginParameters.lastName = process.env.SL_LASTNAME;
loginParameters.password = process.env.SL_PASSWORD;
loginParameters.start = process.env.SL_PASSWORD;
const options = node_metaverse_1.BotOptionFlags.None;
const bot = new node_metaverse_1.Bot(loginParameters, options);
const getBot = () => {
    return bot;
};
exports.getBot = getBot;
const govGroup = new node_metaverse_1.UUID(process.env.GROUPS_GOV);
const pwGroup = new node_metaverse_1.UUID(process.env.GROUPS_WORKS);
const merchantsGroup = new node_metaverse_1.UUID(process.env.GROUPS_MERCHANTS);
const residnetsGroup = new node_metaverse_1.UUID(process.env.GROUPS_RESIDENTS);
const client = new discord_js_1.Client({
    intents: []
});
client.login(process.env.DISCORD_TOKEN);
(0, ready_1.default)(client);
(0, interactionCreate_1.default)(client);
bot.login().then((response) => {
    console.log("Login complete");
    return bot.connectToSim();
}).then(() => {
    console.log("Connected to " + bot.currentRegion.regionName);
}).catch((error) => {
    console.error(error);
});
