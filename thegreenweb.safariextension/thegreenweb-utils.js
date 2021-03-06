/**
 * Utilities for the greenweb add-on
 *
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 * @copyright Cleanbits/The Green Web Foundation 2010-2014
 */

/**
 * Get the url from the given location
 */
function getUrl(loc)
{
    loc = this.stripProtocolFromUrl(loc);
    if(loc == false){
        return false;
    }
    loc = this.stripPageFromUrl(loc);
    loc = this.stripPortFromUrl(loc);
    return loc;
}

/**
 * Strip the protocol from the location
 * If no http or https given, then return false
 */
function stripProtocolFromUrl(loc)
{
    if(loc == undefined){
        return false;
    }
    var prot = loc.substring(0,5);
    if(prot == 'http:'){
        return loc.substring(7);
    }
    if(prot == 'https'){
        return loc.substring(8);
    }
    return false;
}

/**
 * Only use the domain.tld, not the page
 */
function stripPageFromUrl(loc)
{
    var temp = loc.split('/');
    loc = temp[0];
    return loc;
}

/**
 * Only use the domain.tld, not the port
 */
function stripPortFromUrl(loc)
{
    var temp = loc.split(':');
    loc = temp[0];
    return loc;
}

function searchMessage()
{
    return $('<p>', {id : 'thegreenweb', text: 'The Green Web is enabled', style: 'text-align:center;'})
            .prepend(addLinkNodeToImage(getImageNode('green'),false));
}

/**
 * Get the image path based on file
 */
function getImagePath(file)
{
    var icons = [];
    icons['green']      = new Array(safari.extension.baseURI + "images/smily_16_kleur_happy.png", 16);
    icons['grey']       = new Array(safari.extension.baseURI + "images/smily_16_kleur_sad.png", 16);
    icons['greentoolbar'] = new Array(safari.extension.baseURI + "images/smily_16_happy.png", 16);
    icons['greytoolbar'] = new Array(safari.extension.baseURI + "images/smily_16_sad.png", 16);
    icons['greenquestion'] = new Array(safari.extension.baseURI + "images/greenquestion16x16.png",16);
    icons['greenfan'] = new Array(safari.extension.baseURI + "images/greenfan16x16.png", 16);
    icons['greenhouse'] = new Array(safari.extension.baseURI + "images/greenhouse20x20.gif", 20);
    icons['greenpopover'] = new Array(safari.extension.baseURI + "images/smily_26_happy.png", 26);
    icons['greypopover'] = new Array(safari.extension.baseURI + "images/smily_26_sad.png", 26);
    icons['greenfanpopover'] = new Array(safari.extension.baseURI + "images/greenfan26x26.png",26);

     if(icons[file]){
        return icons[file];
    }
    
    img = [];
    img[1] = 16;
    img[0] = iconPath = 'http://images.cleanbits.net/icons/' + file + "20x20.gif";
    return img;
}

/**
 * Get the resulting image from the data as jquery dom node
 */
function getResultNode(data)
{
    icon = getIcon(data);
    provider = false;
    if(data.hostedbyid){
        provider = data.hostedbyid;
    }
    return addLinkNodeToImage(getImageNode(icon),provider);
}

function getProviderLink(provider)
{
    var href = 'http://www.thegreenwebfoundation.org';
    if(provider){
        href = href + '/thegreenweb/#/providers/' + provider;
    }
    return href;
}

function addLinkNodeToImage(image, provider)
{
    var href = getProviderLink(provider);
    var a    = $("<a>", { href: href, class: 'TGWF-addon' })
                 .append(image);
    return a;
}

function getImageNode(color)
{
    var img = getImagePath(color);
    return $('<img>', { style: 'width:' + img[1] + 'px !important; height:' + img[1] + 'px !important;border:none;', src: img[0]});
}

/**
 * Get the icon based on the data
 */
function getIcon(data)
{
    if(data.green) {
        if(data.icon) {
            return data.icon;
        }
        return 'green';
    }
    if(data.data == false){
        icon = 'greenquestion';
    }
    return 'grey';
}

/**
 * Get the icon based on the data
 */
function getIconPopover(data)
{
    icon = this.getIcon(data);
    return icon + 'popover';
}

/**
 * Get the title based on the data
 */
function getTitle(data)
{
    if(data.green) {
        if(data.hostedby){
            return 'Sustainably hosted by ' + data.hostedby;
        }
        return 'is made sustainable through Cleanbits';
    }

    if(data.data == false){
        // No data available, show help message
        return " No data available yet for this country domain. Wanna help? Contact us through www.cleanbits.net";
    }

    // Data available, so show grey site
    return data.url + ' is hosted grey';
}

