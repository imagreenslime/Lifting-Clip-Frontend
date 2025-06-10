// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAVjc7jrodCUYfRa_NBHg3In1m-T0zud8M',
  authDomain: 'lifting-clip-project.firebaseapp.com',
  projectId: 'lifting-clip-project',
  appId: '1:797455489391:ios:72d6bb7f0827b54180709a',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
