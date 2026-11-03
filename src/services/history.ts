import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { PredictionRequest, PredictionResponse } from './api';

export interface SavedPrediction {
  id: string;
  userId: string;
  vehicleType: string;
  brandSegment: string;
  vehicleAge: number;
  kilometersDriven: number;
  estimatedCost: number;
  minCost: number;
  maxCost: number;
  modelUsed?: string;
  accuracyEstimate?: string;
  costBreakdown?: {
    partsCost: number;
    laborCost: number;
    taxes: number;
  };
  recommendations?: string[];
  createdAt: number;
}

const LOCAL_STORAGE_KEY_PREFIX = 'servicewise_history_';

export async function savePredictionHistory(
  userId: string,
  request: PredictionRequest,
  response: PredictionResponse
): Promise<void> {
  const newRecord: Omit<SavedPrediction, 'id'> = {
    userId,
    vehicleType: request.vehicle_type,
    brandSegment: request.brand_segment || 'mid',
    vehicleAge: request.vehicle_age,
    kilometersDriven: request.kilometers_driven,
    estimatedCost: response.predicted_cost,
    minCost: response.min_cost,
    maxCost: response.max_cost,
    modelUsed: response.model_used,
    accuracyEstimate: response.accuracy_estimate,
    costBreakdown: {
      partsCost: response.breakdown.parts_cost,
      laborCost: response.breakdown.labor_cost,
      taxes: response.breakdown.tax_gst,
    },
    recommendations: response.recommendations || [],
    createdAt: Date.now(),
  };

  // 1. Always cache in local storage for instant availability
  try {
    const localKey = `${LOCAL_STORAGE_KEY_PREFIX}${userId}`;
    const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
    existing.unshift({ ...newRecord, id: `local_${Date.now()}` });
    localStorage.setItem(localKey, JSON.stringify(existing.slice(0, 50)));
  } catch (err) {
    console.warn('Could not save to local storage history:', err);
  }

  // 2. Persist to Firestore in background with timeout
  try {
    const firestorePromise = addDoc(collection(db, 'predictions'), {
      ...newRecord,
      timestamp: serverTimestamp(),
    });
    // Add 4-second timeout so offline/unconfigured Firestore doesn't hang
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore write timeout')), 4000)
    );
    await Promise.race([firestorePromise, timeoutPromise]);
  } catch (err) {
    console.warn('Firestore sync failed or timed out (saved locally):', err);
  }
}

export async function getUserPredictions(userId: string): Promise<SavedPrediction[]> {
  const localKey = `${LOCAL_STORAGE_KEY_PREFIX}${userId}`;
  let cached: SavedPrediction[] = [];
  try {
    cached = JSON.parse(localStorage.getItem(localKey) || '[]');
  } catch {
    cached = [];
  }

  try {
    const q = query(
      collection(db, 'predictions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    // Timeout Firestore fetch at 3 seconds so the UI never hangs in an infinite spinner
    const fetchPromise = getDocs(q);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore read timeout')), 3000)
    );

    const snap = await Promise.race([fetchPromise, timeoutPromise]);
    const remoteList: SavedPrediction[] = snap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId,
        vehicleType: data.vehicleType,
        brandSegment: data.brandSegment,
        vehicleAge: data.vehicleAge,
        kilometersDriven: data.kilometersDriven,
        estimatedCost: data.estimatedCost,
        minCost: data.minCost,
        maxCost: data.maxCost,
        modelUsed: data.modelUsed,
        accuracyEstimate: data.accuracyEstimate,
        costBreakdown: data.costBreakdown,
        recommendations: data.recommendations,
        createdAt: data.createdAt || Date.now(),
      };
    });

    if (remoteList.length > 0) {
      localStorage.setItem(localKey, JSON.stringify(remoteList));
      return remoteList;
    }
  } catch (err) {
    console.warn('Firestore fetch skipped or timed out, returning local cache:', err);
  }

  return cached;
}

export async function deletePredictionHistory(userId: string, id: string): Promise<void> {
  const localKey = `${LOCAL_STORAGE_KEY_PREFIX}${userId}`;
  try {
    const list: SavedPrediction[] = JSON.parse(localStorage.getItem(localKey) || '[]');
    const filtered = list.filter((item) => item.id !== id);
    localStorage.setItem(localKey, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Failed to delete from local storage:', err);
  }

  if (!id.startsWith('local_')) {
    try {
      await deleteDoc(doc(db, 'predictions', id));
    } catch (err) {
      console.warn('Failed to delete from Firestore:', err);
    }
  }
}
