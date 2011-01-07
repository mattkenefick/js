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
 * LocationMapper
 *
 * @copyright       2009 Big Spaceship, LLC
 * @author
 * @version         1.0
 * @langversion     Javascript
 *
 */
function LocationMapper($id, $width, $height) {
    // Arguments
    if(!$id)    $id     =   '';

    // Private
    var _self           =   this;
    var _objects        =   [];
    var _trackObjects   =   [];

    // Public
    this.name           =  'LocationMapper';


// ===========================================
// ===== CALLABLE
// ===========================================

    this.attach         =   function attach(){
        SignalDispatcher.addSignal('LocationMapper', 'REQUEST_DISTANCE', _distance_REQUEST_handler);
    };

    this.track          =   function track($trackerObject){
        _trackObjects.push( $trackerObject );
    };

    this.findById       =   function findById($id){
        for(var i in _trackObjects){
            if(_trackObjects[i].id && _trackObjects[i].id == $id)
                return _trackObjects[i];
        };
    };


// ===========================================
// ===== GETTERS / SETTERS
// ===========================================

    function _distance_REQUEST_handler($e, $data, $args){
        var obj         =   _self.findById($args.id);
        var distances   =   [];

        foreach(_trackObjects, function($k, $v){
            if($v.id != obj.id){
                distances.push($v);
                distances[distances.length-1].distance  =   distance(new Point($args.x, $args.y), $v);
            };
        });

        if($args.callback)
            $args.callback(distances);
    };


// ===========================================
// ===== CONSTRUCTOR
// ===========================================

    _self.attach();

    return this;
}

Main.register({name: "LocationMapper"});
