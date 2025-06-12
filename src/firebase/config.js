import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD4i8iLIR1QZfO1seDy-W8bHZR-Fl9PYDE",
    authDomain: "snatchx-bd5f8.firebaseapp.com",
    projectId: "snatchx-bd5f8",
    storageBucket: "snatchx-bd5f8.firebasestorage.app",
    messagingSenderId: "700720170887",
    appId: "1:700720170887:web:d8bb1bd3528a0d2296f522",
    measurementId: "G-F5W15ZSSXB"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    experimentalForceLongPolling: true, 
    useFetchStreams: false 
});

export default app; 