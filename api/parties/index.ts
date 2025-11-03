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
    const partiesCollection = db.collection('parties');

    if (req.method === 'GET') {
      // Get all parties
      const parties = await partiesCollection.find({}).toArray();
      return res.status(200).json({ parties });
    }

    if (req.method === 'POST') {
      // Add new party
      const newParty = req.body;
      
      // Add timestamp
      newParty.createdAt = new Date();
      newParty.updatedAt = new Date();
      
      const result = await partiesCollection.insertOne(newParty);
      
      return res.status(201).json({
        success: true,
        message: 'Party saved',
        party: {
          ...newParty,
          _id: result.insertedId,
        },
      });
    }

    if (req.method === 'PUT') {
      // Update party (for approval/rejection or other updates)
      const { id, status, ...updateFields } = req.body;
      
      const updateData: any = {
        updatedAt: new Date(),
      };
      
      if (status) {
        updateData.status = status;
      }
      
      // Merge any additional update fields
      Object.assign(updateData, updateFields);
      
      const result = await partiesCollection.findOneAndUpdate(
        { id },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) {
        return res.status(404).json({ success: false, message: 'Party not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Party updated',
        party: result,
      });
    }

    if (req.method === 'DELETE') {
      // Delete party
      const { id } = req.query;
      
      const result = await partiesCollection.deleteOne({ id });

      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'Party not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Party deleted',
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

