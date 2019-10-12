importScripts("resources/precache-manifest.0a2dc03b9def26a49c4d3c91b70e6ec4.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

console.log("Hello From Service Worker");
workbox.precaching.precacheAndRoute(self.__precacheManifest);

const isNavMode = ({ event }) => event.request.mode === 'navigate';

const writeCb = ({ url, event, params }) => {
  return fetch(event.request)
    .then((response) => {
      alert('hi');
      return response.text();
    })
    .then((responseBody) => {
      alert('hi');
      return new Response(`${responseBody} <!-- Look Ma. Added Content. -->`);
    });
}

workbox.routing.registerRoute(new RegExp('/resources/'), new workbox.strategies.StaleWhileRevalidate());
workbox.routing.registerRoute(new RegExp('http://pickvs.com/'), new workbox.strategies.NetworkFirst());
workbox.routing.registerRoute(isNavMode, writeCb, new workbox.strategies.NetworkFirst());
// workbox.routing.registerRoute(
//   new workbox.routing.NavigationRoute(
//     workbox.precaching.createHandlerForURL('/index.html'),
//     {
//       whiteList: [ new RegExp('.+/write/') ],
//       blackList: []
//     }
//   )
// )
// workbox.routing.registerNavigationRoute(
//   writeCb,
//   workbox.precaching.getCacheKeyForURL('../index.html'), {
//     whiteList: [ new RegExp('.+/write/') ],
//     blackList: []
//   }
// );
