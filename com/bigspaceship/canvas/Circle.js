

CanvasBasil.include('DisplayObject.js');

bCanvas.Circle          =   function CanvasCircle($params){

    // private vars
    var _self           =   this;
    var _params         =   $params;

    // public vars
    this.name           =   "Canvas.Circle";
    this.changed        =   true;

    // properties
    this.strokeStyle    =   '';
    this.fillStyle      =   '';
    this.radius         =   0;
    this.image          =   '';
    this.height         =   $params.radius * 2;
    this.width          =   $params.radius * 2;

    /**
     * setValue
     *
     * Sets a value in this object.
     * Is useful so we can set the _hasChanged
     * property. This eventually lets us skip over
     * this object entirely when it's not in use
     *
     * @param   $key    String of the property to change
     * @param   $value  Value to set
     * @return  Class<Object>
     */
    this.set            =   function setValue($key, $value){
        this[$key]      =   $value;
        this.changed    =   true;

        // chain
        return this;
    };

    /**
     * drawCircle
     *
     * Drawing a circle.
     *
     */
    this.draw           =   function draw(){
        // ignore drawing if it hasn't changed
        if(!this.changed)
            return false;

        // set styles
        if(this.strokeStyle) bCanvas.context.strokeStyle = this.strokeStyle;
        if(this.fillStyle) bCanvas.context.fillStyle = this.fillStyle;

        // draw
        bCanvas.context.beginPath();
        bCanvas.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        bCanvas.context.closePath();
        if(this.strokeStyle) bCanvas.context.stroke();
        if(this.fillStyle) bCanvas.context.fill();

        // unset has changed
        this.changed    =   false;

        // chaining
        return this;
    };

    /**
     * getBounds
     *
     * Gets bounds of this object
     *
     * @return  Object
     */
    this.getBounds      =   function getBounds(){
        return {
            x:      this.x - this.radius,
            y:      this.y - this.radius,
            xw:     this.x + this.height,
            yh:     this.y + this.width,
            h:      this.height,
            w:      this.width
        };
    };

    // extend this object with what was set
    $.extend(this, _params);
};
