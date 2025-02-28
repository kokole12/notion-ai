import liveBlocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { adminDb } from "../../../firebase-admin";

export async function POST(req: NextRequest) {
  auth.protect();
  try {
    const { sessionClaims } = await auth();

    if (!sessionClaims?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse and validate room from request body
    const body = await req.json();
    const { room } = body;

    if (!room) {
      return new Response("Room parameter is required and must be a string", {
        status: 400,
      });
    }

    // Create Liveblocks session with user info
    const session = liveBlocks.prepareSession(sessionClaims.email, {
      userInfo: {
        name: sessionClaims.fullName ?? "Anonymous",
        email: sessionClaims.email,
        avatar: sessionClaims.image ?? "/default-avatar.png",
      },
    });

    // Check if user has access to the room
    const usersInRoom = await adminDb
      .collectionGroup("rooms")
      .where("userId", "==", sessionClaims.email)
      .get();

    const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

    if (!userInRoom?.exists) {
      return new Response("Access denied to room", { status: 403 });
    }

    // Grant access and authorize session
    session.allow(room, session.FULL_ACCESS);
    const { body: responseBody, status } = await session.authorize();
    return new Response(responseBody, { status });
  } catch (error) {
    console.error("Error in Liveblocks auth route:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
