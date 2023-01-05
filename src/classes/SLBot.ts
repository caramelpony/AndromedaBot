import { Bot, BotOptionFlags, LoginParameters } from "@caspertech/node-metaverse";

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
    await this.login();
  }

  /**
   * Login the bot.
   */
  protected async login() {

    this.bot.login().then((response) => {
      console.log("Login complete");
    }).then(() => {
      console.log("Connected");
    }).catch((error) => {
      console.error(error);
    });
  }
}