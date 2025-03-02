// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const auth = getAuth(app);
export { database, ref, onValue, set };




// // Mock Firebase implementation for demonstration purposes
// // Replace with your actual Firebase configuration

// export const database = {
//   // This is a mock implementation
// };

// export const ref = (db: any, path: string) => ({
//   path,
// });

// export const onValue = (reference: any, callback: Function) => {
//   // Simulate real-time data updates
//   const mockData = generateMockData(reference.path);
//   callback({
//     val: () => mockData,
//   });

//   // Set up interval to simulate real-time updates
//   const interval = setInterval(() => {
//     const updatedData = generateMockData(reference.path);
//     callback({
//       val: () => updatedData,
//     });
//   }, 5000);

//   // Return unsubscribe function
//   return () => clearInterval(interval);
// };

// export const set = (reference: any, value: any) => {
//   console.log(`Setting ${reference.path} to:`, value);
//   // In a real implementation, this would update Firebase
// };

// // Helper function to generate mock data
// function generateMockData(path: string) {
//   const now = Math.floor(Date.now() / 1000);
  
//   if (path === "ldr/data") {
//     const data: Record<string, { value: number }> = {};
//     // Generate data for the last 30 minutes
//     for (let i = 0; i < 30; i++) {
//       const timestamp = now - (29 - i) * 60;
//       data[timestamp] = { value: Math.floor(Math.random() * 1000) };
//     }
//     return data;
//   }
  
//   if (path === "temperature/data") {
//     const data: Record<string, { value: number }> = {};
//     for (let i = 0; i < 30; i++) {
//       const timestamp = now - (29 - i) * 60;
//       data[timestamp] = { value: 20 + Math.random() * 10 };
//     }
//     return data;
//   }
  
//   if (path === "humidity/data") {
//     const data: Record<string, { value: number }> = {};
//     for (let i = 0; i < 30; i++) {
//       const timestamp = now - (29 - i) * 60;
//       data[timestamp] = { value: 40 + Math.random() * 30 };
//     }
//     return data;
//   }
  
//   if (path === "led/value") {
//     return false;
//   }
  
//   return null;
// }