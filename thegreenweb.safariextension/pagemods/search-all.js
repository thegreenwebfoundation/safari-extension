/*
 * Pagemod for all external links on site
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
        $("a").not('.TGWF-addon').each(function (i) {
              var loc = $(this).attr('href');
              var strippedurl = getUrl(loc);
              if (loc && strippedurl) {
                if (data[strippedurl]) {
                  
                  if(data[strippedurl].green){
                   // $(this).addClass('tgwf_green');
                    $(this)
                    .addClass('tgwf_green')
                    .qtip({
                      content: { text: function(api) { 
                        title = getTitleWithLink(data[strippedurl]); 
                        return title;
                      }},
                      show: { delay: 700 },
                      hide: { fixed:true,  delay:500 },
                      style: {
                        classes: 'qtip-green'
                      }
                    });
                  } else {
                    $(this).addClass('tgwf_grey');
                  }
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
        getUrlsAndSendRequest();
});

function getUrlsAndSendRequest()
{
  currenturl = getUrl(document.URL);
  var locs = new Object();
  $("a").not('.TGWF-addon').each(function (i) {
       var loc = $(this).attr('href');
       var strippedurl = getUrl(loc);
       if (loc && strippedurl) {
         /*if (getUrl(loc) == currenturl) {
           return true;
         }*/
         locs[strippedurl] = strippedurl 
       }             
  });
  if(Object.keys(locs).length > 0) {
      safari.self.tab.dispatchMessage("greencheckSearch",locs);
  }
}