// root class

function DisplayObject(){
    var _self       =   this;

    this.name       =   "DisplayObject";

    // public vars
    this.alpha      =   0;
    this.height     =   0;
    this.mouseX     =   0;
    this.mouseY     =   0;
    this.parent     =   null;
    this.root       =   null;
    this.rotation   =   0;
    this.scaleX     =   0;
    this.scaleY     =   0;
    this.visible    =   true;
    this.width      =   0;
    this.x          =   0;
    this.y          =   0;
    this.z          =   0;


//  ==========================================================
//  ========= Public Methods
//  ==========================================================

    this.getBounds      =   function getBounds(){
        console.log("getBounds");
    };

    this.getRect        =   function getRect(){
        console.log("getRect");
    };

    this.globalToLocal  =   function globalToLocal(){
        console.log("globalToLocal");
    };

    this.hitTestObject  =   function hitTestObject(){
        console.log("hitTestObject");
    };


//  ==========================================================
//  ========= Private Methods
//  ==========================================================


//  ==========================================================
//  ========= Constructor Methods
//  ==========================================================

    // Constructor function
    this.init           =   function init(){
        console.log("Constructing DisplayObject" );
        _self.x         =   55;
    };

    return Sage.create(this);
};

Sage.register(DisplayObject);
