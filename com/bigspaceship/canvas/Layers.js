
bCanvas.Layers          =   function CanvasLayers(){

    // private vars
    var _self           =   this;

    // public vars
    this.name           =   "Canvas.Layers";

    // properties
    this.stack          =   [];


    this.add            =   function add($ref){
        // add reference to top of stack
        this.stack.unshift($ref);

        // chain
        return this;
    };

    this.remove         =   function remove($index){
        $index          =   $index || 0;
        if($index < this.stack.length)
            return;
        this.stack.splice($index,1);

        // chain
        return this;
    };

};
