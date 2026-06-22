import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as admin from "firebase-admin";

setGlobalOptions({ maxInstances: 10 });

admin.initializeApp();

const db = admin.firestore();

interface SendPawRequestBody {
  senderRef?: string;
  receiverRef?: string;
  amount?: number | string;
}

interface GetMyPawBalanceRequestBody {
  userRef?: string;
  userId?: string;
  uid?: string;
}

interface EnsureUserPawWalletRequestBody {
  userRef?: string;
  userId?: string;
  uid?: string;
}

function toUserId(value: unknown): string {
  const raw = String((value as { path?: string })?.path ?? value ?? "").trim();

  if (!raw) {
    return "";
  }

  const cleaned = raw.replace(/^\/+/, "");
  const parts = cleaned.split("/");

  return parts[parts.length - 1] ?? "";
}

function setCors(response: any): void {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type");
}

function getTodayKey(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function getMonthKey(): string {
  const now = new Date();
  return now.toISOString().slice(0, 7);
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

async function findBalanceDocByUserId(targetUserId: string) {
  const balancesSnapshot = await db.collection("paw_balances").get();

  return balancesSnapshot.docs.find((doc) => {
    const data = doc.data();

    const candidates = [
      doc.id,
      data.user_id,
      data.user_ref,
      data.user_ref?.path,
    ].map(toUserId);

    return candidates.includes(targetUserId);
  });
}

function getUserIdFromRequest(request: any): string {
  const body = (request.body ?? {}) as GetMyPawBalanceRequestBody;

  return toUserId(
    body.userRef ??
      body.userId ??
      body.uid ??
      request.query.userRef ??
      request.query.userId ??
      request.query.uid
  );
}

export const ensureUserPawWallet = onRequest(async (request, response) => {
  setCors(response);

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  try {
    const body = (request.body ?? {}) as EnsureUserPawWalletRequestBody;

    const userId = toUserId(
      body.userRef ??
        body.userId ??
        body.uid ??
        request.query.userRef ??
        request.query.userId ??
        request.query.uid
    );

    console.log("ensureUserPawWallet received", {
      body,
      query: request.query,
      userId,
    });

    if (!userId) {
      response.status(400).json({
        success: false,
        error: "userRef, userId, or uid is required",
        balance: 0,
      });
      return;
    }

    const todayKey = getTodayKey();
    const monthKey = getMonthKey();
    const issuedAt = new Date();

    const balanceDoc = await findBalanceDocByUserId(userId);
    const balanceRef = balanceDoc
      ? balanceDoc.ref
      : db.collection("paw_balances").doc(userId);

    const dailyLedgerRef = db
      .collection("paw_ledger")
      .doc(`${userId}_thanks_daily_${todayKey}`);

    const monthlyLedgerRef = db
      .collection("paw_ledger")
      .doc(`${userId}_basic_monthly_${monthKey}`);

    let createdBalance = false;
    let mintedThanks = 0;
    let mintedBasic = 0;
    let finalBalance = 0;

    await db.runTransaction(async (transaction) => {
      const balanceSnap = await transaction.get(balanceRef);
      const dailyLedgerSnap = await transaction.get(dailyLedgerRef);
      const monthlyLedgerSnap = await transaction.get(monthlyLedgerRef);

      let currentBalance = 0;

      if (balanceSnap.exists) {
        currentBalance = Number(balanceSnap.get("balance") ?? 0);
      } else {
        createdBalance = true;

        transaction.set(balanceRef, {
          user_id: userId,
          user_ref: db.doc("users/" + userId),
          balance: 0,
          created_at: admin.firestore.FieldValue.serverTimestamp(),
          updated_at: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      if (!dailyLedgerSnap.exists) {
        mintedThanks = 50;
        currentBalance += mintedThanks;

        transaction.set(dailyLedgerRef, {
          user_id: userId,
          user_ref: db.doc("users/" + userId),
          wallet_type: "thanks",
          reason: "daily_grant",
          amount: 50,
          grant_date: todayKey,
          issued_at: admin.firestore.Timestamp.fromDate(issuedAt),
          expires_at: admin.firestore.Timestamp.fromDate(
            new Date(issuedAt.getTime() + 24 * 60 * 60 * 1000)
          ),
          created_at: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      if (!monthlyLedgerSnap.exists) {
        mintedBasic = 300;
        currentBalance += mintedBasic;

        transaction.set(monthlyLedgerRef, {
          user_id: userId,
          user_ref: db.doc("users/" + userId),
          wallet_type: "basic",
          reason: "monthly_grant",
          amount: 300,
          grant_month: monthKey,
          issued_at: admin.firestore.Timestamp.fromDate(issuedAt),
          expires_at: admin.firestore.Timestamp.fromDate(addMonths(issuedAt, 5)),
          created_at: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      transaction.set(
        balanceRef,
        {
          user_id: userId,
          user_ref: db.doc("users/" + userId),
          balance: currentBalance,
          updated_at: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      finalBalance = currentBalance;
    });

    response.status(200).json({
      success: true,
      userId,
      createdBalance,
      mintedThanks,
      mintedBasic,
      balance: finalBalance,
      todayKey,
      monthKey,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    console.error("ensureUserPawWallet error", {
      message,
    });

    response.status(400).json({
      success: false,
      error: message,
      balance: 0,
    });
  }
});

export const sendPaw = onRequest(async (request, response) => {
  setCors(response);

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  try {
    const body = (request.body ?? {}) as SendPawRequestBody;

    const senderId = toUserId(body.senderRef);
    const receiverId = toUserId(body.receiverRef);
    const amount = Number(body.amount);

    console.log("sendPaw received", {
      senderRef: body.senderRef,
      receiverRef: body.receiverRef,
      senderId,
      receiverId,
      amount,
    });

    if (!senderId || !receiverId || !Number.isFinite(amount)) {
      response.status(400).json({
        success: false,
        error: "senderRef, receiverRef, and amount are required",
      });
      return;
    }

    await db.runTransaction(async (transaction) => {
      const balancesSnapshot = await transaction.get(
        db.collection("paw_balances")
      );

      const findBalanceDoc = (targetUserId: string) => {
        return balancesSnapshot.docs.find((doc) => {
          const data = doc.data();

          const candidates = [
            doc.id,
            data.user_id,
            data.user_ref,
            data.user_ref?.path,
          ].map(toUserId);

          return candidates.includes(targetUserId);
        });
      };

      const senderDoc = findBalanceDoc(senderId);
      const receiverDoc = findBalanceDoc(receiverId);

      if (!senderDoc) {
        throw new Error("sender balance not found: " + senderId);
      }

      if (!receiverDoc) {
        throw new Error("receiver balance not found: " + receiverId);
      }

      const senderBalance = Number(senderDoc.get("balance") ?? 0);
      const receiverBalance = Number(receiverDoc.get("balance") ?? 0);

      if (senderBalance < amount) {
        throw new Error("insufficient balance");
      }

      transaction.update(senderDoc.ref, {
        balance: senderBalance - amount,
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      transaction.update(receiverDoc.ref, {
        balance: receiverBalance + amount,
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      const transactionRef = db.collection("paw_transactions").doc();

      transaction.set(transactionRef, {
        sender_id: senderId,
        receiver_id: receiverId,
        sender_ref: db.doc("users/" + senderId),
        receiver_ref: db.doc("users/" + receiverId),
        type: "thanks",
        typeLabel: "ありがとうPaw",
        amount,
        status: "completed",
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    response.status(200).json({
      success: true,
      message: "sendPaw completed",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    console.error("sendPaw error", {
      message,
    });

    response.status(400).json({
      success: false,
      error: message,
    });
  }
});

export const getMyPawBalance = onRequest(async (request, response) => {
  setCors(response);

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  try {
    const userId = getUserIdFromRequest(request);

    console.log("getMyPawBalance received", {
      body: request.body,
      query: request.query,
      userId,
    });

    if (!userId) {
      response.status(400).json({
        success: false,
        error: "userRef, userId, or uid is required",
        balance: 0,
      });
      return;
    }

    const balanceDoc = await findBalanceDocByUserId(userId);

    if (!balanceDoc) {
      response.status(404).json({
        success: false,
        error: "balance not found: " + userId,
        balance: 0,
      });
      return;
    }

    const balance = Number(balanceDoc.get("balance") ?? 0);

    response.status(200).json({
      success: true,
      userId,
      balance,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    console.error("getMyPawBalance error", {
      message,
    });

    response.status(400).json({
      success: false,
      error: message,
      balance: 0,
    });
  }
});