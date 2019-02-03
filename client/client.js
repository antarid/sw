const publicVapidKey =
  'BIlBe7nPK0jRSLu2yF4WCGhpLDoJgxjwrohtFkYyzkseUfCy3mw7q06L5sOS2ZS-rdz-9MiAK2B-9rudY_zMtEU';

if ('serviceWorker' in navigator) {
  send().catch(console.err);
}

// Register service worker, rigister push, send push
async function send() {
  console.log('regestring service worker');
  const register = await navigator.serviceWorker.register('./worker.js', {
    scope: '/'
  });
  console.log(register);
  console.log('SW registered');

  console.log('register push');
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  console.log(subscription, 'subscription');

  console.log('sending push');
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
  console.log('push sent');
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
