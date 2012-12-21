/* 
 * Ecosia search pagemod functions
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
      $(".result > li").each(function (i) {
        var loc = getUrl($(this).find('a').first().attr('href'));

        if(data[loc]){
            $(this).find('.TGWF').first()
              .html(getResultNode(data[loc]).append('&nbsp;'))
              .qtip({
                  content: { 
                    text: function(api) { 
                      return getTitleWithLink(data[loc]); 
                      } 
                    },
                    show: { delay: 700 },
                    hide: { fixed:true,  delay:500 }
              });
              if(data[loc].green){
                $(this).find('.TGWF').first().qtip('option', { 'style.classes': 'qtip-green'});
              } else {
                $(this).find('.TGWF').first().qtip('option', { 'style.classes': 'qtip-light'});
              }                
            if(data[loc].poweredby) {
               $(this).find('.TGWF').parent().parent().css('background', '#DBFA7F');
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
    if(page.indexOf("ecosia.org") != -1){
        $('.options').append("<p id='thegreenweb'>" + getLinkImage('green','The Green Web extension shows if a site is sustainably hosted') + ' The Green Web is enabled</p>');
        var locs = new Object();
        if ( $(".result > li").length > 0 ) {
             $(".result > li").each(function (i) {
                 $(this).find('a').first().prepend($('<span>', { class: 'TGWF'}).append(getImageNode('greenquestion')).append('&nbsp;'));
                 var loc = getUrl($(this).find('a').first().attr('href'));
                 locs[loc] = loc;
             });
        }
        if(Object.keys(locs).length > 0) {
            safari.self.tab.dispatchMessage("greencheckSearch",locs);
        }
    }
});   