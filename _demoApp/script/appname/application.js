// include
Sage.include(APP_JSURL + "as3display/MovieClip.js");
Sage.include(APP_JSURL + "as3display/Sprite.js");
Sage.include(APP_JSURL + "as3display/DisplayObject.js");
Sage.include(APP_JSURL + "core-application.js");


/**
* Application
*
* This is the main application file for DemoApp
* javascript.
*
* @version 1.0
* @author Matt Kenefick <m.kenefick@bigspaceship.com>
* @project Demo App
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

    this.attach             =   function attach(){
        Out.debug(_self, "Demo App Initiated.");
        Out.debug(_self, "Attaching from Application.");
        this.super();

        _self.testMovieClip();
        //_self.superTest();
    };

    this.testMovieClip      =   function testMovieClip(){
        var mc              =   new MovieClip();
            mc.init();

        console.log( mc.x );
    };

    this.superTest          =   function superTest(){
        this.super();
        alert("Called from Application");
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
    };

    Sage.register(this);
    return Sage.extend(this, 'CoreApplication', true);  // make this class extend CoreApplication
})();
