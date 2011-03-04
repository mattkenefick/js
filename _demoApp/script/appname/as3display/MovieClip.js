

function MovieClip(){
    var __self      =   this;

    this.name       =   'MovieClip';

    this.currentFrame   =   0;
    this.currentLabel   =   '';
    this.currentLabels  =   [];
    this.enabled        =   true;
    this.framesLoaded   =   0;
    this.totalFrames    =   0;


//  ==========================================================
//  ========= Public Methods
//  ==========================================================

    this.gotoAndPlay        =   function gotoAndPlay(){
        console.log("gotoAndPlay");
    };

    this.gotoAndStop        =   function gotoAndStop(){
        console.log("gotoAndStop");
    };

    this.nextFrame          =   function nextFrame(){
        console.log("nextFrame");
    };

    this.play               =   function play(){
        console.log("play");
    };

    this.prevFrame          =   function prevFrame(){
        console.log("prevFrame");
    };

    this.stop               =   function stop(){
        console.log("stop");
    };


//  ==========================================================
//  ========= Private Methods
//  ==========================================================


//  ==========================================================
//  ========= Constructor Methods
//  ==========================================================

    // Constructor function
    this.init               =   function init(){
        this.super();
        this.x =   50;
    };

    return Sage.extend(this, 'Sprite');
};

Sage.register(MovieClip);
