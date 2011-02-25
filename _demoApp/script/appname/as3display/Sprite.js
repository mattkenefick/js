

function Sprite($a){
    var _self       =   this;

    this.name   =   "Sprite";

    this.buttonMode     =   false;
    this.graphics       =   null;
    this.hitArea        =   null;
    this.useHandCursor  =   false;


//  ==========================================================
//  ========= Public Methods
//  ==========================================================

    this.startDrag      =   function(){
        console.log("startDrag");
    };

    this.stopDrag       =   function(){
        console.log("stopDrag");
    };


//  ==========================================================
//  ========= Private Methods
//  ==========================================================


//  ==========================================================
//  ========= Constructor Methods
//  ==========================================================

    // Constructor function
    this.init           =   function init(){
        console.log("Constructing Sprite");
        this.super();
    };

    return Sage.extend(this, 'DisplayObject');
};

Sage.register(Sprite);
