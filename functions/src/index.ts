import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as admin from "firebase-admin";

setGlobalOptions({ maxInstances: 10 });

admin.initializeApp();

const db = admin.firestore();

interface SendPawRequestBody {
  senderRef?: string;
  receiverRef?: string;
  amount?: number;
}

export const sendPaw = onRequest(async (request, response) => {
  try {
    const body = (request.body ?? {}) as SendPawRequestBody;
    const { senderRef, receiverRef, amount } = body;

    if (!senderRef || !receiverRef || amount === undefined) {
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

      const senderDoc = balancesSnapshot.docs.find((doc) => {
        const data = doc.data();
        const userRefPath = String(data.user_ref?.path ?? data.user_ref);
        return (
          data.user_id === senderRef ||
          doc.id === senderRef ||
          userRefPath.endsWith("/" + senderRef)
        );
      });

      const receiverDoc = balancesSnapshot.docs.find((doc) => {
        const data = doc.data();
        const userRefPath = String(data.user_ref?.path ?? data.user_ref);
        return (
          data.user_id === receiverRef ||
          doc.id === receiverRef ||
          userRefPath.endsWith("/" + receiverRef)
        );
      });

      if (!senderDoc) {
        throw new Error("sender balance not found: " + senderRef);
      }

      if (!receiverDoc) {
        throw new Error("receiver balance not found: " + receiverRef);
      }

      const senderBalance = senderDoc.get("balance") ?? 0;
      const receiverBalance = receiverDoc.get("balance") ?? 0;

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
        sender_id: senderRef,
        receiver_id: receiverRef,
        sender_ref: "users/" + senderRef,
        receiver_ref: "users/" + receiverRef,
        type: "thanks",
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
    const message =
      error instanceof Error ? error.message : "unknown error";

    response.status(400).json({
      success: false,
      error: message,
    });
  }
});