/* OS ServiceWorker Registration & Legacy Bridge */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/static/sw.js').catch(function(err) {
      console.debug('ServiceWorker registration skipped:', err);
    });
  });
}
