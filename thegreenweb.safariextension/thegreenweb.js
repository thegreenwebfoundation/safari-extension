// If tab switched or focused, message the extension bar to act
var tabInFocus = function( event )
{
    safari.self.tab.dispatchMessage("tabFocusSwitched","");
}

window.addEventListener("focus", tabInFocus, false);