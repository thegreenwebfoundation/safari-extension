/* 
 * Yahoo search pagemod functions
 * 
 * @author Arend-Jan Tetteroo <aj@cleanbits.net>
 * @copyright Cleanbits 2010-2011
 */

/**
 * On Request, find all hrefs and assign green or grey icon
 */
function getAnswer(theMessageEvent) {
   if (theMessageEvent.name === "greencheckSearchResult") {
      data = theMessageEvent.message;
      $("#web ol > li").each(function (i) {
                if(data[i]){
                    $(this).find('.Cleanbits').first().html(getResult(data[i]));
                    if(data[i].poweredby) {
                       $(this).find('.Cleanbits').parent().css('background', '#DBFA7F');
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
    // Check if this is a bing.com domain
    if(page.indexOf("search.yahoo.com") != -1){
        console.log('yahoo');
  
        $('#ft').prepend("<p id='thegreenweb'>" + getLinkImage('green','The Green Web extension shows if a site is sustainably hosted') + ' The Green Web is enabled</p>');
        var locs = new Array();
        if ( $("#web ol > li").length > 0 ) {
            console.log('yahoo');
            $("#web ol > li").each(function (i) {
                $(this).find('.url').parent().first().children().first().prepend(' <span class="Cleanbits">' + getImage('greenquestion') + '&nbsp;</span>');
                var loc = $(this).find('a').first().attr('href');
                 locs[i] = getUrl(loc);
             });
        }
        if(locs.length > 0) {
            safari.self.tab.dispatchMessage("greencheckSearch",locs);
        }
    }
});   