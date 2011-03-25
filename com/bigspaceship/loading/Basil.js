/*
Copyright (C) 2010 Big Spaceship, LLC

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

To contact Big Spaceship, email info@bigspaceship.com or write to us at
45 Main Street #716, Brooklyn, NY, 11201.
*/

if(!window['Basil']){

    /**
    * Basil
    *
    * This is the global loader for all javascript files.
    *
    * Ex Usage:
    *   var YourSiteName    =   new Basil('site');
    *
    * @version  1.0
    * @author   Matt Kenefick <m.kenefick@bigspaceship.com>
    * @package  Big Spaceship / Loading
    */
    function Basil($name, $baseUrl, $cache){

        // private vars
        var _self           =   this;
        var _include        =   [];
        var _included       =   [];
        var _classes        =   [];
        var _extensions     =   {};
        var _isComplete     =   false;
        var _completeCallbacks  =   [];

        // public vars
        this.name           =   $name       || 'Basil';
        this.baseUrl        =   $baseUrl    || '';
        this.debug          =   'Out';      // Object, Out, true, false
        this.complete       =   null;       // fired on everything's completion.
        this.errors         =   [];
        this.cache          =   $cache != null ? $cache : true;


    // ===========================================
    // ===== CALLABLE
    // ===========================================

        /**
         * complete
         *
         * Add a method that will be fired when all
         * classes are constructed, extended, and inited.
         *
         * @param   $function   Function to be called
         * @return  _self<Object>
         */
        this.complete       =   function complete($function){
            alert("Adding");
            _completeCallbacks.push($function);
        };

        /**
         * forceComplete
         *
         * Allows user to force the complete event to be fired
         * instead of waiting for Basil to figure out whether
         * or not everything has downloaded.
         *
         * Should only be used if all files are compiled into
         * one.
         *
         * Ex:
         *  basilInstance.forceComplete();
         *
         * @access  public
         * @returns void
         */
        this.forceComplete  =   function forceComplete(){
            _includeComplete();
        };

        /**
         * flush
         *
         * Clears out all saved data and arrays related to loading.
         * This allows for a fresh start.
         *
         * Ex:
         *  basilInstance.flush();
         *
         * @access  public
         * @returns void
         */
        this.flush          =   function flush(){
            _debug("Flushing " + _self.name + " includes.");

            _include        =   [];
            _included       =   [];
            _classes        =   [];
            _isComplete     =   false;
            _self.complete  =   null;
            _self.errors    =   [];
        };

        /**
         * register
         *
         * Add class reference to `_classes` variable. This is required
         * if you want to construct, extend, and init a class. If you
         * don't, then you do not need this. This shouldn't be applied
         * to instantiable classes.
         *
         * Ex:
         *  basilInstance.register(_self);
         *
         * @param   $class  Object of containing class
         * @return  void
         */
        this.register       =   function register($class){
            _classes.push($class);
        };


    // ===========================================
    // ===== Class Creation
    // ===========================================

        /**
         * extend
         *
         * Will extend classA with classB. Copies over functions
         * that don't exist, rewrites functions that do exist and
         * inserts old function into it to create a mini anonymous
         * class where you can call `super`.
         *
         * Ex:
         *  return basilInstance.extend(_self, 'BaseObject');
         *  // or
         *  return basilInstance.extend(_self, 'ParentObject', true); // used for static classes
         *
         * @param   $classA     Usually _self. Class you want to extend into.
         * @param   $classB     String name of class you want to extend.
         * @return  Class<Object>
         */
        this.extend         =   function extend($classA, $classB, $isStatic){
            var _n          =   $classA.name;
            var _t, _c, _c1, _c2, _a1, _a2;

            _a1 =   _getObjectByString($classB);

            if(typeof(_a1) == 'function'){
                // insantiable extension
                _t  =   new _a1();

                // create supers for all elements inside of the class.
                for(var i in _t){
                    _c2 =   _t[i];
                    // class actually exists.. do work in here
                    if(typeof(_c2)=='function'){

                        if($classA[i]){
                            // this only fires when ClassB (under) has the same
                            // function as ClassA (above).. then we super
                            (function(){
                                var __1 =   _extend($classA[i], []);
                                var __2 =   _extend(_t[i], []);

                                // TODO: temp fix for when you passed an argument
                                // to a function that had a super, no arguments would
                                // be passed along with. this caps at 6
                                $classA[i]         =   function _extended_function($a1, $a2, $a3, $a4, $a5, $a6){
                                    return (function _superClass(){
                                        this.super  =   __2;
                                        return __1($a1, $a2, $a3, $a4, $a5, $a6);
                                    })($a1, $a2, $a3, $a4, $a5, $a6);
                                };
                            })();
                        }
                    };
                };

            }else if($isStatic){
                _debug("Delayed Extending " + $classA.name + " with " + $classB + '[class hasnt loaded yet]' );
                _extensions[$classA.name]   =   $classB;
                return $classA;

            }else if(typeof(_a1) == 'object'){
                // static class extension
                if(_a1==undefined){
                    _debug("Static class [" + $classB + "] doesn't exist yet. Cannot be extended.");
                }else{
                    var _t  =   _extend({}, _a1);
                    _debug("Extending static class");
                }
            }else{
                // error
                _debug("Class [" + $classB + "] doesn't exist. via@" + $classA['name']);
            };

            _t              =   _extend($classA, _t);
            _t.name         =   _n;
            if(_t['setSelf'])
                _t.setSelf(_t);

            return _t;
        };

        /**
         * create
         *
         * This is the function that shoudl be called at the
         * return of every class. It has optional arguments
         * for extending other classes and also for registering
         * to Basil.
         *
         * Ex:
         *  return basilInstance.create(_self);
         *  // or
         *  return basilInstance.create(_self, {register: true, extend: 'className'});
         *
         * @param   $class  Object containing class
         * @param   $params Object specifying register, extensions, ...
         * @return  Class<Object>
         */
        this.create         =   function create($class, $params){
            $params         =   $params || {};
            // use a registration
            _self.register($class);

            // extend
            if($params['extend']){
                return _self.extend($class, $params['extend'], true);
            };

            // simple create
            _lastClass  =   $class;
            return $class;
        };


    // ===========================================
    // ===== Inclusion
    // ===========================================

        /**
         * include
         *
         * Adds file to include to the project. Detects
         * duplicates and ignores their request to be
         * downloaded. Uses jQuery AJAX to download scripts.
         * Sends downloaded files to _include_COMPLETE_handler
         *
         * Ex:
         *  basilInstance.include('views/main.js');
         *
         * @param   $files              String of the URL. Auto prepends BaseURL.
         * @param   $flushAndCallback   A function callback when new basil is completed
         * @return  void
         */
        this.include        =   function include(){
            var i, fullFile, file, noCache;
            var args        =   arguments;

            // assume we want to reset the basil and
            // start over. good for on-demand loading
            // controllers and such
            if(typeof(args[args.length-1]) == 'function'){
                _self.flush();
                _self.complete  =   args[args.length-1];
            };

            // loop through possible args
            for(i = 0, l = args.length; i < l; i++){
                file        =   args[i];

                // dont execute if it's a function
                if(typeof(file) == 'function') continue;

                // include
                fullFile    =   _self.baseUrl + file;
                if(file.substr(0,4) == 'http')
                    fullFile    =   file;

                // ignore inclusion if it's already downloading
                if(_isDuplicateInclude(fullFile)){
                    _debug("Already included: " + file);
                    return;
                };

                // save
                _include.push(fullFile);
                _debug("Including: " + file);

                // should we allow cached files?
                noCache =   _self.cache == true ? '': '?c=' + Math.random();

                // fetch file.
                _ajax({
                    contentType:        'text/javascript',
                    dataType:           'script',
                    url:                fullFile + noCache,
                    complete:           _include_COMPLETE_handler,
                    error:              function($jqXHR, $text, $error){
                        _include_ERROR_handler(fullFile, $jqXHR, $text, $error);
                    }
                });
            };
        };

        /**
         * execute
         *
         * Used to call and instantiate individual scripts. This
         * is meant for packages of other classes. For example, an
         * ad that is lazily loaded to the DOM after the main site
         * loads. Destination file must have a "name" property matching
         * the global classname. Requested class gets "construct"
         * but not "init".
         *
         * Currently does not allow extensions from here. But the internal
         * basil applied can do that for the package itself.
         *
         * Ex:
         *  basilInstance.execute({
         *      url:    basilInstance.baseUrl + '../example/Application.js'
         *  });
         *
         * @param   $params     Only param now is "url"
         * @return  void
         */
        this.execute         =   function execute($params){
            _debug("Executing: " + $params.url);

            var baseUrl =   $params.url.split('/');
                baseUrl.pop();
                baseUrl =   baseUrl.join('/') + '/';

            _ajax({
                contentType:        'text/javascript',
                dataType:           'script',
                url:                $params.url,
                complete:           function execute_complete($data){

                    if(!$data){
                        _debug("Check that you are on a correct domain and do not need proxy.");
                        return;
                    };

                    var pattern =   /this\.name[^=]+[^'"]+.([^'"]+)['"]./;
                    var name    =   $data.responseText.match(pattern);
                        name    =   name[1];

                    _debug("Name should be: " + name);

                    // add basil and public methods
                    if(window[name]){
                        window[name].basil      =   new Basil(window[name].name);
                        window[name].basil.baseUrl      =   baseUrl;
                        window[name].assets     =   baseUrl + 'assets/';
                        window[name].getAsset   =   function getAsset($url){
                            return window[name].assets + $url;
                        };
                    };

                    // construct it
                    if(window[name] && window[name].construct){
                        window[name].construct($params);
                    }

                }
            });
        };


    // ===========================================
    // ===== WORKERS
    // ===========================================

        /**
         * _extend
         *
         * Early version of an extending function. Copies over functions
         * and properties from $classB to $classA if they don't already
         * exist in classA.
         *
         * @param   $classA Object class that needs extending
         * @param   $classB Object class that is extended
         * @return  Class<Object>
         */
        function _extend($classA, $classB){
            for(var i in $classB){
                if(!$classA[i])
                    $classA[i]  =   $classB[i];
            };

            return $classA;
        };

        /**
         * _ajax
         *
         * This adds scripts to the head, lets them execute, then removes
         * them from the header so it doesn't bulk up the page.
         *
         * @param   $params Object of parameters equivalent to that of jQuery's requirements
         * @return  void
         */
        function _ajax($params){
            // use jquery
           // if($ && $.ajax){ $.ajax($params);return;}

            // include to head
            var script,
                head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

            script          =   document.createElement( "script" );
            script.src      =   $params.url;
            script.async    =   "async";
            script.onload   =   script.onreadystatechange = function( _, isAbort ) {
                if(!script.readyState || /loaded|complete/.test(script.readyState)){
                    script.onload = script.onreadystatechange = null;

                    if(head && script.parentNode) {
                        head.removeChild(script);
                    };

                    script = undefined;

                    if (!isAbort) {
                        $params.complete();
                    }
                }
            };
            head.insertBefore( script, head.firstChild );
        };

        /**
         * _printErrors
         *
         * Debugs the list of possible errors collected.
         * This consists of files that were attempted to
         * be included but couldn't be found.
         *
         * Ex:
         *  _printErrors();
         *
         * @return  void
         */
        function _printErrors(){
            var i = 0, l = _self.errors.length;

            // start title
            _debug("");
            _debug("========================================================");
            _debug("                    " + l + " Errors found");
            _debug("========================================================");

            for(i; i < l; i++){
                _debug(_self.errors[i]);
                _debug("--------------------------------------------------------");
            }
        };

        /**
         * _debug
         *
         * Used by Basil to choose a debugger. Right now
         * accepts "Out" class, console, and none.
         *
         * Ex:
         *  _debug("Test debug message");
         *
         * @param   $message    Message to debug, could be an object.
         * @return  void
         */
        function _debug($message){
            switch(_self.debug){
                case 'Out':
                    if(window['Out']) Out.debug(_self, $message);
                    break;
                case true:
                    if(window['console']) console.log($message);
                    break;
            };
        };

        /**
         * _findClassByName
         *
         * Cycles through all registered classes and checks their
         * public `name` property to see if it is a match.
         *
         * @param   $name   String name of the class
         * @return  Class<Object>
         */
        function _findClassByName($name){
            for(var i in _classes){
                if(_classes[i] == $name){
                    return _classes[i];
                };
            };

            return window[$name];
        };

        /**
         * _getObjectByString
         *
         * Descends through the window and gets an object
         * by string. This also works with objects that
         * are using dot notation.
         *
         * @param   $str    String name of the reference
         * @param   $obj    Recursion. Object to start with
         * @param   $layer  Recursion. Depth
         * @return  Object
         */
        function _getObjectByString($str, $obj, $layer){
            var ret =   $obj || window;
            $layer  =   isNaN($layer) ? 0 : $layer;
            if(typeof($str)==='string') $str = $str.split('.');
            ret = ret[$str[$layer]];
            if($layer < $str.length-1) ret = _getObjectByString($str, ret, $layer+1);
            return ret;
        };

        /**
         * _isDuplicateInclude
         *
         * Checks to see if this file has been added already.
         *
         * Ex:
         *  if( _isDuplicateFile('myFile.js')) { ...
         *
         * @param   $file   String URL of file
         * @return  boolean
         */
        function _isDuplicateInclude($file){
            if(
                _include.indexOf($file) > -1
                || _included.hasOwnProperty($file)
                || _included.indexOf($file) > -1
            ){
                return true;
            };
            return false;
        };

        /**
         * _includeComplete
         *
         * Executes when all files have been downloaded. Sets a variable
         * that this has executed so we don't perform this process more
         * than once by accident. Sets to the Document.Ready if it hasn't
         * already fired. Otherwise, executes directly.
         *
         * Called by either forceComplete immediately.
         * Or by the complete handler with a timeout of 500ms.
         *
         * @return void
         */
        var drInt   =   null;
        function _includeComplete($boolean){

            if(_isComplete){
                clearInterval(drInt);
                drInt   =   null;
                return;
            };

            if(window['___DOCUMENT_LOADED']){
                _debug("Downloads complete... Waiting for document load.");
                _isComplete =   true;

                _extendAndInitiate();
                clearInterval(drInt);
                drInt   =   null;
            }else{
                if(!$boolean)
                var script      =   document.createElement( "script" );
                    script.text =   "___DOCUMENT_LOADED = true;";
                    document.body.appendChild(script);
                    document.body.removeChild(script);
                    drInt       =   setInterval(_includeComplete, 50, [true]);
            };
        };

        /**
         * _extendAndInitiate
         *
         * Goes through all registered classes and attempts to fire their
         * construct function, then tries to extend them, finally fires
         * their init function. When all is complete, it calls the optional
         * basilInstance.complete function as a callback.XMLHttpRequest
         *
         * @return void
         */
        function _extendAndInitiate(){
            var i, l, _obj;

            ___DOCUMENT_LOADED  =   true;

            // initial construct, we used two basically
            // because of the DOM
            for( i in _classes ){
                if(Array.prototype[i] != _classes[i] && typeof(_classes[i]) != 'function'){
                    if(!_classes[i].hasOwnProperty('construct') && !_classes[i].construct){
                        // no construct method
                    }else{
                        _classes[i].construct();
                    }
                }
            };

            // secondly we're going to extend our classes that asked for it
            for( i in _extensions ){
                for(ii in _classes){
                    if(_classes[ii].name == i){
                        _obj    =   _getObjectByString(_classes[ii].name);
                        _obj    =   _self.extend(_classes[ii], _extensions[i]);
                    };
                };
            };

            // we fire init first so that elements that need
            // to be constructed can be formed first.
            for( i in _classes ){
                if(Array.prototype[i] != _classes[i] && typeof(_classes[i]) != 'function'){
                    if(!_classes[i].hasOwnProperty('init') && !_classes[i].init){
                        // no init method
                    }else{
                        _classes[i].init();
                    }
                };
            };

            // fire complete function if it exists
            for(i = 0, l = _completeCallbacks.length; i < l; i++ )
                _completeCallbacks[i]();

            _debug("Classes construct/extend/init completed.");

            // show any errors
            if(_self.errors && _self.errors.length){
                _printErrors();
            };
        };


    // ===========================================
    // ===== HANDLERS
    // ===========================================

        /**
         * _include_COMPLETE_handler
         *
         * Fired by the AJAX event from `include`. Marks down
         * that a class has been downloaded and checks to see
         * if that means all of them have finished. If the
         * amount of classes downloaded matches that of the
         * requested.. it fires the _includeComplete function.
         *
         * @param   $e      Event from AJAX request
         * @return  void
         */
        function _include_COMPLETE_handler($e){
            var lastRequested           =   _include[_included.length];
            _included[lastRequested]    =   1;
            _included.push(lastRequested);

            setTimeout(function(){
                if( _included.length == _include.length && !_isComplete ){
                    _includeComplete();
                };
            }, 500);
        };

        function _include_ERROR_handler($file, $jqXHR, $text, $error){
            _self.errors.push([
                "\nFile: ",
                $file,
                "\nMessage: ",
                $jqXHR['status'] + ' ' + $error,
                "\n\n"
            ].join(''));
        };


    // ===========================================
    // ===== CONSTRUCTOR
    // ===========================================

        return this;
    };
};
