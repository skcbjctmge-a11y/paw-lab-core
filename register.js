require("dotenv").config();

const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("kanade")
    .setDescription("奏（かなで）に相談します")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("奏に聞きたいこと")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("jin")
    .setDescription("仁（じん）に相談します")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("仁に聞きたいこと")
        .setRequired(true)
    ),
    new SlashCommandBuilder()
  .setName("kaigi")
  .setDescription("仁と奏が会議します")
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("議題")
      .setRequired(true)
  ),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

async function main() {
  try {
    console.log("スラッシュコマンドを登録します...");

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log("登録完了: /kanade /jin");
  } catch (error) {
    console.error(error);
  }
}

main();