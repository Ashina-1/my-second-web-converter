// Simple Firestore rules tests using Firebase Emulator and @firebase/rules-unit-testing
// Run with: NODE_ENV=test node tests/firestore.rules.test.js

const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} = require("@firebase/rules-unit-testing");
const fs = require("fs");

(async () => {
  // Load rules from project file
  const rules = fs.readFileSync("firestore.rules", "utf8");

  const testEnv = await initializeTestEnvironment({
    projectId: "my-second-web-converter-test",
    firestore: { rules },
  });

  try {
    // Unauthenticated client
    const unauth = testEnv.unauthenticatedContext();
    const unauthDb = unauth.firestore();

    // Authenticated user A
    const alice = testEnv.authenticatedContext("alice-uid");
    const aliceDb = alice.firestore();

    // Authenticated user B
    const bob = testEnv.authenticatedContext("bob-uid");
    const bobDb = bob.firestore();

    // 1) Unauthenticated cannot create
    await assertFails(
      unauthDb.collection("fishinglogs").add({
        uid: "alice-uid",
        catch: {
          fish: "Aji",
          size: 30,
          location: "Harbor",
          date: "2025-10-21",
          imageUrl: "http://example",
          rod: "rod",
          reel: "reel",
          line: "line",
          lure: "lure",
          memo: "",
        },
      })
    );

    // 2) Alice can create with correct uid
    await assertSucceeds(
      aliceDb.collection("fishinglogs").add({
        uid: "alice-uid",
        catch: {
          fish: "Aji",
          size: 30,
          location: "Harbor",
          date: "2025-10-21",
          imageUrl: "http://example",
          rod: "rod",
          reel: "reel",
          line: "line",
          lure: "lure",
          memo: "",
        },
      })
    );

    // 3) Alice cannot create with someone else's uid
    await assertFails(
      aliceDb.collection("fishinglogs").add({
        uid: "bob-uid",
        catch: {
          fish: "Aji",
          size: 30,
          location: "Harbor",
          date: "2025-10-21",
          imageUrl: "http://example",
          rod: "rod",
          reel: "reel",
          line: "line",
          lure: "lure",
          memo: "",
        },
      })
    );

    // 4) Bob cannot read Alice's doc
    const snap = await aliceDb
      .collection("fishinglogs")
      .where("uid", "==", "alice-uid")
      .get();
    const docId = snap.docs[0].id;
    await assertFails(bobDb.doc(`fishinglogs/${docId}`).get());

    // 4.1) Alice adds Bob as a friend
    await assertSucceeds(
      aliceDb
        .doc(`users/alice-uid`)
        .set({ uid: "alice-uid", friends: ["bob-uid"] })
    );

    // Now Bob should be able to read Alice's fishinglog
    await assertSucceeds(bobDb.doc(`fishinglogs/${docId}`).get());

    // 5) Alice can read her doc
    await assertSucceeds(aliceDb.doc(`fishinglogs/${docId}`).get());

    console.log("All tests passed (rules smoke tests)");
  } catch (e) {
    console.error("Rules tests failed", e);
    process.exitCode = 1;
  } finally {
    await testEnv.cleanup();
  }
})();