/**
 * Get the title based on the data
 */
function getTitleWithLink(data)
{
    if (data) {
        if (data.green) {
            if (data.hostedby) {
                var href = getProviderLink(data.hostedbyid);
                return data.url + ' ' + '<a target=\'_blank\' href=\'' + href + '\'>' + ' is sustainably hosted by ' + ' ' + data.hostedby + '</a>';
            }
            return data.url + ' ' + 'is made sustainable through Cleanbits';
        }

        if (data.data == false) {
            var href = getProviderLink(false);
            // No data available, show help message
            return "No data available yet for this country domain. Wanna help? Contact us through "
                    + " <a target='_blank' href='" + href + "'>www.thegreenwebfoundation.org</a>";
        }
           // Data available, so show grey site
            return data.url + ' ' + ' is hosted grey';

    }    
    return '';
}

/**
 * Show the start message
 */
function startMessage()
{
    msg = "<img src='./images/smily_26_happy.png'/>&nbsp;<span id='thegreenwebtext'>The Green Web</span>";
    document.getElementById('thegreenweb').innerHTML = msg;
}

/**
 * Show the resulting icon based on the response
 */
function showIcon(resp, type)
{
    title = getTitle(resp);
    provider = false;
    if (resp.hostedbyid) {
        provider = resp.hostedbyid;
    }
    var link = addLinkNodeToImage(getImageNode(getIconPopover(resp)),provider);

    link.append($('<span>', { id: 'thegreenwebtext', text: title}));

    $('#thegreenweb').html(link);
    
    showToolbarIcon(resp.green);
}  

/** 
 * Change the toolbaricon to happy smiley for green or sad smily for grey
 */
function showToolbarIcon(green)
{
    var itemArray = safari.extension.toolbarItems;
    for (var i = 0; i < itemArray.length; ++i) {
        var item = itemArray[i];
        if (item.identifier == "thegreenweb")
        {
            localStorage.lasturl = url;
            if(green){
                item.image = safari.extension.baseURI + "images/smily_16_happy.png";
                return;
            }
            item.image = safari.extension.baseURI + "images/smily_16_sad.png";
            return;
        }
    }
}

/**
 * Do a request to the api, if not cached
 */
function doRequest(type)
{
    activewindow = safari.application.activeBrowserWindow;
    url = getUrl(activewindow.activeTab.url);

    if(url !== false){
        date = new Date();
        currenttime = date.getTime();
    
        var cached = localStorage.getItem("cache"+url);
        if(cached !== null){
            // Item in cache, check cachetime
            var resp = JSON.parse(cached);
            if(resp.time > currenttime - 3600000){
                showIcon(resp);
                return;
            }
        }
        
        // Url is valid and not cached, so retrieve from api
        doApiCall(url);
        return;
    }

    startMessage();
}

/**
 * Do an api call
 */
function doApiCall(url)
{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://api.thegreenwebfoundation.org/greencheck/"+url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
                var resp = JSON.parse(xhr.responseText); 
                resp.time = currenttime;
                localStorage.setItem("cache"+url, JSON.stringify(resp));
                showIcon(resp);
        }
    }
    xhr.send();
}

/**
 * Do the search request
 */
function doSearchRequest(data, event)
{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://api.thegreenwebfoundation.org/v2/greencheckmulti/"+JSON.stringify(data), true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var resp = JSON.parse(xhr.responseText);
            event.target.page.dispatchMessage("greencheckSearchResult", resp);
        }
    }
    xhr.send();
}

/**
 * Handle the message
 */
function respondToMessage(theMessageEvent) {
    if(theMessageEvent.name === "greencheckSearch")
    {
        var locs = theMessageEvent.message;
        doSearchRequest(locs,theMessageEvent);
    }
    if(theMessageEvent.name === "tabFocusSwitched"){
        lasturl = localStorage.lasturl;
        activewindow = safari.application.activeBrowserWindow;
        url = getUrl(activewindow.activeTab.url);

        // Don't display when no url is found or it's the same url
        if(url && url != lasturl){
            var itemArray = safari.extension.toolbarItems;
            for (var i = 0; i < itemArray.length; ++i) {
                var item = itemArray[i];
                if (item.identifier == "thegreenweb")
                {
                    doRequest();
                    localStorage.lasturl = url;
                    return;
                }
            }
        }
    }
}