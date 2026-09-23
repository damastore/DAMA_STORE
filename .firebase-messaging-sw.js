importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBoIHMObJyJ7ehdPX5pfSwb3QYzxL0QO-Q",
  authDomain: "dama-store-7fd69.firebaseapp.com",
  databaseURL: "https://dama-store-7fd69-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dama-store-7fd69",
  storageBucket: "dama-store-7fd69.firebasestorage.app",
  messagingSenderId: "1076285666524",
  appId: "1:1076285666524:web:15e9b02fcd7ea67ecdb019"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title =
    payload.notification?.title || "DAMA STORE";

  const options = {
    body: payload.notification?.body || "عندك تحديث جديد فالمتجر.",
    icon: "/projet-omar/photos/logo.jpg",
    data: {
      url: "/projet-omar/admin.html"
    }
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || "/projet-omar/admin.html",
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }

      return clients.openWindow(targetUrl);
    })
  );
});