/* 
 * Yahoo search pagemod functions
 * 
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 * @copyright Cleanbits/The Green Web Foundation 2010-2014
 */
/**
 * On Request, find all hrefs and assign green or grey icon
 */
function getAnswer(theMessageEvent) {
   if (theMessageEvent.name === "greencheckSearchResult") {
      data = theMessageEvent.message;
      $("#web ol > li").each(function (i) {
              var loc = $(this).find('a').first().attr('href');
              var strippedurl = getUrl(loc);
                if (loc && strippedurl && data[strippedurl]) {
                  $(this).find('.TGWF').first()
                    .html(getResultNode(data[strippedurl]).append('&nbsp;'))
                    .qtip({
                      content: { 
                        text: function(api) { 
                          return getTitleWithLink(data[strippedurl]); 
                          }
                        },
                      show: { delay: 700 },
                      hide: { fixed:true,  delay:500 }
                    });
                  if(data[strippedurl].green){
                    $(this).find('.TGWF').first().qtip('option', { 'style.classes': 'qtip-green'});
                  } else {
                    $(this).find('.TGWF').first().qtip('option', { 'style.classes': 'qtip-light'});
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
      $('.bd').append(searchMessage());
        
        var locs = new Object();
        if ( $("#web ol > li").length > 0 ) {
             $("#web ol > li").each(function (i) {
                 $(this).find('.url').parent().first().children().first().prepend($('<span>', { class: 'TGWF'}).append(getImageNode('greenquestion')).append('&nbsp;'));
                 var loc = getUrl($(this).find('a').first().attr('href'));
                 locs[loc] = loc;
             });
        }
        if(Object.keys(locs).length > 0) {
            safari.self.tab.dispatchMessage("greencheckSearch",locs);
        }
    }
});   