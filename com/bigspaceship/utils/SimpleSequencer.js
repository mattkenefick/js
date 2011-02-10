/**
 * SimpleSequencer by Big Spaceship. 2008-2010
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
 * SimpleSequencer
 *
 * @copyright       2010 Big Spaceship, LLC
 * @author          Daniel Scheibel, Stephen Koch
 * @version         1.0
 * @langversion     ActionScript 3.0
 * @playerversion   Flash 9.0.0
 *
 */
function SimpleSequencer($id) {
    // Arguments
    if(!$id) $id = '';

    // Private
    var _self                     =   this;
    var _animationSteps_array   =   [];
    var _countStep              =   0;
    var _id                     =   '';
    var _parallelActions_array  =   [];
    var _timer_dic              =   [];
    // var _sprite:Sprite = new Sprite();   ?

    // Public
    this.name       =   'SimpleSequencer';
    this.debug      =   false;


// ===========================================
// ===== CALLABLE
// ===========================================

    /**
     * The <code>traceSteps</code> method
     *
     */
    this.traceSteps     =   function traceSteps() {
        for(var i = 0; i < _animationSteps_array.length; i++){
            Out.debug('SimpleSequencer step: '+ _animationSteps_array[i].stepId+', '+_animationSteps_array[i].array);
        }
    };

    /**
     * The <code>addStep</code> method
     *
     * @param $stepId           Number
     * @param $target           EventDispatcher
     * @param $functionToCall   Function
     * @param $eventToListen    String
     * @param $args             Object
     *
     */
    this.addStep        =   function addStep($stepId, $target/*:EventDispatcher*/, $functionToCall/*:Function*/, $eventToListen/*:String*/, $args/*:Object=null*/) {
        var stepExists  =   false;
        var anim        =   {
            type:           'normal',
            target:         $target,
            functionToCall: $functionToCall,
            eventToListen:  $eventToListen,
            args:           $args
        };

        for(var i = 0; i < _animationSteps_array.length; i++){
            if(_animationSteps_array[i].stepId == $stepId){
                _animationSteps_array[i].array.push(anim);
                stepExists  =   true;
            }
        }

        if(!stepExists){
            _animationSteps_array.push({
                stepId: $stepId,
                array:  [anim]
            });
        }

        return _self;
    }

    /**
     * The <code>start</code> method starts the Sequence
     *
     */
    this.start      =   function start() {
        if(_animationSteps_array.length > 0){
            var i           =   0;
            var animObj     =   {};
            var len         = _animationSteps_array[_countStep].array.length;
            var functionToCall  =   null; // gets swapped out

            //sort array by stepId:
            _animationSteps_array.sortOn('stepId');
            /*_animationSteps_array.sort(
                function(a, b){
                    return (a.stepId > b.stepId) - (a.stepId < b.stepId);
                }
            );*/

            if(_self.debug)
                Out.debug('START: '+_id+', steps: '+_animationSteps_array.length+', _countStep: '+_countStep+', stepId: '+_animationSteps_array[_countStep].stepId );

            _parallelActions_array  =   [];

            for(i = 0; i < len; i++) {
                animObj     =   _animationSteps_array[_countStep].array[i];

                switch(animObj.type) {
                    case 'normal':
                        SignalDispatcher.addSignal(
                            animObj.target,
                            animObj.eventToListen,
                            _onAnimationComplete
                        );
                        //animObj.target.addEventListener(animObj.eventToListen, _onAnimationComplete);
                        break;
                }

                newSemLockId();
            }

            // set our function to call
            functionToCall  =   (typeof(animObj.functionToCall)=='string')? animObj.target[animObj.functionToCall] : animObj.functionToCall;

            // Optional Parameters Handling.
            for(i = 0; i < len; i++) {
                if(_self.debug)
                    Out.status("i: " + i);

                animObj     =   _animationSteps_array[_countStep].array[i];

                switch (animObj.type) {
                    case 'normal':
                        if(animObj.args && animObj.args.hasOwnProperty('delay')) {
                            if(_self.debug)
                                Out.status("delay: " + animObj.args.delay + ", _id = " + _id);

                            setTimeout(function(){
                                _onTimerEvent_handler(functionToCall, animObj.args.functionToCallParams);
                            }, animObj.args.delay);

                        } else {
                            if(_self.debug)
                                Out.debug("_id = " + _id + ", animObj = " + animObj);

                            if(animObj.args && animObj.args.hasOwnProperty('functionToCallParams')) {
                                functionToCall.apply(null, animObj.args.functionToCallParams);
                            }else{
                                functionToCall();
                            }
                        };
                        break;
                }
            }
        }else{
            _onComplete();
            if(_self.debug) {
                Out.debug('no steps added!');
            }
        }
    }


// ===========================================
// ===== PRIVATE
// ===========================================

    function _onTimerEvent_handler($functionToCall, $functionToCallParams){
        $functionToCall.apply($functionToCallParams);
    }

    function newSemLockId(){
        var lock;
        //do.. while loop to prevent double lockIds.
        do{
            lock = String(Math.random());
        }while(_parallelActions_array.indexOf(lock)>-1);

        _parallelActions_array.push(lock);

        if(_self.debug){
            Out.debug('newLockId: '+ lock+', countLocks: '+ _parallelActions_array.length);
        }
        return lock;
    }

    function _checkSemaphores(){
        if(_parallelActions_array.length < 1){
            if(_countStep + 1 < _animationSteps_array.length){
                _countStep+=1;
                _self.start();
            }else{
                _onComplete();
            }
        }
    }


// ===========================================
// ===== HANDLERS
// ===========================================

    function _onAnimationComplete($evt, $args, $data, $eventType){
        if(_self.debug){
            Out.debug('_onAnimationComplete: ' + $evt.target + ', _id: ' + _id);
        }

        // make sure this works
        SignalDispatcher.removeSignal(
            $evt.target,
            $evt.type,
            _onAnimationComplete
        );

        _parallelActions_array.pop();
        _checkSemaphores();
    }

    function _onComplete(){
        if(_self.debug){
            Out.debug('COMPLETE id: '+ _id);
        };

        SignalDispatcher.sendSignal($id, Event.COMPLETE);
    }


// ===========================================
// ===== CONSTRUCTOR
// ===========================================

    (function(){
        //creating an "unique" id for debugging reasons
        _id     =   $id + '_' + Math.random()*100;

        if(_self.debug){
            Out.debug('SimpleSequencer CONSTRUCTOR called, id:' +  _id);

            //_sprite.addEventListener(Event.ENTER_FRAME, _onEnterFrame_handler);
        }
    })();

    return this;
}
