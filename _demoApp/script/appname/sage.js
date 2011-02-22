if( Application ){
    Out.error("Application already exists... clearing contents.");
    Out.error("This may cause errors.");

    delete Application;
    Application =   {};
}else{
    var Application;
}

/**
* Sage
*
* This is the global loader for all javascript files.
*
* @version 1.0
* @author Matt Kenefick <m.kenefick@bigspaceship.com>
* @project Star Wars
*/

if( !Sage ){

    // CHECK FOR DEPENDENCIES.
    if(!Out){
        if(console)
            console.log("Cannot find `Out`. This will cause errors.");
    };
    if(!Class){
        Out.warning({name:'Sage'}, "Cannot find `Class`. This may cause errors with extending.");
    };
    if(!Basil){
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
