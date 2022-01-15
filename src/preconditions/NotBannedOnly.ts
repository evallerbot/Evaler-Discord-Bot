import { Precondition } from "@sapphire/framework";
import type { Message } from "discord.js";
import User from "../lib/user";

export class NotBannedOnlyPrecondition extends Precondition {
  public async run(message: Message) {
    const user = await User.from(message.author.id);

    if(!user.isBanned()){
      return this.ok();
    }
    return this.error({ message: "You're banned from using this command" });
  }
}

declare module '@sapphire/framework' {
	interface Preconditions {
		NotBannedOnly: never;
	}
}
