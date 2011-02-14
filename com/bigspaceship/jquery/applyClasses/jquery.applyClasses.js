/**
 * jQuery.applyClasses.js by Big Spaceship. 2008-2011
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
 * jQuery.applyClasses
 *
 * @copyright       2011 Big Spaceship, LLC
 * @author          Matt Kenefick
 * @version         0.0.1
 * @langversion     Javascript
 *
 *
 *  Usage:
 *
 *  Tie the activeItem class to whatever elements on the screen you want to
 *  monitor and it will attach/remove "active" to their class


    $(document).ready(function(){
        $('.item').activeItem({
            paddingTop:     50,
            paddingBottom:  200,
            maxActive:      1
        });
    });
 *
 *
 */

if(!window['__jsClasses']){
    var __jsClasses     =   {__unnamed: []};
};

(function($){


    $.fn.applyClasses         =   function($options){

        // get each object
        return this.each(function(){
            var self        =   $(this);
            var id          =   $(this).attr('id');
            var classType   =   $(this).attr('data-jsclass');
            var tmpClass;
            classType   =   classType.split(',');

            for(var i = 0; i < classType.length; i++){
                if(window[classType[i]]){
                    tmpClass    =   new window[classType[i]](self, this);
                    if(id != ''){
                        if(!__jsClasses[id]){
                            __jsClasses[id] =   {};
                        };
                        __jsClasses[id][classType[i]] =   tmpClass;
                    }else
                        __jsClasses.__unnamed.push(tmpClass);
                }else{
                    if(window['console'])
                        console.log("Class `" + classType + "` doesn't exist.");
                }
            };
        });
    };
})(jQuery);
