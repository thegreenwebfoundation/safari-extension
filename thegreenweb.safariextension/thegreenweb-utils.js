/**
 * Utilities for the greenweb add-on
 *
 * @author Arend-Jan Tetteroo <aj@cleanbits.net>
 * @copyright Cleanbits/The Green Web Foundation 2010-2011
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
        loc = loc.substring(7);
    }else if(prot == 'https'){
        loc = loc.substring(8);
    }else{
        return false;
    }
    return loc;
}

/**
 * Only use the domain.tld, not the page
 */
function stripPageFromUrl(loc)
{
    var temp = new Array();
    temp = loc.split('/');
    loc = temp[0];
    return loc;
}

/**
 * Get the image with a cleanbits link around it
 */
function getLinkImage(color,tooltip)
{
    var output = "<a href='http://www.cleanbits.net' target='_blank' title='" + tooltip + "'>";
    output += getImage(color) + "</a>";
    return output;
}

/**
 * Get the image element based on the color
 */
function getImage(color)
{
    var img = getImagePath(color);
    return  "<img style='border:none;' src='"+img+"'/>";
}

/**
 * Get the image path based on file
 */
function getImagePath(file)
{
    var icons = new Array();
    icons['green']         = safari.extension.baseURI + "images/green20x20.gif";
    icons['grey']          = safari.extension.baseURI + "images/grey20x20.gif";
    icons['greenquestion'] = safari.extension.baseURI + "images/greenquestion20x20.gif";
    icons['greenfan']      = safari.extension.baseURI + "images/greenfan20x20.gif";
    icons['greenhouse']    = safari.extension.baseURI + "images/greenhouse20x20.gif";

     if(icons[file]){
        return icons[file];
    }

    iconPath = 'http://images.cleanbits.net/icons/' + file + "20x20.gif";
    return iconPath;
}

/**
 * Get the resulting image from the data
 */
function getResult(data)
{
    icon = getIcon(data);
    title = getTitle(data);
    return getLinkImage(icon,title) + getPoweredResult(data) + '&nbsp;';
}

/**
 * Get the resulting image from the data
 */
function getPoweredResult(data)
{
    if(data.poweredby) {
        icon = 'greenhouse';
        title = data.poweredby.organisatie + ' uses green power';
        return getLinkImage(icon,title) + '&nbsp;';
    }else{
        return '';
    }
}

/**
 * Get the icon based on the data
 */
function getIcon(data)
{
    var icon = 'grey';
    if(data.green) {
        icon = 'green';
        if(data.icon) {
            icon = data.icon;
        }
    }else if(data.data == false){
        icon = 'greenquestion';
    }
    return icon;
}

/**
 * Get the title based on the data
 */
function getTitle(data)
{
    if(data.green) {
        if(data.hostedby){
            title = 'Sustainably hosted by ' + data.hostedby;
        }else{
            title = 'is made sustainable through Cleanbits';
        }
    }else{
        if(data.data == false){
            // No data available, show help message
            title = " No data available yet for this country domain. Wanna help? Contact us through www.cleanbits.net";
        }else{
            // Data available, so show grey site
            title = data.url + ' is hosted grey';
        }
    }
    return title;
}

function startMessage()
{
    msg = "<img src='./images/green20x20.gif'/>&nbsp;<span id='thegreenwebtext'>The Green Web</span>";
    document.getElementById('thegreenweb').innerHTML = msg;
}

/**
 * Show the resulting icon based on the response
 */
function showIcon(resp)
{
    title = getTitle(resp);
    icon = getLinkImage(getIcon(resp),title);
      
    msg = icon + title;

    elem = document.getElementById('thegreenweb');
    if(elem){
        document.getElementById('thegreenweb').innerHTML = msg;
    }

    showToolbarIcon(resp.green);
}  

function showToolbarIcon(green)
{
    var itemArray = safari.extension.toolbarItems;
    for (var i = 0; i < itemArray.length; ++i) {
        var item = itemArray[i];
        if (item.identifier == "thegreenweb")
        {
            if(green){
                item.image = safari.extension.baseURI + "windmill.png";
            } else {
                item.image = safari.extension.baseURI + "toolbaricon.png";
            }
            
            localStorage.lasturl = url;
        }
    }
}

function doRequest()
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
        
        // Check if url is valid, not cached, so retrieve from api
        doApiCall(url);
        
    }else{
        startMessage();
    }
}

function doApiCall(url)
{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://api.thegreenwebfoundation.org/json-multi.php?url="+url, true);
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