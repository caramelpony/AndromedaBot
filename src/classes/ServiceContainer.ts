import { DiscordBot } from "../discordbot/DiscordBot";
import { SLBot } from "../slbot/SLBot";

/**
 * App container class.
 * This class should be injected into services to allow basic levels of cross communication.
 */
export class ServiceContainer {
  protected slBot!: SLBot;
  protected discordBot!: DiscordBot;

  /**
   * Set the SL bot instance
   * @param {SLBot} discordBot Discord Bot instance
   * @returns
   */
  public setSlBot(slBot: SLBot) {
    if (this.slBot != undefined) {
      throw new Error("SL Bot can not be redefined");
    }
    this.slBot = slBot;
  }
  /**
   * Set the Discord bot instance
   * @param {DiscordBot} discordBot Discord Bot instance
   * @returns
   */
  public setDiscordBot(discordBot: DiscordBot) {
    if (this.discordBot != undefined) {
      throw new Error("SL Bot can not be redefined");
    }
    this.discordBot = discordBot;
  }

  /**
   * Returns the SLBot Instance
   * @returns {SLBot}
   */
  public getSlBot() {
    if (this.slBot == undefined) {
      throw new Error("SL Bot was not defined");
    }
    return this.slBot;
  }

  /**
   * Returns the DiscordBot Instance.
   * @returns @returns {DiscordBot}
   */
  public getDBot() {
    if (this.discordBot == undefined) {
      throw new Error("SL Bot was not defined");
    }
    return this.discordBot;
  }
}