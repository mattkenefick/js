//math
var MathUtils       =   new(function(){

    // private vars
    var _self         =   this;

    /**
     * This is used by the RandomDistant function
     * to execute random numbers with a forced distance
     * between each other.
     */
    var _randomLows =   [];

    // public vars
    this.name       =   "MathUtils";


    // CALLABLE

    this.random         =   function random($range) {
        return Math.floor(Math.random() * $range);
    };

    this.randomDistant  =   function randomDistant($name, $range, $distance) {
        if(!_randomLows[$name])
            _randomLows[$name]  =   [];

        var oldNumber, newNumber;

        newNumber   =   Math.round(Math.random()*$range);
        while(
            _randomLows[$name].indexOf(newNumber) < Math.min($distance, $range-1) &&
            _randomLows[$name].indexOf(newNumber) > -1
        ){
            newNumber   =   Math.round(Math.random()*$range);
        };

        _randomLows[$name].unshift(newNumber);

        return newNumber;
    };

    this.randomPointInRect = function randomPointInRect($x,$y,$width,$height){
        var p   =   {};
            p.x =   MathUtils.random($width-$x)+$x;
            p.y =   MathUtils.random($height-$y)+$y;
        return p;
    };

    this.randomPointInCircle = function randomPointInRect($x,$y,$r){
        //this returns a point that is denser near the center of the circle;
        var p       = {};
        var r       = Math.random()*$r;
        var angle   = Math.random()*(Math.PI*2);

        p.x     =   $x + r * Math.cos (angle);
        p.y     =   $y + r * Math.sin (angle);

        return p;
    };

    return this;
})();
