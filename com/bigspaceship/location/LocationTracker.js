/**
 * LocationTracker by Big Spaceship. 2008-2009
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

/**
 * LocationTracker
 *
 * @copyright       2009 Big Spaceship, LLC
 * @author
 * @version         1.0
 * @langversion     Javascript
 *
 */
function LocationTracker($id, $x, $y, $z, $value, $threshold) {
    // Arguments
    if(!$id)    $id     =   '';
    if(!$x)     $x      =   parseFloat($('#' + $id).css('left'));
    if(!$y)     $y      =   parseFloat($('#' + $id).css('top'));

    // Private
    var _self           =   this;
    var _id             =   $id;
    var _cbFunction     =   null;

    // Public
    this.id             =   $id;
    this.name           =  'LocationTracker';
    this.x              =   $x || 0;
    this.y              =   $y || 0;
    this.z              =   $z || 0;
    this.value          =   $value || $id + " - value";
    this.distanceThreshold  =   $threshold || 15;


// ===========================================
// ===== CALLABLE
// ===========================================

    this.requestPosition    =   function requestPosition($x, $y, $function){
        _cbFunction         =   $function;

        SignalDispatcher.sendSignal('LocationMapper', 'REQUEST_DISTANCE', {id: _id, x: $x, y: $y, callback: distanceRequest_callback});

        return true;
    };


// ===========================================
// ===== GETTERS / SETTERS
// ===========================================

    function distanceRequest_callback($distances){
        var canMove         =   true;

        foreach($distances, function($k, $v){
            if($v.distance < _self.distanceThreshold){
                canMove     =   false;
            };
        });

        if(canMove){
            _cbFunction();
        }
    };


// ===========================================
// ===== CONSTRUCTOR
// ===========================================


    return this;
}

Main.register({name: "LocationTracker"});
