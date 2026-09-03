import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';
import type { Itinerary } from '../types';

export interface SavedTrip {
  id: string;
  destination: string;
  duration: string;
  createdAt: string;
  itinerary: Itinerary;
}

export interface UserData {
  savedDestinations: string[];
  myTrips: string[];
  savedTrips?: SavedTrip[];
}

export const initializeUserData = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  
  if (!docSnap.exists()) {
    await setDoc(userRef, {
      savedDestinations: [],
      myTrips: [],
      savedTrips: []
    });
  } else {
    // If user document exists but doesn't have savedTrips field yet
    const data = docSnap.data();
    if (!data.savedTrips) {
      await updateDoc(userRef, {
        savedTrips: []
      });
    }
  }
};

export const getUserData = async (userId: string): Promise<UserData | null> => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserData;
  }
  return null;
};

export const saveDestinationToDb = async (userId: string, destinationId: string) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    savedDestinations: arrayUnion(destinationId)
  });
};

export const removeDestinationFromDb = async (userId: string, destinationId: string) => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data() as UserData;
    const updated = (data.savedDestinations || []).filter(id => id !== destinationId);
    await updateDoc(userRef, {
      savedDestinations: updated
    });
  }
};

export const saveTripToDb = async (userId: string, trip: SavedTrip) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    savedTrips: arrayUnion(trip)
  });
};

export const removeTripFromDb = async (userId: string, tripId: string) => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data() as UserData;
    const updatedTrips = (data.savedTrips || []).filter(t => t.id !== tripId);
    await updateDoc(userRef, {
      savedTrips: updatedTrips
    });
  }
};
