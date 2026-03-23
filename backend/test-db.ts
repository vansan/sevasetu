
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function testDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    if (!mongoose.connection.db) {
      throw new Error("Database not connected");
    }
    const admin = mongoose.connection.db.admin();

    const dbs = await admin.listDatabases();

    console.log("Connected successfully!");
    console.log(dbs);

    process.exit(0);
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
}

testDB();