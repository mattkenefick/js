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


var OutputEvent = {
    INFO         :   0,
    STATUS       :   1,
    DEBUG        :   2,
    WARNING      :   3,
    ERROR        :   4,
    FATAL        :   5,
    ALL          :   6
}

var Out = { };

Out = {

    INFO         :   0,
    STATUS       :   1,
    DEBUG        :   2,
    WARNING      :   3,
    ERROR        :   4,
    FATAL        :   5,
    __levels     :   [],
    __silenced   :   {},
    __instance   :   null,

    enableLevel:        function( $level ){
        this.__levels[$level] = this.__output;
    },

    disableLevel:       function( $level ){
        this.__levels[$level] = this.__foo;
    },

    enableAllLevels:    function(){
        this.enableLevel(this.INFO    );
        this.enableLevel(this.STATUS  );
        this.enableLevel(this.DEBUG   );
        this.enableLevel(this.WARNING );
        this.enableLevel(this.ERROR   );
        this.enableLevel(this.FATAL   );
        this.enableLevel(this.INFO    );
    },

    disableAllLevels:   function(){
        this.disableLevel(this.INFO    );
        this.disableLevel(this.STATUS  );
        this.disableLevel(this.DEBUG   );
        this.disableLevel(this.WARNING );
        this.disableLevel(this.ERROR   );
        this.disableLevel(this.FATAL   );
        this.disableLevel(this.INFO    );
    },

    isSilenced:         function( $o ){
        return false;
    },

    /** ================
     *  Callable Methods
     ** ================*/
    info:               function($origin, $str) {
        if(this.isSilenced($origin)) return;
        $str        =   this.getParentClass(this.info.arguments);
        this.__levels[this.INFO]("INFO", $origin, $str, OutputEvent.INFO);
    },

    status:             function($origin, $str) {
        if(this.isSilenced($origin)) return;
        $str        =   this.getParentClass(this.status.arguments);
        this.__levels[this.STATUS]("STATUS", $origin, $str, OutputEvent.STATUS);
    },

    debug:              function($origin, $str) {
        if(this.isSilenced($origin)) return;
        $str        =   this.getParentClass(this.debug.arguments);
        this.__levels[this.DEBUG]("DEBUG", $origin, $str, OutputEvent.DEBUG);
    },

    warning:            function($origin, $str) {
        if(this.isSilenced($origin)) return;
        $str        =   this.getParentClass(this.warning.arguments);
        this.__levels[this.WARNING]("WARNING", $origin, $str, OutputEvent.WARNING);
    },

    error:              function($origin, $str) {
        if(this.isSilenced($origin)) return;
        $str        =   this.getParentClass(this.error.arguments);
        this.__levels[this.ERROR]("ERROR", $origin, $str, OutputEvent.ERROR);
    },

    fatal:              function($origin, $str) {
        if(this.isSilenced($origin)) return;
        $str        =   this.getParentClass(this.fatal.arguments);
        this.__levels[this.FATAL]("FATAL", $origin, $str, OutputEvent.FATAL);
    },

    traceObject:        function($origin, $str, $obj){
        if(this.isSilenced($origin)) return;

        this.__output("OBJECT", $origin, $str, OutputEvent.ALL);
        for(var p in $obj)
            this.__output("", null, p + " : " + $obj[p], OutputEvent.ALL);
    },

    getParentClass:     function( $arguments ){
        var parent  =   $arguments.callee.caller.toString().substr( 'function '.length);
        parent      =   parent.substr(0,parent.indexOf('('));
        return parent;
    },


    /** =============
     *  Functionality
     ** =============*/
    __output:           function($level, $origin, $str, $type){
        var l        = $level;
        var s        = $origin ? $origin : "";
        var i        = this;

        while(l.length < 8) l += " ";

        var output   = l + ":::    " + s + "   :: " + $str;

       if( typeof( window['console'] ) != 'undefined' )
            console.log(output);

        /*i.dispatchEvent(new OutputEvent(OutputEvent.ALL, output));
        i.dispatchEvent(new OutputEvent($type,           output));*/
    },

    __foo:           function($level, $origin, $str, $type){ },


'null':null}

Out.enableAllLevels();
