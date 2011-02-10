/*
Copyright (C) 2010 Big Spaceship, LLC

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

var DeviceType      =   new(function(){

    // private vars
    var _self         =   this;

    // public vars
    this.name       =   "DeviceType";

// ===========================================
// ===== GETTERS / SETTERS
// ===========================================

    this.isiPad     =   function isiPad(){
        var retVal  = navigator.userAgent.match(/iPad/i) != null;
        return retVal;
    };

    this.isPod      =   function isPod(){
        var retVal  = navigator.userAgent.match(/iPod/i) != null;
        return retVal;
    };

    this.isiPhone   =   function isiPhone(){
        var retVal  = navigator.userAgent.match(/iPhone/i) != null;
        return retVal;
    };

    this.isBlackberry   =   function isBlackberry(){
        var retVal  = navigator.userAgent.match(/isBlackberry/i) != null;
        return retVal;
    };

    this.isAndroid  =   function isAndroid(){
        var retVal  = navigator.userAgent.match(/Android/i) != null;
        return retVal;
    };

    this.isIE       =   function isIE(){
        var retVal  = navigator.userAgent.match(/MSIE/i) != null;
        return retVal;
    };

    this.isGecko    =   function isGecko(){
        var retVal  = navigator.userAgent.match(/Gecko/i) != null;
        return retVal;
    };

    this.isWebKit   =   function isWebKit(){
        var retVal  = navigator.userAgent.match(/WebKit/i) != null;
        return retVal;
    };

    this.isChrome   =   function isChrome(){
        var retVal  = navigator.userAgent.match(/Chrome\//i) != null;
        return retVal;
    };

    this.isFirefox  =   function isFirefox(){
        var retVal  = navigator.userAgent.match(/Firefox\//i) != null;
        return retVal;
    };

    this.isSafari   =   function isSafari(){
        var retVal  = navigator.userAgent.match(/Safari\//i) != null &&
                      navigator.userAgent.match(/Chrome\//i) == null;
        return retVal;
    };


// ===========================================
// ===== CONSTRUCTOR
// ===========================================

    this.construct  =   new(function construct(){

    })();

    return this;
})();
