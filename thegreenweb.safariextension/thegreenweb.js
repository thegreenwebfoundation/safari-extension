/* 
 * Safari extension
 * 
 * @author Arend-Jan Tetteroo <aj@cleanbits.net>
 * @copyright Cleanbits/The Green Web Foundation 2010-2011
 */
// If tab switched or focused, message the extension bar to act
var tabInFocus = function( event )
{
    safari.self.tab.dispatchMessage("tabFocusSwitched","");
}

window.addEventListener("focus", tabInFocus, false);
window.addEventListener("load", tabInFocus, false);