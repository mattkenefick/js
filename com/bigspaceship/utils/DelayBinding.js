/**
 * DelayBinding by Big Spaceship. 2008-2010
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
 * DelayBinding
 *
 * @copyright       2010 Big Spaceship, LLC
 * @author          Matt Kenefick
 * @version         1.0
 * @langversion     Javascript
 *
 */

function DelayBinding() {

    // Private
    var _self           =   this;
    var _bindings       =   {};

    // Public
    this.name           =   'DelayBinding';
    this.debug          =   false;


// ===========================================
// ===== CALLABLE
// ===========================================

    /**
     * The <code>add</code> method
     *
     * @param  $type             String
     * @param  $delay            Number
     * @return _self
     */

    this.add            =   function add($type /*String*/, $delay /*Number*/){
        if(!$type || isNaN($delay)){
            Out.error(_self, "Arguments for adding a delay are incorrect.");
            return null;
        };

        // report
        Out.debug(_self, "Binding [" + $type + "]");

        // bind
        _bindings[$type]    =   {
            delay:          $delay,
            lastOccurrence: now()
        };

        return _self;
    }


    /**
     * The <code>remove</code> method
     *
     * @param  $type             String
     * @return _self
     */

    this.remove         =   function remove($type /*String*/){
        if(!$type){
            Out.error(_self, "Arguments for removing a delay are incorrect.");
            return null;
        };

        // report
        Out.debug(_self, "Removing binding [" + $type + "]");

        // bind
        delete _bindings[$type];

        return _self;
    }


    /**
     * The <code>check</code> method
     *
     * @param  $type             String
     * @return Boolean
     *
     */

    this.check          =   function check($type /*String*/){
        var binding     =   _bindings[$type];
        var _now        =   now();

        if(!binding){
            Out.error(_self, "Binding [" + $type + "] does not exist.");
            return null;
        };

        // check if the binding delay has passed
        if(binding.lastOccurrence + binding.delay < _now){
            // save new time
            _bindings[$type].lastOccurrence     =   _now;

            return true;
        };

        return false;
    };


// ===========================================
// ===== PRIVATE
// ===========================================

    function now(){
        return (new Date()).getTime();
    };


// ===========================================
// ===== HANDLERS
// ===========================================


// ===========================================
// ===== CONSTRUCTOR
// ===========================================


    return this;
}
