"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hello = void 0;
const discord_js_1 = require("discord.js");
const app_1 = require("../src/app");
const bot = (0, app_1.getBot)();
exports.Hello = {
    name: "region",
    description: "Returns the region statistics",
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const content = bot.currentRegion.regionName;
        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};
