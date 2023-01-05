import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Bot, UUID } from '@caspertech/node-metaverse';
import { Command } from "../src/command";
import { getBot } from '../src/app';

export const RegionStats: Command = {
    name: "region",
    description: "Returns the region statistics",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        //const content = getBot.currentRegion.regionName

        await interaction.followUp({
            ephemeral: true,
            
        });
    }
}; 