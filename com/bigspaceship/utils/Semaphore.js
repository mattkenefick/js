/**
 * Semaphore by Big Spaceship. 2008-2009
 *
 * To contact Big Spaceship, email info@bigspaceship.com or write to us at 45 Main Street #716, Brooklyn, NY, 11201.
 * Visit http://labs.bigspaceship.com for documentation, updates and more free code.
 *
 *
 * Copyright (c) 2008-2009 Big Spaceship, LLC
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

var SemaphoreEvent  =   {
    UNLOCK:     'semaphoreEventUnlock'
};

/**
 * Semaphore
 *
 * @copyright       2009 Big Spaceship, LLC
 * @author
 * @version         1.0
 * @langversion     Javascript
 *
 */
function Semaphore($id, $locks) {
    // Arguments
    if(!$id)    $id     = '';
    if(!$locks) $locks  = [];

    // Private
    var _self          =  this;
    var _id          =  '';
    var _locks       =  [];
    var _numlocks    =  0;
    var _numunlocked =  0;

    // Public
    this.name        =  'Semaphore';


// ===========================================
// ===== CALLABLE
// ===========================================

    this.openLock       =   function openLock($l) {
        _locks[$l]      =   true;
        _numunlocked++;

        if(_self.isUnlocked()) {
            // Fires an onUnlock event the very moment the final
            // condition has been met.  You can either subscribe
            // to this event or test the returned value.

            SignalDispatcher.sendSignal(
                'Semaphore',
                SemaphoreEvent.UNLOCK,
                {
                    id: _id
                }
            );

            return true;

        } else {
            return false;

        }
    }

    this.resetLocks     =   function resetLocks() {
        // Intended to be called prior to reuse of a semaphore instance.
        var l;

        foreach(_locks, function($k, $v){
            _locks[$k] = false;
        });

        _numunlocked = 0;
    }

    // WARNING: Functionality you should think twice about using, because
    // it may result in serious logic issues if you're not careful.  A
    // semaphore should be filled with a static number of locks and not
    // modified afterwards.  Locks can be opened, but all locks should be
    // reset simultaneously.
    this.addLock        =   function addLock($l) {
        _numlocks++;
        _locks[$l]      =   false;
    }

    this.removeLock     =   function removeLock($l) {
        // I'm not sure if it's a good idea to remove locks
        // but I guess I'll leave in the ability to do it.
        _numlocks--;
        foreach(_locks, function($k, $v){
            if($v == $l) {
                _locks.splice($k, 1);
            }
        });
    }

    this.closeLock      =   function closeLock($l) {
        // I'm not sure if it's a good idea to re-close locks either,
        // but I guess I'll leave in the ability to do it.  Just don't
        // do it often.
        _locks[$l]      =   false;
        _numunlocked--;
    }


// ===========================================
// ===== GETTERS / SETTERS
// ===========================================

    this.isLocked       =   function isLocked() {
        var v           =   false;
        var _retVal     =   true;

        foreach(_locks, function($k, $v){
            Out.debug($k + " : " + $v);
            if($v) {
                _retVal =   false;
            }
        });

        return _retVal;
    };

    this.isUnlocked     =   function isUnlocked() {
        var v           =   false;
        var _retVal     =   true;

        foreach(_locks, function($k, $v){
            if(!$v) {
                _retVal    =   false;
            }
        });

        return _retVal;
    };

    this.countLocked    =   function countLocked() {
        return _numlocks - _numunlocked;
    };

    this.countUnlocked  =   function countUnlocked() {
        return _numunlocked;
    };

    this.countLocks     =   function countLocks() {
        return _numlocks;
    };


// ===========================================
// ===== CONSTRUCTOR
// ===========================================

    (function(){
        var l  = $locks ? $locks : [];
        var i  = l.length;

        _id    = ($id ? $id : Math.round(Math.random() * 100000)).toString();
        _locks = [];

        if(i) while(i--) _self.addLock(l[i]);
    })();

    return this;
}
