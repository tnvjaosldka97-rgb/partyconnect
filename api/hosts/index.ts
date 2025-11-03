import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, Db } from 'mongodb';

// MongoDB connection
const uri = process.env.MONGODB_URI || '';
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri);
  const db = client.db('partybear');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const hostsCollection = db.collection('hosts');

    if (req.method === 'GET') {
      // Get all host applications
      const applications = await hostsCollection.find({}).toArray();
      return res.status(200).json({ applications });
    }

    if (req.method === 'POST') {
      // Add new host application
      const newApplication = req.body;
      
      // Add timestamp
      newApplication.createdAt = new Date();
      newApplication.updatedAt = new Date();
      
      const result = await hostsCollection.insertOne(newApplication);
      
      return res.status(201).json({
        success: true,
        message: 'Host application saved',
        application: {
          ...newApplication,
          _id: result.insertedId,
        },
      });
    }

    if (req.method === 'PUT') {
      // Update host application (for approval/rejection)
      const { id, status } = req.body;
      
      const result = await hostsCollection.findOneAndUpdate(
        { id },
        { 
          $set: { 
            status,
            updatedAt: new Date(),
          } 
        },
        { returnDocument: 'after' }
      );

      if (!result) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Host application updated',
        application: result,
      });
    }

    if (req.method === 'DELETE') {
      // Delete host application
      const { id } = req.query;
      
      const result = await hostsCollection.deleteOne({ id });

      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Host application deleted',
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

