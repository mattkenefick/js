/**
* BigLoader
*
* This is a file loader for project assets.
*
* @version 1.0
* @author Matt Kenefick <m.kenefick@bigspaceship.com>
* @project Star Wars
*/

if( !BigLoader ){

    function BigLoader(){

        // private vars
        var _self           =   this;
        var _loaderActive   =   false;
        var _itemsToLoad    =   [];
        var _loadedItems    =   {};
        var _loadedCount    =   0;
        var _completeCallback   =   null;

        // public vars
        this.name           =   'BigLoader';


// ================================================
// ======== CALLABLE
// ================================================

        this.add            =   function add($url, $id, $type){
            if(_loaderActive){ Out.error(_self, "You can't add anything after load has started"); return; }
            if($id == null) $id = $url;

            // make sure we have a proxy if necessary
            $url            =   _proxify($url);

            _itemsToLoad.push({
                url:        $url,
                id:         $id,
                type:       $type
            });
        };

        this.start          =   function start($callback){
            var i = 0;

            // callback handlers for completed items
            _completeCallback   =   $callback;
            _loaderActive       =   true;

            for(i = 0; i < _itemsToLoad.length; i++){
                _loadFile( _itemsToLoad[i] );
            };
        };

        this.reset          =   function reset(){
            _itemsToLoad    =   [];
            _loadedCount    =   0;
            _loadedItems    =   {};
            _completeCallback   =   null;
        };


// ================================================
// ======== WORKERS
// ================================================

        function _loadFile($fileObject){
            var fileObject  =   $fileObject;

            $.ajax({
                type:       'GET',
                url:        fileObject.url,
                complete:   function($data){
                    _loadedCount ++;
                    _loadedItems[fileObject.id] =   $data.responseText || $data;

                    _checkLoadedComplete();
                }
            });
        };

        function _checkLoadedComplete(){
            if(_itemsToLoad.length == _loadedCount){
                //_self.reset();

                _loaderActive   =   false;

                if(_completeCallback)
                    _completeCallback(_self);
            };
        };

        function _proxify($url){
            var url =   $url;

            if(url.indexOf('http://') > -1 ){
                url =   BASEURL + "proxy.php?file=" + url;

            }else{
                url =   BASEURL + url;
            };

            return url;
        };

        return this;
    };

}
