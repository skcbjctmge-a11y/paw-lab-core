# Security

## Production Firebase (nekonote-ulcy3b)

As of 2026-10-30, legacy **unauthenticated HTTP** Cloud Functions for Paw
(`sendPaw`, `getMyPawBalance`, `ensureUserPawWallet`) were **deleted** from
production. They are not used by the current Nekonote PWA.

Active server logic for Nekonote lives in the private **nekonote-production**
repository (callable functions in `asia-northeast1`).

## This repository

- Do **not** commit `.env`, service account JSON, or deploy snapshots such as
  `functions-list.json`.
- Do **not** reintroduce unauthenticated Paw transfer HTTP endpoints.

Report security concerns via the account owner's usual contact channels.
