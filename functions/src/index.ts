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
      });

      transaction.update(receiverDoc.ref, {
        balance: receiverBalance + amount,
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
    const body = (request.body ?? {}) as GetMyPawBalanceRequestBody;

    const userId = toUserId(
      body.userRef ??
        body.userId ??
        body.uid ??
        request.query.userRef ??
        request.query.userId ??
        request.query.uid
    );

    console.log("getMyPawBalance received", {
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