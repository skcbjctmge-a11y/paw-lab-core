/**
 * Legacy unauthenticated HTTP Paw handlers (sendPaw, getMyPawBalance,
 * ensureUserPawWallet) were removed from Firebase project nekonote-ulcy3b
 * on 2026-10-30. Active Nekonote PWA uses nekonote-production callables
 * (asia-northeast1) and Firestore rules — not this codebase.
 *
 * Do not redeploy unauthenticated Paw HTTP endpoints to production.
 */
import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({ maxInstances: 10 });
