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
      var links = $('.TGWF');
      $(links).each(function (i) {
          var loc = getUrl($(this).parent().attr('href'));
          if(data[loc]){
              $(this).html(getResultNode(data[loc]).append('&nbsp;'));
          }
      });
   }
}
safari.self.addEventListener("message", getAnswer, false);

/**
 * If document is ready, check if it's a google page, find the urls to check
 */
$(document).ready(function() {
    var page = $(location).attr('href');
    // Check if this is a google domain
    if(page.indexOf("google") != -1){
        $('#footer').append(searchMessage());
        
        (function checkLoop() {
            // Check if search results have 'cleanbits' link
            if ( $('.TGWF').length != $('#res h3.r > a').length) {

                // Remove all cleanbits links
                $('.TGWF').remove();

                // Check urls to see if search results are green/grey
                var locs = new Object();
                var links = $('#res h3.r > a');
                $(links).each(function (i) {
                    // Add TGWF link to each google listing
                    $(this).prepend($('<span>', { class: 'TGWF'}).append(getImageNode('greenquestion')).append('&nbsp;'));
                    var loc = getUrl($(this).attr('href'));
                    locs[loc] = loc;
                });
                if(Object.keys(locs).length > 0) {
                    safari.self.tab.dispatchMessage("greencheckSearch",locs);
                }
            }
            setTimeout(checkLoop, 100);
        })();
    }
});