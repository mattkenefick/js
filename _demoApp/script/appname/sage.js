if( Application ){
    Out.error("Application already exists... clearing contents.");
    Out.error("This may cause errors.");

    delete Application;
    Application =   {};
}else{
    var Application;
}



/**
* Error Handler
*
* This is the global error handler that helps debug
* where problems may be.
*
* @version 1.0
* @author Matt Kenefick <m.kenefick@bigspaceship.com>
* @project Demo App
*/
$(window).bind('error',  function onError($msg, $2, $line){
    $line   =   $msg.originalEvent;
    $msg    =   $line.message;
    $line   =   $line.lineno;
    console.log("Error found: Showing debugger.");
    window.open(APP_JSURL + 'debug.php?line=' + $line + "&error=" + escape($msg), "Debugger", "width=500,height=500,top=0,left=0");
    return true;
});


/**
* Sage
*
* This is the global loader for all javascript files.
*
* @version 1.0
* @author Matt Kenefick <m.kenefick@bigspaceship.com>
* @project Demo App
*/

if( !window['Sage'] ){

    // CHECK FOR DEPENDENCIES.
    if(!window['Out']){
        if(console)
            console.log("Cannot find `Out`. This will cause errors.");
    };
    if(!window['Basil']){
        Out.error({name:'Sage'}, "Cannot find `Basil`. This is a fatal error.");
    };

    var Library     =   {};
    var Logic       =   {};
    var Input       =   {
        keyboard:   {},
        mouse:      {},
        microphone: {},
        webcam:     {}
    };
    var Controllers =   {
        core:       {},
        screens:    {}
    };
    var Models      =   {};
    var Views       =   {
        animation:  {},
        core:       {},
        screens:    {},
        ui:         {}
    };

    var Sage    =   new Basil('Sage');
};
