import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './firebase';

export interface UserData {
  savedDestinations: string[];
  myTrips: string[];
}

export const initializeUserData = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  
  if (!docSnap.exists()) {
    await setDoc(userRef, {
      savedDestinations: [],
      myTrips: []
    });
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
  await updateDoc(userRef, {
    savedDestinations: arrayRemove(destinationId)
  });
};
