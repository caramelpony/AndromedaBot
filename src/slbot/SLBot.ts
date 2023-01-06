import { Bot, BotOptionFlags, LoginParameters, Vector3, InstantMessageEvent, ChatSourceType, InstantMessageEventFlags, UUID } from "@caspertech/node-metaverse";
import { TextChannel } from "discord.js";
import { ServiceContainer } from "../classes/ServiceContainer";

/**
 * Configures the SL bot and offers an API to interact with it.
 */
export class SLBot {
  protected isConnected = false;
  protected isConnecting = false;
  protected bot: Bot;
  protected loginParameters: LoginParameters;

  protected serviceContainer: ServiceContainer;
  /**
   * Construct the bot.
   */
  constructor(serviceContainer: ServiceContainer) {
    this.serviceContainer = serviceContainer;

    this.loginParameters = new LoginParameters();
    this.loginParameters.firstName = <string>process.env.SL_FIRSTNAME;
    this.loginParameters.lastName = <string>process.env.SL_LASTNAME;
    this.loginParameters.password = <string>process.env.SL_PASSWORD;
    this.loginParameters.start = <string>process.env.SL_START;

    const options = BotOptionFlags.LiteObjectStore | BotOptionFlags.StoreMyAttachmentsOnly;
    this.bot = new Bot(this.loginParameters, options);

    this.registerEvents();
  }

  /**
   * Runs an instance of the bot.
   */
  public async run(): Promise<void> {
    this.bot.stayPut(true, 'Zephyr Heights', new Vector3([24, 75, 12])); // Attempt to continuously teleport to this spot.
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

  async onInstantMessage(event: InstantMessageEvent): Promise<void> {
    if (event.source === ChatSourceType.Agent) {

      if (!(event.flags & InstantMessageEventFlags.startTyping || event.flags & InstantMessageEventFlags.finishTyping)) {
        const channel: TextChannel = await this.serviceContainer.getDBot()?.getClient().channels.fetch('1058907686399397918') as TextChannel;

        const msg = `New Message\nFrom: ${event.fromName.toString()}(${event.from.toString()})\n\`\`\`${event.message.toString()}\`\`\``;
        // channel.send(JSON.stringify(event, null, 2));
        channel.send(msg);

        await this.bot.clientCommands.comms.sendInstantMessage(event.from, 'This is a bot account and cannot respond.');
      }
    }
  }
}