"use server";

import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../firebase-admin";
import liveBlocks from "@/lib/liveblocks";

export async function createNewDocument() {
  const { sessionClaims } = await auth.protect();

  try {
    if (!sessionClaims?.email) {
      throw new Error("User not authenticated");
    }

    // Create new document
    const docCollectionRef = adminDb.collection("documents");
    const docRef = await docCollectionRef.add({
      title: "New Doc",
      createdBy: sessionClaims.email,
      createdAt: new Date(),
    });

    // Ensure user document exists
    await adminDb
      .collection("users")
      .doc(sessionClaims.email)
      .collection("rooms")
      .doc(docRef.id)
      .set(
        {
          userId: sessionClaims?.email,
          role: "owner",
          createdAt: new Date(),
          roomId: docRef.id,
        },
        { merge: true }
      );
    return docRef.id;
  } catch (error) {
    console.error("Error creating document:", error);
    throw error; // Re-throw to allow caller to handle
  }
}

export async function deleteDocument(roomId: string) {
  auth.protect();
  console.log("delete document", roomId);

  try {
    //delete the document reference itself
    await adminDb.collection("documents").doc(roomId).delete();
    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch();

    //delete the room reference in users collection for every user in the room
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    //delete room inliveblocks
    await liveBlocks.deleteRoom(roomId);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function inviteCollaboratorToRoom(roomId: string, email: string) {
  auth.protect();
  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createAt: new Date(),
        roomId,
      });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function removeUserFromDocument(roomId: string, email: string) {
  auth.protect();
  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
