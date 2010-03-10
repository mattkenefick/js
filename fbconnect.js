var fbconnect = {};
	fbconnect._apiKey = "232aead363cf6cb11abff4d4669d0f41";
	fbconnect._xdReceiver = "xd_receiver.html";
	fbconnect._swfName = "site";
	fbconnect._isReady = false;
	fbconnect._initvars = {};
//	fbconnect._initvars = { permsToRequestOnConnect: "email,offline_access" };

	// contstructor
	fbconnect.initialize = function()
	{
		FB.init(this._apiKey, this._xdReceiver,this._initvars);
		this._isReady = true; 
	}

	// called from flash
	fbconnect.isReady = function() { return this._isReady; }
	fbconnect.login = function() { FB.Connect.requireSession(function() { fbconnect._onLogin() },function() { fbconnect._onCancelLogin() }); }
	fbconnect.logout = function() { FB.Connect.logout(); }

	// communicate with flash
	fbconnect._onLogin = function() { this._getSWFById(this._swfName).onFacebookLogin(); }
	fbconnect._onCancelLogin = function() { this._getSWFById(this._swfName).onFacebookLoginCancel(); }
	
	fbconnect._getSWFById = function($id) { return window[$id] ? window[$id] : document[$id]; }

jQuery(document).ready(function($) { fbconnect.initialize(); });
