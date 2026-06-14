require("dotenv").config();

const { Client, GatewayIntentBits, Events } = require("discord.js");
const OpenAI = require("openai");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "ask") return;

  const question = interaction.options.getString("question", true);

  await interaction.deferReply();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: KANADE_SYSTEM_PROMPT },
        { role: "user", content: question },
      ],
    });

    const answer = completion.choices[0]?.message?.content ?? "（返答がありませんでした）";
    const reply = answer.length > 2000 ? answer.slice(0, 1997) + "..." : answer;

    await interaction.editReply(reply);
  } catch (error) {
    console.error(error);
    await interaction.editReply("エラーが発生しました。しばらくしてからもう一度お試しください。");
  }
});

client.login(process.env.DISCORD_TOKEN);
