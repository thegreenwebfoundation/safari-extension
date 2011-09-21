/* 
 * Google search pagemod functions
 * 
 * @author Arend-Jan Tetteroo <aj@cleanbits.net>
 * @copyright Cleanbits/The Green Web Foundation 2010-2011
 */

/**
 * On Request, find all hrefs and assign green or grey icon
 */
function getAnswer(theMessageEvent) {
   if (theMessageEvent.name === "greencheckSearchResult") {
      data = theMessageEvent.message;
      var links = $('span .Cleanbits');
      $(links).each(function (i) {  
          if(data[i]){
              $(this).html(getResult(data[i]));
              if(data[i].poweredby) {
                  $(this).next().css('background-color', '#DBFA7F');
              }else{
              }
          }
      });
   }
}
safari.self.addEventListener("message", getAnswer, false);

/**
 * If document is ready, find the urls to check
 */
$(document).ready(function() {
    var page = $(location).attr('href');
    // Check if this is a google domain
    if(page.indexOf("google") != -1){
        console.log('google');
        $('#res').append("<p id='thegreenweb'>" + getLinkImage('green','The Green Web extension shows if a site is sustainably hosted') + ' The Green Web is enabled<span id=\'thegreenwebenabled\'/></p>');

        (function checkLoop() {
            // Check if search results have 'cleanbits' link
            if ( $('.Cleanbits').length != $('.tl').length) {
            
            // Remove all cleanbits links
            $('.Cleanbits').remove();
			
            // Add cleanbits link to each google listing
            $('.tl').prepend(' <span class="Cleanbits">' + getImage('greenquestion') + '&nbsp;</span>');
			
            // Check urls to see if search results are green/grey
            var locs = new Array();
            var links = $('span .Cleanbits').next();
            $(links).each(function (i) {
                    var loc = $(this).find('a').first().attr('href');
                    locs[i] = getUrl(loc);
                });
                if(locs.length > 6) {
                    safari.self.tab.dispatchMessage("greencheckSearch",locs);
                }
            }
            setTimeout(checkLoop, 100);
        })();
    }
});