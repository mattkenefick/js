// include
//Sage.include(APP_JSURL + "library/templates.js");
//Sage.include(APP_JSURL + "views/main.js");


/**
* Application
*
* This is the main application file for MultiPress
* javascript.
*
* @version 5.0
* @author Matt Kenefick <m.kenefick@bigspaceship.com>
* @project MultiPress
*/

Application         =   new (function(){

    // private vars
    var _self               =   this;
    var _defaultController  =   'Main';

    // public vars
    this.name               =   'Application';


// ===========================================
// ===== CALLABLE
// ===========================================

    this.attach     =   function attach(){
        Out.debug(_self, "Demo App Initiated.");
    };


    /**
     * initialURI
     *
     * Checks if we have a hash we're starting out with on page load.
     * This would be considered the default page. It also handles hashed
     * page vs default page (no SWFAddress action). Requests AJAX
     * and pushes to the Views.Main
     *
     * @access public
     * @return void
     */
    this.initialURI     =   function initialURI(){
        var hash   =   SWFAddress.getValue().split('/');
            hash.shift();

        if(!hash[0]){
            // this is a direct request... like from google
            _self.controllerHistory.unshift(_defaultController);

            // send signal that we've changed
            SignalDispatcher.sendSignal('AJAX', 'CHANGE', {
                controller:         _defaultController,
                defaultController:  _defaultController
            });
        }else{
            // this is a hash request
            _requestAndReplacePage(hash);
        };
    };


    /**
     * getURI
     *
     * Returns an object with details about the URI. Helpful
     * for determining page controllers, query strings,
     * parameters, etc. Heavily used with SWFAddress.
     *
     * @access public
     * @return object
     */
    this.getURI         =    function getUri(){
        var url         =   window.location;
        var uri         =   url.toString().split(BASEURL).join('');
        var queryString =   uri.split('?');
            uri         =   queryString[0].split('/');
        if(uri[0]=='')
            uri[0]  =   'main';
        if(uri[0].indexOf('#') > -1)
            uri.shift();

        var cleanUri    =   uri.join('/').replace('-', '').split('/');

        return {
            queryString:    queryString[1] || null,
            uri:            uri,
            cleanUri:       cleanUri
        };
    };

    /**
     * replaceLinks
     *
     * Appends target_blank to external links, replaces internal
     * links with Hash tag function handlers, ignores .external links.
     *
     * @access public
     * @return void
     */
    this.replaceLinks   =   function replaceLinks(){
        var href, newHref, isLocal;

        $('a').each(function(){
            href    =   $(this).attr('href');
            isLocal =   (href != undefined && href.indexOf(BASEURL) > -1);

            if(isLocal){
                if(USEAJAX){
                    if(href.indexOf('#!/') > 1){}else{
                        if($(this).hasClass('external')){
                            // do nothing because it's external
                        }else{
                            $(this).click(function(){
                                if(ISLOADING){
                                    Out.debug( _self, "Click cancelled.");
                                    // cancel click if we're currently loading something
                                    return false;
                                };

                                var newHref;
                                    newHref     =   $(this).attr('href').split(BASEURL).join('');
                                    newHref     =   '!/' + newHref;

                                //window.location =   newHref;
                                window.location.hash    =   newHref;

                                return false;
                            });
                        }
                    }
                }
            }else{
                if(
                    href != undefined &&
                    href.substring(0, 1) != "#" &&
                    href.substring(0, 6) != "mailto"
                ){
                    $(this).attr('target', '_blank');
                };
            };
        });
    };


// ===========================================
// ===== SWFADDRESS
// ===========================================

    this.attachDeepLinking  =   function attachDeepLinking(){
        SWFAddress.onChange =   _swfAddress_CHANGE_handler;
    };

    function _swfAddress_CHANGE_handler($e){
        Out.debug(_self, "SWFAddress Change Handler");

        var hash   =   SWFAddress.getValue().split('/');
            hash.shift();

        // change page
        _requestAndReplacePage(hash);
    };


// ===========================================
// ===== WORKERS
// ===========================================

    /**
     * _requestAndReplacePage
     *
     * Makes a request to an "ajax" uri. Stores controller history,
     * requests data, and sends a signal that the new page has been
     * loaded. This signal is picked up by Views.Main which is then
     * distributed among screens.
     *
     * @access private
     * @return void
     */
    function _requestAndReplacePage($uri){
        if(ISLOADING){
            Out.error(_self, "Currently loading a page. Please wait...");
            return false;
        }else{
            Out.debug(_self, "Loading uri: " + $uri);
        };

        // set is loading
        ISLOADING       =   true;

        $.ajax({
            url:        BASEURL + 'ajax/' + $uri.join('/'),
            complete:   function ajax_complete($data){

                // get hash, capitalize first letter
                var hash   =   SWFAddress.getValue().split('/');
                    hash.shift();
                    hash[0]=   hash[0].charAt(0).toUpperCase() + hash[0].slice(1)

                if(!hash[0])
                    hash[0] =   _defaultController;

                // add to controller history
                _self.controllerHistory.unshift(hash[0]);

                // send signal that we've changed
                SignalDispatcher.sendSignal('AJAX', 'CHANGE', {
                    controller:         hash[0],
                    defaultController: _defaultController,
                    response:           $data.responseText
                });
            },
            error:      function ajax_error($hxr, $ajaxOptions, $thrownError){
                Out.error(_self, "Error trying to receive page: " + $uri);
            }
        });
    };


// ===========================================
// ===== HANDLERS
// ===========================================

// ===========================================
// ===== CONSTRUCTOR
// ===========================================

    // constructor should immediately happen on doc load
    this.construct  =   function construct(){

    };

    // this is fired after all elements have been constructed
    this.init       =   function init(){
        _self.attach();

        $('body').css('visibility', 'visible');
    };

    Sage.register(this);
    return this;
})();
