// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyDAAMNLBHKw0ar2RR4iidrWI5sF9lvk52M",
  authDomain: "strayfinder-a092f.firebaseapp.com",
  projectId: "strayfinder-a092f",
  storageBucket: "strayfinder-a092f.firebasestorage.app",
  messagingSenderId: "293970270878",
  appId: "1:293970270878:web:03152a189e81d938dbf98f",
  measurementId: "G-JDBC1XTL7G"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);


export const generateToken = async() => {
    const permission = await Notification.requestPermission();
    console.log(permission);
    if(permission == "granted"){
        const token = await getToken(messaging, {
            vapidKey: "BHvY2x7sMjrhzINeqjr_DH9gJpBLhxGS_NN2fj92BGgBeUxCGc3IDPS2YFmTnpXEV6EqNTT1m49lBePk5baNneI",
    });
    console.log(token)
    }
};

export { messaging }