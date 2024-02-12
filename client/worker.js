console.log('Service Worker Loaded...');

const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

const saveSubscription = async (subscription) => {
    console.log(subscription)
    const response = await fetch('api/subscriptions/save', {
        method: 'POST',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify(subscription)
    })

    return response.json();
}

const nudgeReceived = async (nudgeId) => {
    //console.log(nudgeId)
    const response = await fetch('api/nudges/received', {
        method: 'POST',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({nudgeId: nudgeId})
    })

    return response.json();
}

const nudgeAcknowledged = async (nudgeId) => {
    //console.log(nudgeId)
    const response = await fetch('api/nudges/acknowledged', {
        method: 'POST',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({nudgeId: nudgeId})
    })

    return response.json();
}

self.addEventListener("activate", async (e) => {
    const subscription = await self.registration.pushManager.subscribe({
        applicationServerKey: urlBase64ToUint8Array('BHacMbNlCO3qyTkYw6T84fBFPNYJVTaCiCoZR-37kKC-pX5FzMruAITKwdG0H3ZUV4bYcGukg8PbpzCH2x5JH_o'),
        userVisibleOnly: true
    })

    console.log(subscription)
    const response = await saveSubscription(subscription)
    console.log(response)
})

self.addEventListener('push', async (e) => {
    console.log('notification received')
    const notification = JSON.parse(e.data.text())
    notification.data = JSON.parse(notification.data)
    self.registration.showNotification(notification.title, {
        body: notification.body,
        icon: 'logo.png',
        data: notification.data
    })
    await self.navigator.setAppBadge();
    const response = await fetch('api/nudges/received', {
        method: 'PATCH',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ nudgeId: notification.data.id })
    })
    //console.log(response)
})

self.addEventListener("notificationclick", async (e) => {
    console.log('notification clicked')
    await self.navigator.setAppBadge(0)
    const response = await fetch('api/nudges/acknowledged', {
        method: 'PATCH',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({ nudgeId: e.notification.data.id })
    })
    
    //console.log(response)
    console.log(e.notification.data.contacts)

    e.waitUntil(self.clients.claim().then(() => {
        // See https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
        return self.clients.matchAll({type: 'window'});
      }).then(clients => {
        return clients.map(client => {
          // Check to make sure WindowClient.navigate() is supported.
          if ('navigate' in client) {
            return client.navigate(`nudge?id=${e.notification.data.id}`);
          }
        });
      }));

})

self.addEventListener("pushsubscriptionchange", event => {
    console.log('push subscription changed')
    event.waitUntil(
      fetch('api/subscription-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          old_endpoint: event.oldSubscription ? event.oldSubscription.endpoint : null,
          new_endpoint: event.newSubscription ? event.newSubscription.endpoint : null,
          new_p256dh: event.newSubscription ? event.newSubscription.toJSON().keys.p256dh : null,
          new_auth: event.newSubscription ? event.newSubscription.toJSON().keys.auth : null
        })
      })
    );
  });