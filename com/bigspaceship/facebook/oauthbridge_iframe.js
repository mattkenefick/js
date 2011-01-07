// sk: this script assumes you are using an iframe to embed your app on facebook
if(!com) var com = {};
if(!com.bigspaceship) com.bigspaceship = {};
if(!com.bigspaceship.api) com.bigspaceship.api = {};
if(!com.bigspaceship.api.facebook) com.bigspaceship.api.facebook = {};

if(!com.bigspaceship.api.facebook.OAuthBridge)
{
	com.bigspaceship.api.facebook.OAuthBridge = {};
	com.bigspaceship.api.facebook.OAuthBridge._swfId = 'swfContainer';
	com.bigspaceship.api.facebook.OAuthBridge._swfDiv = 'swfContainer';

	com.bigspaceship.api.facebook.OAuthBridge.setSwfId = function( $id )
	{
		com.bigspaceship.api.facebook.OAuthBridge._swfId = $id;
	}

	com.bigspaceship.api.facebook.OAuthBridge.setSwfDiv = function( $id )
	{
		com.bigspaceship.api.facebook.OAuthBridge._swfDiv = $id;
	}

	com.bigspaceship.api.facebook.OAuthBridge.login = function( $url )
	{
		props = "width=670,height=425";
		signinWin = window.open( $url, "facebookOAuth", props );
		signinWin.focus();
		return false;
	}

	com.bigspaceship.api.facebook.OAuthBridge.confirmFacebookConnection = function( $session )
	{
		if( $session != '' )
		{
			var flash = document.getElementById( com.bigspaceship.api.facebook.OAuthBridge._swfDiv );
			var json = eval('(' + $session + ')');
			flash.handleFacebookLogin( json );
		}
	}

	com.bigspaceship.api.facebook.OAuthBridge.logout = function()
	{
	}
}