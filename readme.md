# 🤖 Eval Discord Robot 🤖

This is the submission of [@randomlylelo](https://repl.it/@randomlylelo), [@ApoorvSingal](https://repl.it/@ApoorvSingal/), [@a5rocks](https://repl.it/@a5rocks) to the Massively Multiplayer Hackathon!
The repl: https://repl.it/@ApoorvSingal/MMH

### Why did you make a discord bot?
> Developing something for the theme: 'sharing' was quite difficult and our team had ran through multiple ideas before setting on making a discord bot.
> Our team's thought process was to think of things that are related to sharing but also something that is creative, thoughtful, and could be done in a two day time span.
> Because our team wasn't created by amasad (we created ourselves in the discord channel #mmh), we had to figure out many things.
> We first ran through our strengths and weaknesses and what coding languages we know, in order to obtain maximum efficency.
> We had plans to create an image sharing platform, an account sharing platform, and even an code sharing platform! But we couldn't do them because they would have taken to long.
> So we settled on a discord bot because it fit our requirements.

### So what does your bot do?
> Good question! Currently our bot has commands that allow the user to evaluate code in javascript, python, c-plus-plus, csharp, f#, ruby, rust, swift, c, shell script (sh), 
> With the bot, you can save the code and share it.

### How does the bot work?
> The bot uses [crosis](https://github.com/replit/crosis) to speak to the repl.it API

### What are some bot commands?
> The prefix is `~`
> The current commands are 
> `eval <optional-name> [```code```]` Evaluates code that you input in [\`\`\`code\`\`\`], and saves it if you have something in <optional-name>.
> `help <optional-command>` Help prompt to show what each command does.
> `share [name-of-previously-saved-eval]` Finds a previously saved eval and prints it.
> `list` List all the saved evals
> `del [name-of-previously-saved-eval]` Deletes a saved eval.

### Future Plans
> [ ] Allow users to upload their own images and save them so they could easily share
> [ ] Allow users to upload their own code and save them so they could easily share

### Known Issues
> If your entered code does not produce any output, the output will remain `Please wait...`, even if the code has executed successfully

___
Also note that if you are using the bot, it shares same environment, same files, everything is evaled in one place with no security.
Meaning, that everyone using the bot could see everything, thus nothing is secrete! Due to the fact that everyone has access to the repl.

Join the demo bot server:
https://discord.gg/Yfe4rHj

Add the bot to your server:
[Invite!](https://discordapp.com/api/oauth2/authorize?client_id=650360931607511051&permissions=0&scope=bot)
