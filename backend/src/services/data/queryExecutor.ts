import { Document } from "mongodb";
import mongoose from "mongoose";
import { connectDB } from "../../config/database.js";
import {
	discoverCollections,
	type CollectionSchema
} from "./schemaDiscovery.js";
import type { MongoQueryPayload } from "../ai/mongoQueryGenerator.js";

function getAllowedCollections(schemas: CollectionSchema[]): string[] {
	return schemas.map((schema) => schema.name);
}

export const executeQuery = async ({
	collection,
	filter,
	projection
}: MongoQueryPayload): Promise<Document[]> => {
	await connectDB();

	const db = mongoose.connection.db;
	if (!db) throw new Error("Database connection is not available.");

	const schemas = await discoverCollections();
	const allowedCollections = getAllowedCollections(schemas);

	if (!allowedCollections.includes(collection)) {
		throw new Error(
			`Collection "${collection}" is not allowed. Available: ${allowedCollections.join(", ")}`
		);
	}

	return db.collection(collection).find(filter, { projection }).limit(50).toArray();
};
