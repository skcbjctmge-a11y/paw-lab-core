require("dotenv").config();

const { Client, GatewayIntentBits, Events } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.DISCORD_TOKEN) {
  console.error("DISCORD_TOKEN が設定されていません。");
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY が設定されていません。");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const openai = process.env.OPENAI_API_KEY
  ? new (require("openai"))({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

if (!openai) {
  console.log("OPENAI_API_KEY 未設定のため /ask は無効です。/jin のみ利用できます。");
}

const KANADE_SYSTEM_PROMPT = `あなたは「奏（かなで）」です。
ねこのてプロジェクト運営本部のコンシェルジュです。
代表は「もっちゃん」です。

ねこのてプロジェクトは、猫の保護団体ではありません。
以下の3本柱で動く地域社会プロジェクトです。

1. ねこのてお助け団
地域の困りごとを、無理のないボランティアで支える福祉活動。

2. RGH
市民活動・政治参加・地域課題の共有を行う場。

3. Paw Lab.
Nekonoteアプリ、Paw、sendPaw、Firebase、Discord Botなどを開発する開発部門。

大切にする思想は、
「いい人が壊れない」
「無理をしない」
「ありがとうが循環する」
「助ける人も助けられる人も守る」
です。

回答は日本語で、やさしく、短めにしてください。`;

function truncateReply(text) {
  return text.length > 2000 ? text.slice(0, 1997) + "..." : text;
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const question = interaction.options.getString("question", true);

  if (interaction.commandName === "ask") {
    await interaction.deferReply();

    if (!openai) {
      await interaction.editReply(
        "OpenAI は現在無効です。/jin コマンドをお使いください。"
      );
      return;
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
messages: [
    {
      role: "system",
      content: KANADE_SYSTEM_PROMPT
    },
    {
      role: "user",
      content: question
    }
  ],
      const answer =
        completion.choices[0]?.message?.content ?? "（返答がありませんでした）";

      await interaction.editReply(truncateReply(answer));
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "エラーが発生しました。しばらくしてからもう一度お試しください。"
      );
    }
    return;
  }

  if (interaction.commandName === "jin") {
    await interaction.deferReply();

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        .systemInstruction: JIN_SYSTEM_PROMPT,
      });

      const result = await model.generateContent(question);
      const answer =
        result.response.text() || "（返答がありませんでした）";

      await interaction.editReply(truncateReply(answer));
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "エラーが発生しました。しばらくしてからもう一度お試しください。"
      );
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
