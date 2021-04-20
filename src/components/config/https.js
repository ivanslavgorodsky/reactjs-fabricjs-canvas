(function(){
  // https protocol
  const w = window.location;
  if ( w.hostname !== 'localhost' && String(w.protocol).indexOf('https') !== 0 ) {
    window.location.replace(`https:${w.href.substring(w.protocol.length)}`);
  }
  // if (document.location.hostname === 'localhost') {
  //   var links = document.getElementById('header').getElementsByTagName('a');
  //   for (var i = 0, len = links.length; i < len; i++) {
  //     links[i].href = links[i].href.replace('website.com', 'localhost:3000');
  //   }
  // }
})();