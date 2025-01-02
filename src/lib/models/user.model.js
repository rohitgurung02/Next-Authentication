import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } 
// Saving the time of creation and update, it save two extra information
// This option tells Mongoose to automatically add two fields to every document in this collection:
// createdAt: The timestamp when the document (user) was created.
// updatedAt: The timestamp when the document was last modified.

);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
