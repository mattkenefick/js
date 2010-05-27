// jk: this script assumes you are using the Facebook OAuth API and have already called FB.init on your site.
if(!com) var com = {};
if(!com.bigspaceship) com.bigspaceship = {};
if(!com.bigspaceship.api) com.bigspaceship.api = {};
if(!com.bigspaceship.api.facebook) com.bigspaceship.api.facebook = {};

if(!com.bigspaceship.api.facebook.OAuthBridge) {
	com.bigspaceship.api.facebook.OAuthBridge = {};
	com.bigspaceship.api.facebook.OAuthBridge.swfId = 'site';	// jk: default swfId is site.

	com.bigspaceship.api.facebook.OAuthBridge.setSwfId = function($id) {
		com.bigspaceship.api.facebook.OAuthBridge.swfId = $id;
		console.log(1);
	}

	com.bigspaceship.api.facebook.OAuthBridge.initialize = function() {
		FB.getLoginStatus(function(response) {
			  if (response.session) {
					// jk: there is a bug in the current getLoginStatus method Facebook JavaScript SDK -- it doesn't return permissions as expected. the best we can do is manually ask.
					FB.api({
				            method : 'fql.query',
				            query : 'SELECT status_update,photo_upload,sms,offline_access,email,create_event,rsvp_event,publish_stream,read_stream,share_item,create_note,bookmarked,tab_added FROM permissions WHERE uid=' + FB.getSession().uid
			        },
			        function(response) {
						var perms = [];
						for(perm in response[0]) {
							if(response[0][perm] == '1') perms.push(perm);
						}

						$("#" + com.bigspaceship.api.facebook.OAuthBridge.swfId)[0].handleFacebookLogin(FB._apiKey,FB.getSession(),perms.join(','));
			        });
				}
		});
	}

	com.bigspaceship.api.facebook.OAuthBridge.login = function($opts) {
		if(!$opts) $opts = {};

		FB.login(function(response) {
			if(response.session) {
				$("#" + com.bigspaceship.api.facebook.OAuthBridge.swfId)[0].handleFacebookLogin(FB._apiKey,FB.getSession(),response.perms);
			} else {
				$("#" + com.bigspaceship.api.facebook.OAuthBridge.swfId)[0].handleFacebookLoginCancel();
			}
		},$opts);
	}

	com.bigspaceship.api.facebook.OAuthBridge.logout = function() {
		FB.logout(function(response) {});
		$("#" + com.bigspaceship.api.facebook.OAuthBridge.swfId)[0].handleFacebookLogout();
	}
}