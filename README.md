# Paw Lab. Core

ありがとうの循環を支える社会OS開発プロジェクト。

## 概要
Paw Lab. は、
「無理しない」「壊れない」「優しさが循環する」
をテーマにした地域助け合いアプリ
『ねこのて』を開発しています。

## プロジェクト構造
- Discord = 神経網
- GitHub = 記憶
- Firebase = 心臓
- FlutterFlow = 玄関
- Cursor = 工房

## チーム
- もっちゃん = 監督
- 奏 = コンシェルジュ
- 仁 = 大工
- 蓮 = 設計士
- ネコリ = 工房職人

## 開発思想
- 無理しない
- 小さく勝つ
- 壊れても戻れる
- AIと共に育てる

### 思想的土台（監督メモ）
人間の複雑さを前提にした Paw 設計の根底。[もっちゃん人間観・Paw設計思想](docs/philosophy/motchyan-human-view-and-paw-design.md)  
工房（ネコリ）向け: [AGENTS.md](AGENTS.md)

## 現在開発中
- Paw循環設計
- Discord神経網
- Firebase Functions
- PWA化
- GitHub連携

## 合言葉
「ありがとうの循環を川口から」
Webhook Test
test
!
Webhook Test 2
Webhook Test 3

🐾 Nekonote Development Log

A big step forward today!

✅ Jin (Gemini) Bot is working
✅ Kanade (ChatGPT) Bot is working
✅ GitHub notifications are working
✅ Firebase notifications are working
✅ Discord headquarters logging system is now active

The most exciting moment was seeing Jin and Kanade actually respond inside Discord.

Our next goal is implementing the AI meeting room:

/kaigi

Jin will provide implementation-focused opinions, Kanade will provide operational and user-focused opinions, and the final conclusion will be posted to #ai-reports.

We are not aiming for perfection from day one.

Small wins, one step at a time. 🐾

#Nekonote
#PawLab
#DiscordBot
#Gemini
#ChatGPT
#Firebase
#GitHub
#AIDevelopment

Today was a big win for development! 😊
The day started with a crisis: both Jin and Kanade bots stopped working.
After fighting through SyntaxErrors and debugging issues, I discovered something important: for me, replacing entire code blocks causes far less brain fatigue than making small line-by-line edits.
Later, both Jin Bot and Kanade Bot were successfully restored, and the AI meeting system was brought back online.
The funniest moment came when I asked the AI team to evaluate my strengths and weaknesses.
Jin responded from an implementation perspective, while Kanade summarized everything from an operations perspective and concluded with:
"That's enough for today."
That made me laugh 😂
Today felt like the day the AI team truly came to life.
Step by step, the Nekonote Project Headquarters is becoming reality 🐾.

【English Version】
Today's development session ended with a planned stop due to brain fatigue, but progress was significant.
✅ Restored P12_matching ✅ Connected sendPaw API ✅ Configured senderRef ✅ Configured receiverRef ✅ Set amount = 50 ✅ Resolved API-not-found errors ✅ Removed GeminiTest leftovers ✅ Confirmed P03_home is alive ✅ Confirmed P10_history is alive
Most importantly, the mysterious error is no longer mysterious.
P12_matching requires a parameter called "selectedReceiver".
The issue was not that the system was broken. The receiver information simply wasn't being passed.
In development, understanding the cause is often more important than fixing it immediately.
Next session:
P11_select_receiver → Pass selectedReceiver → P12_matching → Execute sendPaw
The heart of P12 is getting very close to its first real heartbeat. 🐾💓
#Nekonote #PawLab #FlutterFlow #Firebase #AIDevelopment #SmallWinsEveryDay

English Version
Today I worked on debugging the Cloud Functions version of the Paw transfer system.
The communication flow between FlutterFlow, Cloud Functions, and Firestore is working correctly, and deployment was completed successfully.
The issue has now been narrowed down to the sender balance lookup process, with the error identified as:
"sender balance not found"
Although the feature is not fully working yet, the source of the problem has become much clearer.
Since mental fatigue started to build up, I decided to stop for the day and continue later.
Following the Nekonote philosophy: "Don't push too hard. Win in small steps." 🐾
#PawLab #Nekonote #FlutterFlow #Firebase #CloudFunctions #IndieDev #BuildInPublic
