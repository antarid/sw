const publicVapidKey =
  'BIlBe7nPK0jRSLu2yF4WCGhpLDoJgxjwrohtFkYyzkseUfCy3mw7q06L5sOS2ZS-rdz-9MiAK2B-9rudY_zMtEU';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./caching_sw.js', {
    scope: '/'
  });
}

async function subscribe(days) {
  console.log('regestring');
  const register = await navigator.serviceWorker.register(
    './subscribing_sw.js',
    {
      scope: '/'
    }
  );
  console.log('subscription sw registered');
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  console.log('subscription ready');
  const res = await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify({subscription, days}),
    headers: {
      'content-type': 'application/json'
    }
  });
  console.log('subscription sent');
  if (res.status === 201) alert(`you are already subscribed`);
  else if (res.status === 200)
    alert(`you have subscribed for ${days} days subscription`);
  else alert('error');
}

// // Register service worker, rigister push, send push
// async function send() {
//   console.log('regestring service worker');
//   const register = await navigator.serviceWorker.register('./worker.js', {
//     scope: '/'
//   });
//   console.log(register);
//   console.log('SW registered');

//   console.log('register push');
//   const subscription = await register.pushManager.subscribe({
//     userVisibleOnly: true,
//     applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
//   });
//   console.log(subscription, 'subscription');

//   console.log('sending push');
//   await fetch('/subscribe', {
//     method: 'POST',
//     body: JSON.stringify(subscription),
//     headers: {
//       'content-type': 'application/json'
//     }
//   });
//   console.log('push sent');
// }

document.querySelectorAll('.subscription').forEach(subscription => {
  const days = subscription.innerText.split(' ')[0];
  subscription.addEventListener('click', () => {
    console.log('here');
    subscribe(days);
  });
});

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
