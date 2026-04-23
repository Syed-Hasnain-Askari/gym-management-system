import mongoose from "mongoose";
import { connectDB } from "../config/database.js";

export interface CollectionSchema {
  name: string;
  fields: string[];
  sampleValues: Record<string, unknown>;
}

export async function discoverCollections(): Promise<CollectionSchema[]> {
  await connectDB();
  const db = mongoose.connection.db;

  if (!db) throw new Error("Database connection not available.");

  // Get all collection names dynamically
  const collections = await db.listCollections().toArray();
  const schemas: CollectionSchema[] = [];

  for (const col of collections) {
    const name = col.name;

    // Sample one document to infer field structure
    const sample = await db.collection(name).findOne();

    if (sample) {
      const { _id, ...rest } = sample;
      schemas.push({
        name,
        fields: Object.keys(rest),
        sampleValues: rest
      });
    } else {
      // Empty collection — still include it
      schemas.push({ name, fields: [], sampleValues: {} });
    }
  }

  return schemas;
}

export function buildSchemaContext(schemas: CollectionSchema[]): string {
  return schemas
    .map((s) => {
      const fieldList = s.fields.join(", ");
      const sample = JSON.stringify(s.sampleValues, null, 2);
      return `Collection: "${s.name}"\nFields: ${fieldList}\nSample: ${sample}`;
    })
    .join("\n\n");
}