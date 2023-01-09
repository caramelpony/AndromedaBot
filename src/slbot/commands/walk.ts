import { ControlFlags, InstantMessageEvent } from "@caspertech/node-metaverse";
import { Command } from "../classes/Command";

const Walk = class extends Command {
  protected sitting: boolean = false;

  public execute(event: InstantMessageEvent, args: string[]): void {

    // This is not ideal. It very much breaks all the time.
    const moveDuration = Math.min(100, Math.max(4, parseInt(args[1]))) * 100;

    switch (args[0]) {
      case 'forward':
        this.getSlBot().agent.setControlFlag(ControlFlags.AGENT_CONTROL_AT_POS);
        setTimeout(() => {
          this.getSlBot().agent.clearControlFlag(ControlFlags.AGENT_CONTROL_AT_POS);
        }, moveDuration);
        break;
      case 'right':
        this.getSlBot().agent.setControlFlag(ControlFlags.AGENT_CONTROL_LEFT_NEG);
        setTimeout(() => {
          this.getSlBot().agent.clearControlFlag(ControlFlags.AGENT_CONTROL_LEFT_NEG);
        }, moveDuration);
        break;
      case 'back':
        this.getSlBot().agent.setControlFlag(ControlFlags.AGENT_CONTROL_AT_NEG);
        setTimeout(() => {
          this.getSlBot().agent.clearControlFlag(ControlFlags.AGENT_CONTROL_AT_NEG);
        }, moveDuration);
        break;
      case 'left':
        this.getSlBot().agent.setControlFlag(ControlFlags.AGENT_CONTROL_LEFT_POS);
        setTimeout(() => {
          this.getSlBot().agent.clearControlFlag(ControlFlags.AGENT_CONTROL_LEFT_POS);
        }, moveDuration);
        break;
      default:
        this.getSlBot().clientCommands.comms.sendInstantMessage(event.from, "Invalid use of the command");
        break;
    }

  }
}
module.exports = Walk;