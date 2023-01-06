import { InstantMessageEvent } from "@caspertech/node-metaverse";
import { Command } from "../classes/Command";

const Sit = class extends Command {
  protected sitting: boolean = false;

  public execute(event: InstantMessageEvent, args: string[]): void {

    if (this.sitting) {
      this.getSlBot().clientCommands.movement.stand();
      this.getSlBot().clientCommands.comms.sendInstantMessage(event.from, 'Standing up...');
      this.sitting = false;
    } else {
      this.getSlBot().clientCommands.movement.sitOnGround();
      this.getSlBot().clientCommands.comms.sendInstantMessage(event.from, 'Sitting down...');
      this.sitting = true;
    }

  }
}
module.exports = Sit;