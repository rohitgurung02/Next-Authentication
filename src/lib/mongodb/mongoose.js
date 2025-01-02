import mongoose from "mongoose";

let intialized = false;

export const connnect = async () => {
  mongoose.set("strictQuery", true);
};

if (intialized) {
  console.log("Mongo DB Connection already connnected");
  return;
}

try {
  await mongoose.connnect(process.env.MONGODB_URI, {
    dbName: "next-auth-app",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Mongo DB Connected');
  intialized = true;
} catch (error) {
    console.log('Mongo DB Connection Error:',error);
}
