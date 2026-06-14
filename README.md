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

【English Version】

Today I continued working on the Cloud Functions implementation for the Paw transfer feature (sendPaw).

I fixed several TypeScript errors and updated references from senderUserRefDoc and receiverUserRefDoc to the new structure using senderUserRefPath and receiverUserRefPath.

After troubleshooting multiple issues one by one, I successfully reduced the Problems panel to zero errors. The code itself is now in a stable state.

When attempting deployment, a Firebase CLI authentication error occurred. Through troubleshooting, I confirmed that the issue is related to Firebase authentication rather than the code.

To avoid mental fatigue, I decided to stop at a good checkpoint and continue later.

Today's achievements:

- sendPaw code updated
- TypeScript errors resolved
- Problems panel reduced to zero
- Authentication issue isolated

A small but meaningful win toward the next step.

### Development Log – 2026/06/13

Today I continued investigating the sendPaw Cloud Function issue.

Although the test still returned the error:

"sender balance not found"

the investigation actually made significant progress.

The request successfully traveled through the entire chain:

FlutterFlow
→ API Call
→ Cloud Functions
→ sendPaw execution
→ Error response

This confirms that the network connection, API endpoint, and Cloud Function deployment are all working correctly.

The problem is now isolated to the internal logic of sendPaw, specifically around how senderRef is matched against Firestore data.

To narrow down the cause, I added debug code and continued tracing the comparison between senderRef and user_ref.

During the investigation, I also discovered that Firebase CLI authentication had expired.

Attempts to retrieve Cloud Functions logs resulted in an authentication error, and re-authentication failed with a Firebase CLI Login Failed message.

While this may look like a setback, it was actually an important discovery. Without working log access, deeper debugging would have been impossible.

Key achievements today:

- Cloud Function deployment successful
- API endpoint confirmed operational
- Error source narrowed down significantly
- Debug logging added
- npm build environment verified
- Firebase CLI authentication issue identified

For the next session:

1. Re-authenticate Firebase CLI
2. Restore Cloud Functions log access
3. Verify debug output
4. Consider replacing DocumentReference matching with a simpler user_id string-based approach

Today's biggest success was not fixing the bug.

It was successfully narrowing the problem space while avoiding unnecessary burnout.

Small wins. Safe progress. One step at a time.

Deploy complete. 🚀🐾

Development Log – 2026/06/14
Today I worked on the core backend function of Nekonote, the Cloud Function called sendPaw.
After spending many hours troubleshooting the "sender balance not found" error, I revised the Firestore reference handling and switched to a string-path based approach for user_ref.
As a result, the API test succeeded.
Firestore balances were successfully updated, confirming that the sendPaw backend logic is working correctly.
I also successfully created a Git commit:
sendPaw deployed and API test success
However, pushing to GitHub is currently blocked by a remote synchronization issue and will be resolved later.
The FlutterFlow end-to-end test still failed to update balances, suggesting that the remaining issue is likely in the P12 Action configuration or API parameter mapping rather than in the backend itself.
Next step: investigate P12 Actions and API wiring.
Today was difficult, but it was a major milestone—the heart of Nekonote is finally beating. 🐾🚀
