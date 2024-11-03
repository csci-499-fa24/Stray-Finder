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
    apiKey: "<%= NEXT_PUBLIC_FIREBASE_API_KEY %>",
    authDomain: "<%= NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN %>",
    projectId: "<%= NEXT_PUBLIC_FIREBASE_PROJECT_ID %>",
    storageBucket: "<%= NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET %>",
    messagingSenderId: "<%= NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID %>",
    appId: "<%= NEXT_PUBLIC_FIREBASE_APP_ID %>",
    measurementId: "<%= NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID %>"
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
