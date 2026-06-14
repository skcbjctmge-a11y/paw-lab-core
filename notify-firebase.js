require("dotenv").config();

const webhookUrl = process.env.DISCORD_FIREBASE_WEBHOOK_URL;

if (!webhookUrl) {
  console.error("DISCORD_FIREBASE_WEBHOOK_URL が .env にありません。");
  process.exit(1);
}

async function main() {
  const body = {
    content: "🔥 Firebase deploy complete! sendPaw / Functions のデプロイが完了しました。"
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("Discord通知に失敗:", res.status, await res.text());
    process.exit(1);
  }

  console.log("Discord firebase-log へ通知しました。");
}

main();