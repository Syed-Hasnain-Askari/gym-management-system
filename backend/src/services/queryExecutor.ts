import mongoose from "mongoose";
import { connectDB } from "../config/database.js";
import { discoverCollections } from "./schemaDiscovery.service.js";
import { Document } from "mongodb";

interface QueryPayload {
  collection: string;
  filter: Record<string, unknown>;
  projection: Record<string, unknown>;
}

export const executeQuery = async ({
  collection,
  filter,
  projection
}: QueryPayload): Promise<Document[]> => {
  await connectDB();

  const db = mongoose.connection.db;
  if (!db) throw new Error("Database connection is not available.");

  // Dynamically fetch allowed collections at runtime — no hardcoding
  const schemas = await discoverCollections();
  const allowedCollections = schemas.map((s) => s.name);

  if (!allowedCollections.includes(collection)) {
    throw new Error(
      `Collection "${collection}" is not allowed. Available: ${allowedCollections.join(", ")}`
    );
  }

  const results = await db
    .collection(collection)
    .find(filter, { projection })
    .limit(50)
    .toArray();

  return results;
};