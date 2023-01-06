import { Channel } from 'diagnostics_channel';
import { Client, Collection, Events, GatewayIntentBits, Interaction, Message, REST, Routes, TextChannel } from 'discord.js';
import { ServiceContainer } from '../classes/ServiceContainer';

import fs from 'fs';
import path from 'path';

/**
 * Bootstraps the Discord bot
 */
export class DiscordBot {
  protected serviceContainer: ServiceContainer;

  protected client: Client;

  protected commandsPath: string;
  protected commands: Collection<string, any> = new Collection();

  constructor(serviceContainer: ServiceContainer) {
    this.serviceContainer = serviceContainer;

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ]
    });

    // Set the path of the commands folder.
    this.commandsPath = path.join(__dirname, 'commands');

  }

  /**
   * Run the bot.
   */
  public run(): void {
    this.loadCommands();
    this.registerEvents();
    this.login();
  }

  /**
   * Get the client instance
   */
  public getClient(): Client {
    return this.client;
  }

  /**
   * Gets a list of all command files from the commands directory.
   */
  protected getCommandFiles() {
    return fs.readdirSync(this.commandsPath).filter(file => file.endsWith('.ts'));
  }

  /**
   * Loads the commands from the command folder, and attatches them to the client.
   */
  protected loadCommands(): void {
    this.commands = new Collection();

    const commandFiles = this.getCommandFiles();

    for (const file of commandFiles) {
      const filePath = path.join(this.commandsPath, file);
      const command = require(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ('data' in command && 'execute' in command) {
        this.commands.set(command.data.name, command);
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
      console.log('loaded ', filePath);

    }
  }

  /**
   * Registers event listeners and binds them to their respective handlers.
   */
  protected registerEvents() {
    // Ready message.
    this.client.once(Events.ClientReady, async (c: Client) => {
      console.log(`Ready! Logged in as ${c.user?.tag}`);
    });

    this.client.on(Events.MessageCreate, async (m: Message) => {
      // Intentionally left blank. Apparently adding this listener helps make the interaction event below work properly.

      // TODO: Basically delete this if statement, once the bot is more developed.
      if (m.author.id == '408544448172261377') {
        switch (m.cleanContent) {
          case '!redeploy':
            this.syncSlashCommands(m);
            break;
          case '!slshutdown':
            this.serviceContainer.getSlBot()?.shutdown();
            break;
          case '!slrun':
            this.serviceContainer.getSlBot()?.run();
            break;

          default:
            break;
        }
      }
    });

    // Listen for slash commands.
    this.client.on(Events.InteractionCreate, this.handleSlashCommand.bind(this));

  }

  /**
  * Handles interactions with the bot. Generally this is a slash command.
  */
  protected async handleSlashCommand(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = this.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }

  /**
   * Login to Discord.
   */
  protected login(): void {
    // Log in to Discord with your client's token
    this.client.login(process.env.DISCORD_TOKEN);
  }

  /**
   * Syncs the Command list with the Discord API.
   * DO NOT RUN THIS REGULARLY, as there is an API rate limit.
   * Note: This implementation will ONLY successfully load commands in the guild defined by env.DISCORD_DEV_GUILD
   */
  protected syncSlashCommands(m: Message) {
    this.loadCommands(); // Ensure we have a fresh version of the command list.
    const commands = this.commands.map((command) => command.data.toJSON());

    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: '10' }).setToken(<string>process.env.DISCORD_TOKEN);

    // and deploy your commands!
    (async () => {
      try {
        m.reply(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data: any = await rest.put(
          Routes.applicationGuildCommands(<string>process.env.DISCORD_CLIENT_ID, <string>process.env.DISCORD_DEV_GUILD),
          { body: commands },
        );

        m.reply(`Successfully reloaded ${data.length} application (/) commands.`);
      } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
        m.reply("I'm sorry but I couldn't quite complete your request... Discord told me this:```" + JSON.stringify(error, null, 4) + "```");
      }
    })();
  }
}