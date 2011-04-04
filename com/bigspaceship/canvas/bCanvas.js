
bCanvas                =   new(function bCanvasCore(){

    // private vars
    var _self               =   this;
    var _intervalDraw       =   null;
    var _runBefore          =   [];
    var _runAfter           =   [];
    var _executions         =   0;
    var _elementsDrawn      =   0;

    // public vars
    this.name               =   "bCanvas";
    this.context            =   null;
    this.canvasReference    =   null;
    this.layers             =   null;

    /**
     * layerInBounds
     *
     * Checks to see if a layer is within the bounds
     * of Canvas and if we should bother drawing it
     *
     * @param   $layer  Object that would be drawn
     * @return  boolean
     */
    this.layerInBounds      =   function layerInBounds($layer){
        var _bounds         =   $layer.getBounds();
        var _cr             =   _self.canvasReference;

        if( (_bounds.xw > 0 && _bounds.x < _cr.width) &&
            (_bounds.yh > 0 && _bounds.y < _cr.height) ){
            return true;
        };

        return false;
    };

    /**
     * setCanvas
     *
     * Set reference to the canvas on the DOM via
     * an ID. Must be an ID reference.
     *
     * @param   $canvas     String reference of target ID attr
     * @return  Context<Canvas>
     */
    this.setCanvas          =   function setCanvas($canvas){
        this.canvasReference    =   document.getElementById($canvas);
        this.context            =   this.canvasReference.getContext('2d');
        return this.context;
    };

    /**
     * clear
     *
     * Clear canvas
     *
     * @return void
     */
    this.clear              =   function(){
        _self.canvasReference.width =   _self.canvasReference.width;
    };

    /**
     * drawAll
     *
     * Loops through layer stack from bottom to top
     * and draws layers to canvas.
     *
     * @return void
     */
    this.drawAll            =   function(){
        // clear
        _self.clear();
        _elementsDrawn      =   0;

        // execute run before
        if(_runBefore.length)
            _runBefore.forEach(function($a, $i){
                $a(_executions);
            });

        // draw
        layer   =   _self.layers.current( _self.layers.count() - 100 );
        do{
            // draw
            if(layer['draw'] && _self.layerInBounds(layer)){
                _elementsDrawn ++;
                layer['draw']();
            }else{
                // did not draw element
            }

        }while(layer = _self.layers.next());

        // execute run after
        if(_runAfter.length)
            _runAfter.forEach(function($a, $i){
                $a(_executions);
            });

        // save execution count
        _executions ++;
    };

    /**
     * run
     *
     * Starts the drawing interval
     *
     * @return void
     */
    this.run                =   function run($speed){
        $speed              =   $speed || 20;
        _intervalDraw       =   setInterval(_self.drawAll, $speed);
    };

    /**
     * runBefore
     *
     * Adds function that gets fired before the draw statement
     *
     * @return void
     */
    this.runBefore          =   function runBefore($function){
        _runBefore.unshift($function);
    };

    /**
     * runAfter
     *
     * Adds function that gets fired after the draw statement
     *
     * @return void
     */
    this.runAfter           =   function runAfter($function){
        _runAfter.unshift($function);
    };

    /**
     * stop
     *
     * Stops the drawing interval
     *
     * @return void
     */
    this.stop               =   function stop(){
        clearInterval(_intervalDraw);
        _intervalDraw       =   null;
    };

    /**
     * debug
     *
     * Returns debug objects
     *
     * @return Object
     */
    this.debug              =   function debug(){
        return {
            executions:     _executions,
            layers:         _self.layers.count(),
            runBeforeCount: _runBefore.length,
            runAfterCount:  _runAfter.length,
            layersDrawn:    _elementsDrawn,
            layersNotDrawn: _self.layers.count() - _elementsDrawn
        };
    };


    // ================================================
    // ========= Construct
    // ================================================

    this.construct          =   function construct(){};
    this.init               =   function init(){
        this.layers         =   new bCanvas.Layers();
    };

    // return.
    return CanvasBasil.create(_self, {register: true});
})();









/**
 * Layers [bCanvas.layers]
 *
 * Allows for adding, removing, traversing, and manipulating
 * layers in the draw sequence
 *
 */
bCanvas.Layers          =   function CanvasLayers(){

    // private vars
    var _self           =   this;
    var _lastLayerAccessed  =   0;          // used for traversing. saves index of last used layer.

    // public vars
    this.name           =   "Canvas.Layers";

    // properties
    this.stack          =   [];


    // ================================================
    // ========= Traversing Layers
    // ================================================

    this.setPointer     =   function setPointer($index){
        switch($index){
            case 'top':
            case 'first':   $index  =   this.stack.length-1;
                break;
            case 'bottom':
            case 'last':    $index  =   0;
                break;
        };

        _setLastAccessed($index);
    };

    this.current        =   function current($index){
        $index          =   $index != null ? $index : _lastLayerAccessed;

        return this.get($index);
    };

    this.first          =   function first(){
        return this.get(this.stack.length-1);
    };

    this.next           =   function next(){
        return this.get(_lastLayerAccessed + 1);
    };

    this.previous       =   function previous(){
        return this.get(_lastLayerAccessed - 1);
    };

    this.last           =   function last(){
        return this.get(0);
    };

    this.get            =   function get($index){
        $index          =   $index || 0;

        return this.stack[_setLastAccessed($index)];
    };


    // ================================================
    // ========= Manipulating Layers
    // ================================================

    this.add            =   function add($ref, $at){
        if(!isNaN($at)){
            this.stack.splice($at, 0, $ref);
        }else{
            $at =   this.stack.length;

            // add reference to top of stack
            this.stack.push($ref);
        }

        // chain
        return this;
    };

    this.remove         =   function remove($index){
        $index          =   $index || 0;
        if($index >= this.stack.length)
            return this;

        // remove object
        this.stack.splice($index,1);

        // chain
        return this;
    };


    // ================================================
    // ========= Stats / Properties
    // ================================================

    this.count          =   function count(){
        return this.stack.length;
    };


    // ================================================
    // ========= Workers
    // ================================================

    function _setLastAccessed($index){
        _lastLayerAccessed  =   $index;
        return $index;
    };


    // ================================================
    // ========= Native Getters / Setters
    // ================================================

    this.__defineGetter__('length', function(){
        return this.stack.length;
    });
};
