import User from "../models/user.model";
import { connect } from "../mongodb/mongoose";

export const createOrUpdate = async (
  id,
  first_name,
  last_name,
  image_url,
  email_addresses,
  username
) => {
  try {
    await connect();

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          email: email_addresses[0].email,
          userName: username,
          image: image_url,
        },
      },
      { new: true, upsert: true } // if user is not exist then it will create it and exist then it will be updated
    );

    return user;
  } catch (error) {
    console.log("Error creating or updating user:", error);
  }
};

export const deleteUser = async (id) => {
  try {
    await connect();
    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.log("User deleting error", error);
  }
};
