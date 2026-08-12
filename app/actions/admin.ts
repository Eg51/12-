// app/actions/admin.ts
"use server";

import { MongoClient, ObjectId } from "mongodb";
import { headers } from "next/headers";

const MONGODB_URI = process.env.MONGODB_URI!;

// ---- Helper to verify admin on server action ----
async function verifyAdmin() {
  const headersList = await headers();
  const role = headersList.get("x-user-role");
  if (role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
}

// ---- 1. GET ALL USERS (For the Dropdown) ----
export async function getAllUsers() {
  try {
    await verifyAdmin();

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db("userRegistration");
    const collection = db.collection("users");

    // Get just enough info for the admin dropdown
    const users = await collection.find({}, { 
      projection: { 
        _id: 1, 
        firstName: 1, 
        lastName: 1, 
        username: 1, 
        email: 1,
        isActive: 1
      } 
    }).sort({ createdAt: -1 }).toArray();

    await client.close();
    return { success: true, users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

// ---- 2. GET SPECIFIC USER'S DASHDATA ----
export async function getUserDashData(userId: string) {
  try {
    await verifyAdmin();

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db("userRegistration");
    const dashCollection = db.collection("dashdata");

    const dashData = await dashCollection.findOne({ userId });
    await client.close();

    if (!dashData) {
      // Return empty defaults if user has no dashdata yet
      return { 
        success: true, 
        data: { 
          bills: [], 
          recentTransactions: [], 
          paymentMethods: [], 
          preferences: {} 
        } 
      };
    }

    return { success: true, data: dashData };
  } catch (error) {
    console.error("Error fetching dashdata:", error);
    return { success: false, error: "Failed to fetch dashdata" };
  }
}

// ---- 3. UPDATE USER'S DASHDATA (CRUD) ----
export async function updateUserDashData(userId: string, updates: any) {
  try {
    await verifyAdmin();

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db("userRegistration");
    const dashCollection = db.collection("dashdata");

    const result = await dashCollection.updateOne(
      { userId },
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true } // Create document if it doesn't exist
    );

    await client.close();
    return { success: true, result };
  } catch (error) {
    console.error("Error updating dashdata:", error);
    return { success: false, error: "Failed to update dashdata" };
  }
}