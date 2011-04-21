/*
Copyright (C) 2011 Big Spaceship, LLC

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

To contact Big Spaceship, email info@bigspaceship.com or write to us at
45 Main Street #716, Brooklyn, NY, 11201.
*/

/*
usage ::

Accelerometer.shake(function(evt) {
	console.log(evt.shakeAmount); // minimum will be 20.
});

Accelerometer.tilt(function(evt) {
	console.log(evt); // evt.x is the amount tilted on the x, evt.y for y, evt.z for z
});

Accelerometer.enable(); // start listening for device motion
Accelerometer.disable(); // stop listening for device motion

---
chaining is supported as well:

Accelerometer.shake(function(evt) {
	console.log(evt.shakeAmount);	
}).tilt(function(evt) {
	console.log(evt);
}).enable();


*/

if(window['Accelerometer']) return;

var Accelerometer = new(function() {
	var _self = this;
	var _tiltListeners = [];
	var _shakeListeners = [];
	var _updateInterval;

	var _x1 = 0;
	var _y1 = 0;
	var _z1 = 0;
	var _x2 = 0;
	var _y2 = 0;
	var _z2 = 0;

	this.shakeSensitivity = 20;
	
	this.shake = function($f) {
		_shakeListeners.push($f);
		return _self;
	}
	
	this.tilt = function($f) {
		_tiltListeners.push($f);
		return _self;
	}

	this.enable = function() {
		if (typeof window.DeviceMotionEvent == 'undefined') alert("accelerometer.js :: No Shake Event on this platform");
		else {
			_self.disable();
			window.addEventListener("devicemotion",_onDeviceMotion,false);
			_updateInterval = setInterval(_update,150);
		}

		return _self;
	}
	
	this.disable = function() {
		_x2 = 0;
		_y2 = 0;
		_z2 = 0;

		window.removeEventListener("devicemotion",_onDeviceMotion);
		clearInterval(_updateInterval);
		
		return _self;
	}
	
	function _onDeviceMotion($evt) {
        _x1 = $evt.accelerationIncludingGravity.x;
        _y1 = $evt.accelerationIncludingGravity.y;
        _z1 = $evt.accelerationIncludingGravity.z;

		if(_x2 == 0 && _y2 == 0 && _z2 == 0) {
			_x2 = _x1;
			_y2 = _y1;
			_z2 = _z2;
		}
	}
	
	function _update() {
		var xChange = _x1-_x2;
		var yChange = _y1-_y2;		
		var zChange = _z1-_z2;
		var change = Math.abs(xChange + yChange + zChange);

		_dispatch(_tiltListeners,{x:xChange,y:yChange,z:zChange});

		if(change > _self.shakeSensitivity) {
			_dispatch(_shakeListeners,{shakeAmount:change});
		}

		
		_x2 = _x1;
		_y2 = _y1;
		_z2 = _z1;
	}
	
	function _dispatch($listeners,$args) {
		for(var i=0;i<$listeners.length;i++) {
			$listeners[i]($args);
		}
	}
})();