import { Bot, BotOptionFlags, LoginParameters, Vector3, InstantMessageEvent, ChatSourceType, InstantMessageEventFlags } from "@caspertech/node-metaverse";

/**
 * Configures the SL bot and offers an API to interact with it.
 */
export class SLBot {
  protected isConnected = false;
  protected isConnecting = false;
  protected bot: Bot;
  protected loginParameters: LoginParameters;

  /**
   * Construct the bot.
   */
  constructor() {
    this.loginParameters = new LoginParameters();
    this.loginParameters.firstName = <string>process.env.SL_FIRSTNAME;
    this.loginParameters.lastName = <string>process.env.SL_LASTNAME;
    this.loginParameters.password = <string>process.env.SL_PASSWORD;
    this.loginParameters.start = <string>process.env.SL_START;

    const options = BotOptionFlags.LiteObjectStore | BotOptionFlags.StoreMyAttachmentsOnly;
    this.bot = new Bot(this.loginParameters, options);
  }

  /**
   * Runs an instance of the bot.
   */
  public async run(): Promise<void> {

    this.bot.stayPut(true, 'Zephyr Heights', new Vector3([24, 75, 12])); // Attempt to continuously teleport to this spot.
    await this.login();
  }

  public getBot(): Bot {
    return this.bot;
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
      this.bot.clientEvents.onInstantMessage.subscribe(this.onInstantMessage.bind(this));

      // Notify Admins that she's workin!
      await this.bot.clientCommands.comms.sendInstantMessage('32289168-0fbe-40cc-9b71-b162f660564a', "Hey Dashie, I'm online~");
      await this.bot.clientCommands.comms.sendInstantMessage('72461b84-5ee8-45b1-84f3-3f829e8fab88', "Hey Caramel, I'm online~");
    }).catch((error) => {
      console.error(error);
    });
  }

  async onInstantMessage(event: InstantMessageEvent): Promise<void> {
    if (event.source === ChatSourceType.Agent) {
      if (!(event.flags & InstantMessageEventFlags.startTyping || event.flags & InstantMessageEventFlags.finishTyping)) {

        // sendInstantMessage will send it instantly
        await this.bot.clientCommands.comms.sendInstantMessage(event.from, 'This is a bot account and cannot respond.');
      }
    }
  }
}