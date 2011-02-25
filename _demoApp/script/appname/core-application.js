// include


/**
* CoreApplication
*
* This is the main application file for DemoApp
* javascript.
*
* @version 1.0
* @author Matt Kenefick <m.kenefick@bigspaceship.com>
* @project Demo App
*/

function CoreApplication() {

    // private vars
    var _self               =   this;

    // public vars
    this.name               =   'CoreApplication';


// ===========================================
// ===== CALLABLE
// ===========================================

    this.attach             =   function attach(){
        Out.debug(_self, "Attaching from CoreApplication.");
    };

    this.superTest          =   function superTest(){
        alert("Called from CoreApplication");
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

    };

    return Sage.create(_self);
};

Sage.register(CoreApplication);
