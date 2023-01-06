import { Bot, InstantMessageEvent } from "@caspertech/node-metaverse";
import { ServiceContainer } from "../../classes/ServiceContainer";

/**
 * Base class for all SL bot commands.
 */
export abstract class Command {
  protected slBot: Bot; // This is the SLBot, NOT the discord bot.
  protected serviceContainer: ServiceContainer;

  constructor(slBot: Bot, serviceContainer: ServiceContainer) {
    this.slBot = slBot;
    this.serviceContainer = serviceContainer;
  }

  /**
   *
   * @returns {string} The name of this command
   */
  public getName(): string {
    return this.constructor.name.toLowerCase();
  }

  /**
   * Executes the command.
   */
  public abstract execute(event: InstantMessageEvent, args: string[]): void;

  /**
   * Get the SL bot.
   */
  protected getSlBot() {
    return this.slBot;
  }

  /**
   * Get the service container.
   */
  protected getServiceContainer() {
    return this.serviceContainer;
  }
}