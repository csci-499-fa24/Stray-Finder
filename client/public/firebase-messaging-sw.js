// Give the service worker access to Firebase Messaging.
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');




// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
        apiKey: "AIzaSyDAAMNLBHKw0ar2RR4iidrWI5sF9lvk52M",
        authDomain: "strayfinder-a092f.firebaseapp.com",
        projectId: "strayfinder-a092f",
        storageBucket: "strayfinder-a092f.firebasestorage.app",
        messagingSenderId: "293970270878",
        appId: "1:293970270878:web:03152a189e81d938dbf98f",
        measurementId: "G-JDBC1XTL7G"
      });




// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();




messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notifcation.body,
      icon: payload.notifcation.image,
    };
 
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
