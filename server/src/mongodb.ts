import { MongoClient, ServerApiVersion } from 'mongodb';
require('dotenv').config();

const credentials = process.env.MONGO_CERT_PATH!;

export const client = new MongoClient(process.env.MONGO_URI!, {
	sslKey: credentials,
	sslCert: credentials,
	serverApi: ServerApiVersion.v1,
	// maxConnecting: 5,
	// minPoolSize: 1
});