/**
 * Safari extension
 * 
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 * @copyright Cleanbits/The Green Web Foundation 2010-2014
 */
// If tab switched or focused, message the extension bar to act
var tabInFocus = function( event )
{
    safari.self.tab.dispatchMessage("tabFocusSwitched","");
}

window.addEventListener("focus", tabInFocus, false);
window.addEventListener("load", tabInFocus, false);