import { Channel } from 'diagnostics_channel';
import { Client, Collection, Events, GatewayIntentBits, Interaction, Message, REST, Routes, TextChannel } from 'discord.js';

import fs from 'fs';
import path from 'path';

/**
 * Bootstraps the Discord bot
 */
export class DiscordBot {
  protected client: Client;

  protected commandsPath: string;
  protected commands: Collection<string, any> = new Collection();

  constructor() {
    // Set the path of the commands folder.
    this.commandsPath = path.join(__dirname, '..', 'dslash');

    // Create a new client instance.
    this.client = new Client({
      intents: [
        // GatewayIntentBits.DirectMessages
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ]
    });

    // Ready message.
    this.client.once(Events.ClientReady, async (c: Client) => {
      console.log(`Ready! Logged in as ${c.user?.tag}`);
      // const channel: TextChannel = await this.client.channels.fetch('1058907686399397918') as TextChannel;
      // channel.send('another test wo');
    });

    this.client.on(Events.MessageCreate, async (m: Message) => {
      // return;
      // console.log(m);
      if (m.author.id == '1058883306411806721') { // Ignore the bots own messages.
        return;
      }
      if (m.channelId == '1058907686399397918' && m.author.id == "408544448172261377" && m.cleanContent == "redeploy") {
        m.reply('You got it! Contacting the Draconequus\' API...');
        this.syncSlashCommands(m);
      }
      if (m.channelId == '1058907686399397918' && m.author.id == "408544448172261377" && m.cleanContent == "bedtime") {
        m.reply('Goodnight 💜. Disconnecting bot and shutting down services.').then(() => {
          process.exit(1);
        });
      }
      // if (m.channelId == '1058907686399397918') {
      //   const payload = JSON.stringify(m, null, 4);
      //   m.reply(`I heard: \`${m.content}\`\nPayload:\n\`\`\`${payload}\`\`\``);
      // }
    });

    // Listen for interactions.
    this.client.on(Events.InteractionCreate, async (interaction: Interaction) => {
      console.log('an interaction!');

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
    });

  }

  /**
   * Run the bot.
   */
  public run(): void {
    this.loadCommands();
    this.login();
  }

  /**
   * Get the client instance
   */
  public getClient(): Client {
    return this.client;
  }

  /**
   * Loads the commands from the command folder, and attatches them to the client.
   */
  protected loadCommands(): void {
    this.commands = new Collection();

    const commandFiles = fs.readdirSync(this.commandsPath).filter(file => file.endsWith('.ts'));

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
    const commands = [];
    // Grab all the command files from the commands directory you created earlier
    const commandFiles = fs.readdirSync(this.commandsPath).filter(file => file.endsWith('.ts'));

    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const filePath = path.join(this.commandsPath, file);
      const command = require(filePath);
      commands.push(command.data.toJSON());
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: '10' }).setToken(<string>process.env.DISCORD_TOKEN);

    // and deploy your commands!
    (async () => {
      try {
        // console.log(`Started refreshing ${commands.length} application (/) commands.`);
        m.reply(`Started refreshing ${commands.length} application (/) commands.`);
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
          Routes.applicationGuildCommands(<string>process.env.DISCORD_CLIENT_ID, <string>process.env.DISCORD_DEV_GUILD),
          { body: commands },
        );

        m.reply(`Successfully reloaded application (/) commands.`);
        // console.log(`Successfully reloaded ${data.length} application (/) commands.`);
      } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
        m.reply(`I'm sorry but I couldn't quite complete your request... Discord told me this:\`\`\`${JSON.stringify(error, null, 4)}\`\`\``);
      }
    })();
  }
}