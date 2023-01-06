import { DiscordBot } from "../discordbot/DiscordBot";
import { SLBot } from "../slbot/SLBot";

/**
 * App container class.
 * This class should be injected into services to allow basic levels of cross communication.
 */
export class ServiceContainer {
  protected slBot?: SLBot;
  protected discordBot?: DiscordBot;

  /**
   * Set the SL bot instance
   * @param {SLBot} discordBot Discord Bot instance
   * @returns
   */
  public setSlBot(slBot: SLBot) {
    this.slBot = slBot;
  }
  /**
   * Set the Discord bot instance
   * @param {DiscordBot} discordBot Discord Bot instance
   * @returns
   */
  public setDiscordBot(discordBot: DiscordBot) {
    this.discordBot = discordBot;
  }

  /**
   * Returns the SLBot Instance
   * @returns {SLBot}
   */
  public getSlBot() {
    return this.slBot;
  }

  /**
   * Returns the DiscordBot Instance.
   * @returns @returns {DiscordBot}
   */
  public getDBot() {
    return this.discordBot;
  }
}