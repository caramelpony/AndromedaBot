"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionStats = void 0;
const discord_js_1 = require("discord.js");
exports.RegionStats = {
    name: "region",
    description: "Returns the region statistics",
    type: discord_js_1.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        await interaction.followUp({
            ephemeral: true,
        });
    }
};
