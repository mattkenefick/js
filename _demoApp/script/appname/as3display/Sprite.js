

function Sprite($a){
    var __self          =   this;

    this.name           =   "Sprite";

    this.buttonMode     =   false;
    this.graphics       =   null;
    this.hitArea        =   null;
    this.useHandCursor  =   false;
    this.x              =   100;


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
    this._init           =   function sprite_init(){
        console.log("Constructing Sprite");
        this.super();
        this.x          =   40;
    };

    return Sage.extend(this, 'DisplayObject');
};

Sage.register(Sprite);
