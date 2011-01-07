var Signal          =   {
    COMPLETE:           "signalComplete",
    READY:              "signalReady",
    NAVIGATE:           "signalNavigate"
};

var MouseSignal     =   {
    CLICK:              "signalMouseClick",
    ROLLOVER:           "signalMouseRollover",
    ROLLOUT:            "signalMouseRollout",
    MOUSEOVER:          "signalMouseMouseover",
    MOUSEOUT:           "signalMouseMouseout",
    DOUBLECLICK:        "signalMouseDoubleClick"
};


 var SignalDispatcher   = new (function(){
    this.listenerChain  =   {};

    this.addSignal = function($object, $type, $listener, $data){
        var listenerObj =   {};

        // save data
        $data   =   $data || {};

        // we can't use this listener
        if(!$listener instanceof Function)
            throw { message : "Listener isn't a function" };

        // set listener object
        listenerObj     =   {
            target:     $object,
            type:       $type,
            listener:   $listener,
            data:       $data
        };

        // add event
        if(!this.listenerChain[$type])
            this.listenerChain[$type] = [listenerObj];
        else
            this.listenerChain[$type].push(listenerObj);
    };

    this.hasSignal = function($object, $type){
        var i;

        for( i in this.listenerChain[$type] ){
            if(this.listenerChain[$type][i].target == $object)
                return true;
        };

        return false;
    };

    this.removeSignal = function($object, $type, $listener){
        var i;

        if(!this.hasSignal($object, $type))
            return false;

        for(i = 0; i < this.listenerChain[$type].length; i++)
            if(this.listenerChain[$type][i].listener == $listener){
                if( this.listenerChain[$type].splice)
                    this.listenerChain[$type].splice(i, 1);
             }

    };

    this.sendSignal = function($object, $type, $args){
        var i;

        if(!this.hasSignal($object, $type))
             return false;

        for(i in this.listenerChain[$type]){

            if(this.listenerChain[$type] && this.listenerChain[$type][i] && this.listenerChain[$type][i].listener){
                this.listenerChain[$type][i].listener(
                    this.listenerChain[$type][i],
                    this.listenerChain[$type][i].data,
                    $args,
                    this.listenerChain[$type][i].type
                );
            }else{
                Out.warning("No listener on: " + $object + "/" + $type + "/" + this.listenerChain[$type].name);
            }
        };

    };

    this.test       =   function(){
        alert('testing');
    };

    this.attach     =   function($object){
        $object.__proto__.addSignal      =   function addSignal($type, $listener, $data){
            return SignalDispatcher.addSignal(this, $type, $listener, $data);
        };

        $object.__proto__.hasSignal      =   function hasSignal($type){
            return SignalDispatcher.hasSignal(this, $type);
        };

        $object.__proto__.removeSignal   =   function removeSignal($type){
            return SignalDispatcher.hasSignal(this, $type);
        };

        $object.__proto__.sendSignal     =   function sendSignal($type, $args){
            return SignalDispatcher.sendSignal(this, $type, $args);
        };
    };
})();




// Testing...
/*
var bob = new (function(){this.name='bob!';return this;})();

bob.addSignal('Mouse', function($e, $data, $args){

    alert($data.myData);
    alert( $args.ok );

}, {myData: 'whats up'} );


bob.sendSignal( 'Mouse' );
*/
