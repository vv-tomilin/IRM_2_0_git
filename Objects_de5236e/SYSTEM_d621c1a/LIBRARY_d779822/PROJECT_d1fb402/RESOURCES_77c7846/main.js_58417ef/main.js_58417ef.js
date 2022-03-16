if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', {scope: './'})
  .then(function(reg) {
    // регистрация сработала
    console.log('SW registration succeeded.');
  }).catch(function(error) {
    // регистрация прошла неудачно
    console.log('SW registration failed with ' + error);
  });
}
