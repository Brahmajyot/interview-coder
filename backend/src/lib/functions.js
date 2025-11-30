import { Inngest } from "inngest";
import { connectDB } from "./db";
import User from "../models/User";
import { streamClient } from "./stream";

export const inngest = new Inngest({ id: "interview_video" });

//Create/Update
const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();
    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    // 1. Prepare the user data
    const userData = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      profileImage: image_url,
    };

    // 2. Save to MongoDB 
    await User.findOneAndUpdate(
      { clerkId: id },
      userData,
      { upsert: true, new: true }
    );

    // 3. Save to GetStream
    await streamClient.upsertUser({
      id: id,
      name: userData.name,
      image: image_url,
      email: userData.email, 
    });
  }
);

//  DELETE USER 
const deletUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;

    // 1. Delete from MongoDB
    await User.deleteOne({ clerkId: id });

    // 2. Delete from GetStream 
    await streamClient.deleteUser(id);
  }
);

export const functions = [syncUser, deletUserFromDB];

