import { InstantMessageEvent } from "@caspertech/node-metaverse";
import { Command } from "../classes/Command";

const Ping = class extends Command {
  public execute(event: InstantMessageEvent, args: string[]): void {
    this.getSlBot().clientCommands.comms.sendInstantMessage(event.from, 'Pong!');
  }
}
module.exports = Ping;