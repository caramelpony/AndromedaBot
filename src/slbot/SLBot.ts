import { Command } from "./classes/Command";
import { Bot, BotOptionFlags, LoginParameters, Vector3, InstantMessageEvent, ChatSourceType, InstantMessageEventFlags, UUID } from "@caspertech/node-metaverse";
import { TextChannel } from "discord.js";
import { ServiceContainer } from "../classes/ServiceContainer";

import fs from 'fs';
import path from 'path';

/**
 * Configures the SL bot and offers an API to interact with it.
 */
export class SLBot {
  protected isConnected = false;
  protected isConnecting = false;
  protected bot: Bot;
  protected loginParameters: LoginParameters;

  protected ownerUUIDs: UUID[];
  protected commandsPath: string;
  protected commands: Map<string, any> = new Map();

  protected serviceContainer: ServiceContainer;
  /**
   * Construct the bot.
   */
  constructor(serviceContainer: ServiceContainer) {
    this.serviceContainer = serviceContainer;
    this.commandsPath = path.join(__dirname, 'commands');

    this.loginParameters = new LoginParameters();
    this.loginParameters.firstName = <string>process.env.SL_FIRSTNAME;
    this.loginParameters.lastName = <string>process.env.SL_LASTNAME;
    this.loginParameters.password = <string>process.env.SL_PASSWORD;
    this.loginParameters.start = <string>process.env.SL_START;

    this.ownerUUIDs = [
      new UUID('32289168-0fbe-40cc-9b71-b162f660564a'),
    ];

    const options = BotOptionFlags.LiteObjectStore | BotOptionFlags.StoreMyAttachmentsOnly;
    this.bot = new Bot(this.loginParameters, options);

    this.registerEvents();
  }

  /**
   * Runs an instance of the bot.
   */
  public async run(): Promise<void> {
    this.loadCommands();
    // this.bot.stayPut(true, 'Zephyr Heights', new Vector3([24, 75, 12])); // Attempt to continuously teleport to this spot.
    await this.login();
  }

  /**
   * Clean shutdown of the Bot.
   */
  public async shutdown() {
    this.bot.close();
  }

  public getBot(): Bot {
    return this.bot;
  }

  /**
   * Register the event listeners
   */
  protected registerEvents(): void {
    this.bot.clientEvents.onInstantMessage.subscribe(this.onInstantMessage.bind(this));
  }

  /**
   * Login the bot.
   */
  protected async login() {

    this.bot.login().then((response) => {
      console.log("Login complete");
      this.bot.connectToSim();
    }).then(async () => {
      console.log("Connected");
    }).catch((error) => {
      console.error(error);
    });
  }

  /**
   * Gets a list of all command files from the commands directory.
   */
  protected getCommandFiles() {
    return fs.readdirSync(this.commandsPath).filter(file => file.endsWith('.ts'));
  }

  /**
   * Loads all commands from the commands directory.
   */
  protected loadCommands(): void {
    this.commands = new Map();

    const commandFiles = this.getCommandFiles();
    for (const file of commandFiles) {
      const filePath = path.join(this.commandsPath, file);
      const commandClass = require(filePath);

      try {
        const command = new commandClass(this.bot, this.serviceContainer);
        if (command instanceof Command) {
          this.commands.set(command.getName(), command);
        } else {
          console.log(`[WARNING] The command at ${filePath} is not an instance of Command.`);
        }
        console.log('loaded ', filePath);
      } catch (error) {
        console.log(`[ERROR] The command at ${filePath} could not be loaded. Is it a class?`);
      }
    }
  }


  /**
   * Handles all instant message events.
   */
  protected async onInstantMessage(event: InstantMessageEvent): Promise<void> {

    if (event.source === ChatSourceType.Agent) {

      // Ignore StartTyping and EndTyping events. They are irrelevant to responding to messages.
      if (!(event.flags & InstantMessageEventFlags.startTyping || event.flags & InstantMessageEventFlags.finishTyping)) {

        // Forwards the message to Discord
        const channel: TextChannel = await this.serviceContainer.getDBot()?.getClient().channels.fetch('1058907686399397918') as TextChannel;
        const dMsg = `New Message\nFrom: ${event.fromName.toString()}(${event.from.toString()})\n\`\`\`${event.message.toString()}\`\`\``;
        channel.send(dMsg);

        // If the sender is a bot owner, run the command handler
        if (this.isOwnerUUID(event.from)) {
          this.handleCommand(event);
        } else {
          await this.bot.clientCommands.comms.sendInstantMessage(event.from, 'This is a bot account and cannot respond.');
        };

      }
    }
  }

  /**
   * Process a command from a message event
   */
  protected async handleCommand(event: InstantMessageEvent) {
    const msg = event.message.toString();
    // If message does not have command prefix.
    if (!msg.startsWith('/')) return;

    const args = msg.slice(1).trim().split(/\s+/);

    // If there's no command
    const cmd = <string>args.shift()?.toLowerCase();
    if (cmd.length == 0) return;

    const foundCommand: Command | undefined = this.commands.get(cmd);
    if (!foundCommand) {
      await this.bot.clientCommands.comms.sendInstantMessage(event.from, `/${cmd} is not a valid command`);
      return;
    }
    foundCommand.execute(event, args);
  }

  /**
   * Check whether the provided UUID is of bot owner
   * @return {boolean} True when the provided uuid is an owner.
   */
  protected isOwnerUUID(uuid: UUID): boolean {
    const foundOwner = this.ownerUUIDs.find(ownerUuid => (uuid.toString() === ownerUuid.toString()));
    if (foundOwner == undefined) {
      return false;
    }
    return true;
  }
}