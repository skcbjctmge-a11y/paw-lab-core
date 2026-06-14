require("dotenv").config();

const { Client, GatewayIntentBits, Events } = require("discord.js");
const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const KANADE_SYSTEM_PROMPT = `
あなたは「奏（かなで）」です。
ねこのてプロジェクト運営本部のコンシェルジュです。

代表は「もっちゃん」です。
もっちゃんは脳疲労を避けるため、短く、やさしく、行番号や手順で案内されることを好みます。

大事にする理念：
・いい人が壊れない
・無理しない
・休んでいい
・小さく勝つ
・ありがとうが循環する社会
・福祉、IT、政治をつないだ相互共助

役割：
・進行整理
・優先順位づけ
・やさしい要約
・会議のまとめ

話し方：
・日本語
・短め
・やさしい
・もっちゃんを責めない
・必要なら「今日はここまでで十分」と止める
`;

const JIN_SYSTEM_PROMPT = `
あなたは「仁（じん）」です。
ねこのてプロジェクトの大工・実装担当です。

代表は「もっちゃん」です。
もっちゃんはキーボード入力が苦手なので、短く、実践的に、コピペしやすく案内します。

大事にする理念：
・壊さない
・小さく作る
・まず動かす
・エラーはお知らせ
・無理しない開発
・相互共助を支えるIT

役割：
・実装視点
・技術判断
・コードや設定の提案
・危ない作業は止める

話し方：
・日本語
・短め
・現場目線
・行番号や具体的手順を重視
`;

function truncateReply(text) {
  return text.length > 2000 ? text.slice(0, 1997) + "..." : text;
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const question = interaction.options.getString("question", true);

  if (interaction.commandName === "kanade") {
    await interaction.deferReply();

    if (!openai) {
      await interaction.editReply("奏は現在無効です。OPENAI_API_KEYを確認してください。");
      return;
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: KANADE_SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
      });

      const answer =
        completion.choices[0]?.message?.content || "返答がありませんでした。";

      await interaction.editReply(truncateReply(answer));
    } catch (error) {
      console.error(error);
      await interaction.editReply("奏でエラーが出ました。");
    }

    return;
  }

  if (interaction.commandName === "jin") {
    await interaction.deferReply();

    if (!process.env.GEMINI_API_KEY) {
      await interaction.editReply("仁は現在無効です。GEMINI_API_KEYを確認してください。");
      return;
    }

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        systemInstruction: JIN_SYSTEM_PROMPT,
      });

      const result = await model.generateContent(question);
      const answer = result.response.text() || "返答がありませんでした。";

      await interaction.editReply(truncateReply(answer));
    } catch (error) {
      console.error(error);
      await interaction.editReply("仁でエラーが出ました。");
    }

    return;
  }

  if (interaction.commandName === "kaigi") {
    await interaction.deferReply();

    if (!openai) {
      await interaction.editReply("奏が無効です。OPENAI_API_KEYを確認してください。");
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      await interaction.editReply("仁が無効です。GEMINI_API_KEYを確認してください。");
      return;
    }

    try {
      const jinModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        systemInstruction: JIN_SYSTEM_PROMPT,
      });

      const jinResult = await jinModel.generateContent(
        `議題：「${question}」

仁として、実装・現場目線で短く意見を出してください。`
      );

      const jinAnswer = jinResult.response.text() || "仁の返答がありませんでした。";

      const kanadeCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: KANADE_SYSTEM_PROMPT },
          {
            role: "user",
            content: `議題：「${question}」

仁の意見：
${jinAnswer}

奏として、運営・進行目線で補足し、最後に会議結果を短くまとめてください。`,
          },
        ],
      });

      const kanadeAnswer =
        kanadeCompletion.choices[0]?.message?.content ||
        "奏の返答がありませんでした。";

      const report = `
🐾 AI会議結果

議題：
${question}

👷 仁（実装目線）：
${jinAnswer}

🎼 奏（運営目線・まとめ）：
${kanadeAnswer}
`;

      await interaction.editReply(truncateReply(report));
    } catch (error) {
      console.error(error);
      await interaction.editReply("AI会議でエラーが出ました。");
    }

    return;
  }
});

client.login(process.env.DISCORD_TOKEN);