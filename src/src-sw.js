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

workbox.routing.registerRoute(new RegExp('http://pickvs.com/'), new workbox.strategies.NetworkFirst());
//workbox.routing.registerRoute(isNavMode, writeCb, new workbox.strategies.NetworkFirst());
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