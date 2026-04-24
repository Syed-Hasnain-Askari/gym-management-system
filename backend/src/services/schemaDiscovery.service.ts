import mongoose from "mongoose";
import { connectDB } from "../config/database.js";

export interface CollectionSchema {
  name: string;
  fields: string[];
  sampleValues: Record<string, unknown>;
}

let cachedSchemas: CollectionSchema[] | null = null;
let cacheExpiry: number = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function discoverCollections(): Promise<CollectionSchema[]> {
  const now = Date.now();

  // Return cache if still valid
  if (cachedSchemas && now < cacheExpiry) {
    return cachedSchemas;
  }

  await connectDB();
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database connection not available.");

  const collections = await db.listCollections().toArray();
  const schemas: CollectionSchema[] = [];

  for (const col of collections) {
    const name = col.name;
    const sample = await db.collection(name).findOne();

    if (sample) {
      const { _id, ...rest } = sample;
      schemas.push({ name, fields: Object.keys(rest), sampleValues: rest });
    } else {
      schemas.push({ name, fields: [], sampleValues: {} });
    }
  }

  // Update cache
  cachedSchemas = schemas;
  cacheExpiry = now + CACHE_TTL_MS;

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