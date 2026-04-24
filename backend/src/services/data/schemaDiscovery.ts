import mongoose from "mongoose";
import { connectDB } from "../../config/database.js";

export interface CollectionSchema {
	name: string;
	fields: string[];
	sampleValues: Record<string, unknown>;
}

let cachedSchemas: CollectionSchema[] | null = null;
let cacheExpiry = 0;

const CACHE_TTL_MS = 5 * 60 * 1000;

export async function discoverCollections(): Promise<CollectionSchema[]> {
	const now = Date.now();

	if (cachedSchemas && now < cacheExpiry) {
		return cachedSchemas;
	}

	await connectDB();
	const db = mongoose.connection.db;

	if (!db) {
		throw new Error("Database connection not available.");
	}

	const collections = await db.listCollections().toArray();
	const schemas: CollectionSchema[] = [];

	for (const collection of collections) {
		const sample = await db.collection(collection.name).findOne();

		if (sample) {
			const { _id, ...rest } = sample;
			schemas.push({
				name: collection.name,
				fields: Object.keys(rest),
				sampleValues: rest
			});
			continue;
		}

		schemas.push({
			name: collection.name,
			fields: [],
			sampleValues: {}
		});
	}

	cachedSchemas = schemas;
	cacheExpiry = now + CACHE_TTL_MS;

	return schemas;
}

export function buildSchemaContext(schemas: CollectionSchema[]): string {
	return schemas
		.map((schema) => {
			const fieldList = schema.fields.join(", ");
			const sample = JSON.stringify(schema.sampleValues, null, 2);
			return `Collection: "${schema.name}"\nFields: ${fieldList}\nSample: ${sample}`;
		})
		.join("\n\n");
}
