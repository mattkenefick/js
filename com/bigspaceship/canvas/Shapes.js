

CanvasBasil.include('DisplayObject.js');

bCanvas.Shapes           =   function CanvasShapes(){

    // private vars
    var _self           =   this;

    // public vars
    this.name           =   "Canvas.Shapes";

    // properties
    this.strokeStyle    =   '';
    this.fillStyle      =   '';
    this.radius         =   0;
    this.image          =   '';


    /**
     * drawCircle
     *
     * Drawing a circle.
     *
     */
    this.drawCircle     =   function drawCircle($p){
        $.extend(this, $p);

        // set styles
        if(this.strokeStyle) bCanvas.context.strokeStyle = this.strokeStyle;
        if(this.fillStyle) bCanvas.context.fillStyle = this.fillStyle;

        // draw
        bCanvas.context.beginPath();
        bCanvas.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        bCanvas.context.closePath();
        if(this.strokeStyle) bCanvas.context.stroke();
        if(this.fillStyle) bCanvas.context.fill();

        // chaining
        return this;
    };

    /**
     * drawRect
     *
     * Drawing a rectangle.
     *
     */
    this.drawRect       =   function drawRect($p){
        $.extend(this, $p);

        // set styles
        if(this.fillStyle) bCanvas.context.fillStyle = this.fillStyle;

        // draw
        if(this.fillStyle) bCanvas.context.fillRect(this.x, this.y, this.width, this.height);

        // chaining
        return this;
    };

    /**
     * drawImage
     *
     * Draw image.
     *
     */
    this.drawImage      =   function drawImage($p){
        var _s          =   this;
        $.extend(this, $p);

        if(typeof(this.image) == 'string'){
            // load from URL
            var myImage = new Image();
            myImage.onload = function() {
                if(_s.rotation) bCanvas.context.rotate(_s.rotation);
                bCanvas.context.drawImage(myImage, this.x, this.y, this.width, this.height);
                if(_s.rotation) bCanvas.context.rotate(-_s.rotation);
            }
            myImage.src = this.image;
        }else{
            // load from reference
            bCanvas.context.drawImage(this.image, this.x, this.y, this.width, this.height);
        };

        // chaining
        return this;
    };


};
