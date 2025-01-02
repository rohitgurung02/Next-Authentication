import { Webhook } from "svix";
import { headers } from "next/headers";
import { connect } from "mongoose";

export async function POST(req) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt?.data;
  const eventType = evt?.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log("Webhook payload:", body);

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, first_name, last_name, email_addresses, username, image_url } =
      evt?.data;
    console.log("User Created");
    try {
      await createOrUpdateuser(
        id,
        first_name,
        last_name,
        email_addresses,
        username,
        image_url
      );
      return new Response("User is created or updated", {
        status: 200,
      });
    } catch (error) {
      console.log("Error creating or updating user", error);
      return new Response("Error occured", {
        status: 400,
      });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt?.data;
    try {
      await deleteUser(id);
      return new Response("User deleted", {
        status: 200,
      });
    } catch (error) {
      console.log("User deleting error", error);
      return new Response("Error occured", {
        status: 400,
      });
    }
    console.log("User updated");
  }

  return new Response("Webhook received", { status: 200 });
}
