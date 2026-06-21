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

Today I tested the Cloud Functions version of the “Send Thanks” feature.
Firebase authentication, Functions deployment, and API connectivity were verified successfully. The sendPaw API returned 200 Success, and Firestore balances changed from 950→900 and 1100→1150, confirming that Cloud Functions, Firestore, and the API are working correctly together.
However, in the actual app flow, Cloud Logging showed senderRef:null / receiverRef:null. This indicates that the issue is no longer in Cloud Functions, but most likely in the value passing process within FlutterFlow.
To reduce mental fatigue caused by reading long IDs, a new rule was established: use Google Lens to copy Firebase UIDs and Document IDs instead of reading them manually.
The issue was not fully resolved today, but the scope was narrowed significantly. Tomorrow’s goal is to use fixed-value testing to determine whether the problem is in P12 or in the page-to-page parameter passing process. 🐾🚀

Today I reviewed the FlutterFlow page structure and compared the current implementation with the original wireframe design.

First, I tested the Cloud Functions-based sendPaw system. The API test returned a successful 200 response, and balance updates were confirmed, proving that the backend logic is functioning correctly.

Next, I inspected pages P03 through P14 and reorganized my understanding of the project structure.

Key findings:

- P10 is the history screen.
- P11 is currently unused.
- P12 is the production backend “heart” powered by Cloud Functions.
- P09 was the original MVP “heart.”

By revisiting the archived wireframes, I was able to reconnect with the original design philosophy and user flow.

The original MVP flow was:

01 → 03 → SOS → 08 → 09 → 03

and the current direction is to replace the old P09 processing role with the new P12 backend-powered system.

Finally, the wireframe documents were archived in the “99 Storage” area. Future development will be guided by the original design documents while rebuilding the production user flow.

Today I worked on troubleshooting the balance display issue in P03_home.
Since the sendPaw Cloud Function has been successfully deployed, I moved on to restoring the balance display on the home screen.
I checked the Firestore collections (users and paw_balances), query settings, and variable bindings. I also performed a fixed-value test.
The fixed value "500" displayed correctly, which indicates that the UI itself is working and the issue is likely related to retrieving data from Firestore.
This reminded me that FlutterFlow often requires time-consuming investigation because many internal processes are hidden behind a visual interface.
I stopped work before fatigue became too severe and will continue tomorrow.
Tomorrow's goal is to investigate the P03_home query configuration and restore the balance display. 🐾


Today, I worked on improving the balance display on the P03_home screen of the Nekonote app.

The previous Firestore direct query caused the page to stay in an endless loading state. To solve this, I added a new Cloud Functions API called getMyPawBalance.

The API successfully returned the user’s balance in the terminal, and FlutterFlow’s API test also returned 200 Success.

The endless loading issue on P03_home has now been resolved.
The remaining task is to display the fetched balance value on the screen.

If FlutterFlow cannot handle the display binding smoothly, I will code only that small part as a custom solution.

Finally, I saved today’s Cloud Functions changes to GitHub.
After a push rejection, I ran git pull --rebase and successfully pushed the changes.

Result:
Cloud Functions works.
FlutterFlow API test works.
The loading issue is fixed.
Only the display binding remains.

Today’s Nekonote dev log:

We moved the Paw balance display on P03_home from FlutterFlow binding to a Custom Widget.

The widget now calls Cloud Functions, reads the Firestore paw_balances data, and reflects actual balance changes after P12/sendPaw.

Confirmed:
601 → 551 → 501

FlutterFlow handles UI.
Cloud Functions handles the Paw bank logic.
The MVP core is now connected.
