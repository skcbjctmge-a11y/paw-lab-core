import * as functions from "firebase-functions";

export const helloWorld = functions.https.onRequest(
  (request, response) => {
    response.send("Nekonote Paw Lab. 起動成功 🐾");
  }
);