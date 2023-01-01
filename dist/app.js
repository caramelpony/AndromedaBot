"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBot = void 0;
const tslib_1 = require("tslib");
const node_metaverse_1 = require("@caspertech/node-metaverse");
const discord_js_1 = require("discord.js");
const ready_1 = tslib_1.__importDefault(require("../listeners/ready"));
const interactionCreate_1 = tslib_1.__importDefault(require("../listeners/interactionCreate"));
const loginParameters = new node_metaverse_1.LoginParameters();
loginParameters.firstName = 'ctrlshiftcaramel';
loginParameters.lastName = 'Resident';
loginParameters.password = 'n7mkc4njmXzpB4F';
loginParameters.start = 'last';
const token = "MTA1ODg4MzMwNjQxMTgwNjcyMQ.GsBSFY.7Kd1XxzzOY6ZTVBGUlhKKDV4ywwuWj1uw52Bw0";
const options = node_metaverse_1.BotOptionFlags.None;
const bot = new node_metaverse_1.Bot(loginParameters, options);
const getBot = () => {
    return bot;
};
exports.getBot = getBot;
const govGroup = new node_metaverse_1.UUID('06e63916-d370-e304-990f-a615472cd183');
const pwGroup = new node_metaverse_1.UUID('cd8d875e-f0f7-5148-9d54-7f701317f838');
const merchantsGroup = new node_metaverse_1.UUID('cd8d875e-f0f7-5148-9d54-7f701317f838');
const residnetsGroup = new node_metaverse_1.UUID('cd8d875e-f0f7-5148-9d54-7f701317f838');
const client = new discord_js_1.Client({
    intents: []
});
client.login(token);
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
