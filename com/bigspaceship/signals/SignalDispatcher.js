/**
 * SignalDispatcher by Big Spaceship. 2008-2010
 *
 * To contact Big Spaceship, email info@bigspaceship.com or write to us at 45 Main Street #716, Brooklyn, NY, 11201.
 * Visit http://labs.bigspaceship.com for documentation, updates and more free code.
 *
 *
 * Copyright (c) 2008-2010 Big Spaceship, LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 **/


/**
 * SignalDispatcher
 *
 * @copyright       2010 Big Spaceship, LLC
 * @author          Matt Kenefick
 * @version         1.0
 * @langversion     Javascript
 *
 *
 *  Usage:
 *
 *  SignalDispatcher allows you to communicate indirectly with other parts
 *  of your code and attach multiple callbacks to an event.


    SignalDispatcher.addSignal('mouse', 'CLICK', _mouse_CLICK_handler,  { time: Date.now() });
    SignalDispatcher.addSignal('mouse', 'CLICK', _mouse_CLICK2_handler, { time: Date.now() });
    SignalDispatcher.addSignal('mouse', 'CLICK', _mouse_CLICK3_handler, { time: Date.now() });

    document.onclick    =   function onclick($e){

        // send to all 3 functions. They all fire with the $e attached.
        SignalDispatcher.sendSignal('mouse', 'CLICK', {event: $e});

    };

    function _mouse_CLICK_handler($e, $data, $args){
        var setByListener   =   $data;
        var setByEvent      =   $args;

        alert( "Fire 1 : " + setByListener.time + " : " + setByEvent.event.pageX );
    };

    function _mouse_CLICK2_handler($e, $data, $args){
        var setByListener   =   $data;
        var setByEvent      =   $args;

        alert( "Fire 2 : " + setByListener.time + " : " + setByEvent.event.pageX );
    };

    function _mouse_CLICK3_handler($e, $data, $args){
        var setByListener   =   $data;
        var setByEvent      =   $args;

        alert( "Fire 3 : " + setByListener.time + " : " + setByEvent.event.pageX );
    };
 *
 *
 */


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


var SignalDispatcher    =   new (function(){

    // private vars
    var _self           =   this;

    // public vars
    this.name           =   "SignalDispatcher";
    this.listenerChain  =   {};


// ===========================================
// ===== CALLABLE
// ===========================================

    /**
     * The <code>addSignal</code> method
     *
     * Creates a signal that we should listen for. You can assign it to
     * anything and provide additional arguments at set time that can be
     * retrieved by the callback functions.
     *
     * @access public
     * @param  $object   Mixed      Any type of reference/namespace.
     * @param  $type     String     Event name
     * @param  $listener Function   Callback function to fire.
     * @param  $data     Object     Optional object of data to pass to the callback
     * @return _self
     */

    this.addSignal      =   function addSignal($object /*Mixed*/, $type /*String*/, $listener /*Function*/, $data /*Object*/){
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

        return _self;
    };


    /**
     * The <code>hasSignal</code> method
     *
     * Check if a listener exists for a type of namespace.
     *
     * @access  public
     * @param   $object    Mixed    Namespace of listener
     * @param   $type      String   Event name
     * @return  boolean
     */

    this.hasSignal      =   function hasSignal($object, $type){
        var i;

        for( i in this.listenerChain[$type] ){
            if(this.listenerChain[$type][i].target == $object)
                return true;
        };

        return false;
    };


    /**
     * The <code>removeSignal</code> method
     *
     * Remove a listener from a namespace
     *
     * @access  public
     * @param   $object    Mixed    Namespace of listener
     * @param   $type      String   Event name
     * @param   $listener  Function Function to remove
     * @return  _self
     */

    this.removeSignal = function($object, $type, $listener){
        var i;

        if(!this.hasSignal($object, $type))
            return false;

        for(i = 0; i < this.listenerChain[$type].length; i++)
            if(this.listenerChain[$type][i].listener == $listener){
                if( this.listenerChain[$type].splice)
                    this.listenerChain[$type].splice(i, 1);
             }

        return _self;
    };


    /**
     * The <code>sendSignal</code> method
     *
     * Sends a signal to all listeners attached to that
     * namespace / event combination. Allows for arguments
     * at send time.
     *
     * @access  public
     * @param   $object    Mixed    Namespace of listener
     * @param   $type      String   Event name
     * @param   $args      Object   Additional args to send to callback
     * @return  boolean
     */

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
                if(Out)
                    Out.warning(_self, "No listener on: " + $object + "/" + $type + "/" + this.listenerChain[$type].name);
            }
        };

        return _self;
    };


    /**
     * The <code>attach</code> method
     *
     * You can add this class to the __proto__ of objects if you wish. Be careful
     * when iterating and for Browser compaitibilities
     *
     * @access  public
     * @param   $object    Object
     * @return  void
     */

    this.attach         =   function attach($object){
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