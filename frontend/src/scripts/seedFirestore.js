import { db } from "../lib/firebase.js";
import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

// 👤 Create user profile
async function seedUser(walletAddress) {
  const userRef = doc(db, "users", walletAddress);
  await setDoc(userRef, {
    name: "Dhruv Pancholi",
    bio: "Smart contract dev",
    skills: ["Solidity", "React", "Node.js"],
    isFreelancer: true,
    isClient: false,
    createdAt: serverTimestamp(),
  });
  console.log("✅ User created:", walletAddress);
}

// 🛠️ Create job post and return job ID
async function seedJob() {
  const jobRef = collection(db, "jobs");
  const docRef = await addDoc(jobRef, {
    title: "Create a token vesting contract",
    description: "We need a developer to build a token vesting system on EVM.",
    budget: 500,
    postedBy: "0x123abc...",
    status: "open",
    createdAt: serverTimestamp(),
  });
  console.log("✅ Job created:", docRef.id);
  return docRef.id; // 👈 RETURN THE ID
}

// ✉️ Send proposal using jobId
async function seedProposal(jobId) {
  if (!jobId) throw new Error("❌ jobId is undefined. Cannot create proposal.");
  const proposalRef = collection(db, "proposals");
  const docRef = await addDoc(proposalRef, {
    jobId,
    freelancer: "0x456def...",
    message: "I’ve done vesting contracts before, let's talk.",
    status: "pending",
    createdAt: serverTimestamp(),
  });
  console.log("✅ Proposal sent:", docRef.id);
}

// Run all seeding tasks
(async () => {
  try {
    await seedUser("0x123abc...");
    const jobId = await seedJob(); // ✅ get jobId
    await seedProposal(jobId);     // ✅ pass jobId to proposal
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
})();
