## Andromeda SL Bot

### Needs

- Payments
- - One or more parties
- Scheduling
- - Sim Restart
- - Payments
- - Group Notices
- Moderation
- - Sim Bans
- - Sim Ejects

### TODO:

- Fix RegionStats.ts
- - LINE: 11, "Property 'currentRegion' does not exist on type '() => Bot'."

# Adding Commands

## Discord

1. Create a new `.ts` file in `discordbot/commands`. Feel free to copy the ping file as a template.
2. Follow [This guide here](https://discordjs.guide/creating-your-bot/slash-commands.html#before-you-continue)

## SL

1. Create a new `.ts` file in `slbot/commands` that extends the Command base class.

```js
import { InstantMessageEvent } from "@caspertech/node-metaverse";
import { Command } from "../classes/Command";

const CommandName = class extends Command {
  public execute(event: InstantMessageEvent, args: string[]): void {
    // Your code goes here
  }
}
module.exports = CommandName;
```

2. Write your code inside of the execute function. You may access the instant message through the `event` variable. You may access the service container with `this.getServiceContainer()`

# The service container

The service container provides relatively easy way to access each the Discord bot instance from the SLBot, and Visa Versa. It is injected to each Bot at application start and passed downward.

To access the Discord Bot instance from within a SLBot command, you can use:

```js
this.getServiceContainer().getDBot()?.getClient();
```

/// NOTE: I have not implemented the service container fully in the Discord commands.
