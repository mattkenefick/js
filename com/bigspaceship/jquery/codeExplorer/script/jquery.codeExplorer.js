/**
 * jQuery.codeExplorer.js by Big Spaceship. 2008-2011
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
 * jQuery.codeExplorer
 *
 * @copyright       2011 Big Spaceship, LLC
 * @author          Matt Kenefick
 * @version         0.0.1
 * @langversion     Javascript
 *
 *
 *  Usage:
 *

    $(document).ready(function(){
        $('.item').codeExplorer({

        });
    });
 *
 *
 */

(function($){
    $.fn.codeExplorer       =   function($options){

        // fix vars
        $options.proxy      =   $options.proxy   || 'Proxy.php';
        $options.buttons    =   $options.buttons || {};
        $options.buttons.min    =   false;      // no minimize button allowed for now

        // vars
        var _self           =   this;
        var _target         =   $(this);
        var _head           =   null;
        var _foot           =   null;
        var _code           =   null;
        var _files          =   null;
        var _id             =   Math.ceil(Math.random() * 1000);

        // options
        var _ceDir          =   $options.ceDir          ||  './script/codeExplorer/';
        var _root           =   $options.root           || '';
        var _theme          =   $options.theme          || 'coda';
        var _directory      =   $options.directory      || './CodeExplorer.php';
        var _proxy          =   _ceDir + $options.proxy || _ceDir + './proxy.php';
        var _github         =   $options.github         || {};

        // extra options
        var _closeChildrenFolders       =   ($options.closeChildrenFolders === true);
        var _buttons        =   $options.buttons        ||  {};
            _buttons.min    =   _buttons.min   !== undefined ? _buttons.min  :  true;
            _buttons.max    =   _buttons.max   !== undefined ? _buttons.max  :  true;
            _buttons.close  =   _buttons.close !== undefined ? _buttons.close:  true;
        var _isResizable    =   ($options.resizable === true);
        var _isDraggable    =   ($options.draggable === true);
        var _hasHeader      =   ($options.hasHeader !== undefined) ? $options.hasHeader : true;

        // cache
        var _fileList       =   '<ul></ul>';


// =================================================
// ======== Callable
// =================================================


// =================================================
// ======== Unnecessarily Public
// =================================================

        /**
         * setup
         *
         * Adds additional HTML to code viewer.
         * Saves references to those elements.
         * Adds draggable / resizeable features.
         * Toggles Max/Min/Close buttons
         *
         * @return void
         */
        this.setup          =   function setup(){
            // add layers
            _target.append('<div id="head-'  + _id + '" class="header"><div class="inner"><div class="controls"><a class="btn-minimize" href="#maximize">Minimize</a><a class="btn-maximize" href="#maximize">Maximize</a><a class="btn-close" href="#close">Close</a></div></div></div>')
                   .append('<div id="files-' + _id + '" class="file-list"><div class="inner"></div></div>')
                   .append('<div id="code-'  + _id + '" class="code-view"><div class="inner"></div></div>')
                   .append('<div id="foot-'  + _id + '" class="footer"><div class="inner"><span class="caption"></span></div></div>');

            // store references
            _head   =   _target.children('#head-' + _id);
            _foot   =   _target.children('#foot-' + _id);
            _files  =   _target.children('#files-' + _id);
            _code   =   _target.children('#code-' + _id);

            // is it draggable
            if(_isDraggable && $()['draggable']){
                _target.draggable({
                    handle: '.header'
                });
            };

            // is it resizble?
            if(_isResizable && $()['resizable']){
                _target.resizable({
                    minWidth:       500,
                    minHeight:      200,
                    handles:        'se'
                });

                _files.resizable({
                    handles:        'e',
                    minWidth:       150,
                    maxWidth:       300
                });
            };

            // toggle buttons
            if(!_buttons.min)   _target.find('.btn-minimize').remove();
            if(!_buttons.max)   _target.find('.btn-maximize').remove();
            if(!_buttons.close) _target.find('.btn-close').remove();
        };

        /**
         * addTheme
         *
         * Adds the selected theme via the "_theme" variable.
         * Imports the stylesheet, prettify, and script for prettify.
         *
         * @return void
         */
        this.addTheme       =   function addTheme(){
            // add selected theme styles
            $('<link />', {
                href:   _ceDir + 'themes/d.php?css=./' + _theme + '/theme.css&target=' + _target.attr('id'),
                media:  'screen',
                rel:    'stylesheet',
                type:   'text/css',
                'class': 'dynamic_css'
            }).appendTo('head');

            // add google syntax highlighter styles
            $('<link />', {
                href:   _ceDir + 'external/prettify/prettify.css',
                media:  'screen',
                rel:    'stylesheet',
                type:   'text/css',
                'class': 'dynamic_css'
            }).appendTo('head');

            // add google syntax highlighter script
            var script      = document.createElement( 'script' );
                script.type = 'text/javascript';
                script.src  = _ceDir + 'external/prettify/prettify.js';

            document.body.appendChild( script );
        };

        /**
         * attach
         *
         * Applys delegate click handlers for buttons associated
         * with the viewer.
         *
         * return void
         */
        this.attach         =   function attach(){
            $('#head-' + _id).delegate('.btn-minimize', 'click', _btnMinimize_CLICK_handler);
            $('#head-' + _id).delegate('.btn-maximize', 'click', _btnMaximize_CLICK_handler);
            $('#head-' + _id).delegate('.btn-close',    'click', _btnClose_CLICK_handler);

            $('#files-' + _id).delegate('a',  'click', _fileItem_CLICK_handler);
            $('#files-' + _id).delegate('li', 'click', _fileListItem_CLICK_handler);
        };

        /**
         * getFileList
         *
         * Requests a list of files from the server based on
         * the selected directory.
         *
         * @return void
         */
        this.getFileList    =   function getFileList(){
            // setup github
            if(_github && _github.user && _github.repo){
                _setupGithub();
            }else{
                $.get(
                    _ceDir + _directory,
                    function($data){
                        $('#files-' + _id + ' .inner').html($data);
                    }
                );
            };
        };

        /**
         * loadFile
         *
         * Loads a file.
         *
         * return void
         */
        this.loadFile       =   function loadFile($file){
            var file        =   $file.indexOf('http') > -1? _proxy + "?file=" + $file : _root + $file;

            $.get(file, function($data){
                $data   =   $data.split('<').join('&lt;').split('>').join('&gt;');

                // get extension
                var ext     =   $file.split('.');
                    ext     =   ext[ext.length-1];
                    ext     =   ext.toLowerCase();

                // line count
                var lines   =   $data.split("\n").length;

                // add code to document
                $('#code-' + _id + ' .inner').html(
                    '<div class="lines"><ul></ul></div>' +
                    '<pre class="prettyprint lang-"' + ext + '>' + $data + '</pre>'
                );

                // add lines
                for(var i = 1; i < lines; i++ ){
                    $('#code-' + _id + ' .inner .lines ul').append('<li><span>' + i + '</span></li>');
                };

                // load google
                if(window['prettyPrint'])
                    prettyPrint();

                // status
                $('#foot-' + _id + ' .inner span.caption').html(
                    "<strong>Line Count: </strong><em>" + (lines - 1) + " </em>"+
                    ""+
                    "<strong>Approx Size: </strong><em>" + _fileSize($data) + " kb</em>"
                );
            });
        };


// =================================================
// ======== Workers
// =================================================

        function _resetScrollView(){
            $('.code-view').scrollTop(0)
                            .scrollLeft(0);
        };

        function isMediaFile($href){
            var ext =   $href.split('.');
                ext =   ext[ext.length-1];
                ext =   ext.toLowerCase();
            switch(ext){
                case 'jpeg':
                case 'jpg':
                case 'png':
                case 'gif':
                case 'ico':
                case 'tif':
                    $('#code-' + _id + ' .inner').html(
                        '<img src="' + $href + '" />'
                    );
                    return true;
                    break;
                case 'swf':
                case 'mp3':
                case 'mp4':
                case 'flv':
                    $('#code-' + _id + ' .inner').html(
                        '<embed src="' + $href + '" width="100%" height="100%"></embed>'
                    );
                    return true;
                    break;
            };

        };

        function _setupGithub(){
            _files.find('ul').remove();

            gitHubToList.getList(_github.user, _github.repo, _proxy + "?file=", function($data){
                _files.children('.inner').append($data);
            });
        };

        function _round($num, $dec){
            return Math.round($num*Math.pow(10,$dec))/Math.pow(10,$dec);
        };

        function _fileSize($data){
            var size        =   $data.length / 1000;
            return _round(size, 2);
        };

        function _maximizeWindow(){
            _target.css('position', 'fixed');
            _target.css('margin', '0');
            _target.animate({
                top:        0,
                left:       0,
                width:      ($(window).width() - 2) + 'px',
                height:     ($(window).height() - parseFloat(_target.css('padding-bottom')) - 2) + 'px'
            }, 500);
        };

        function _maximizeRestoreWindow(){
            _target.css('position', 'relative');
            _target.css('margin', '40px');
            _target.animate({
                width:      _target.attr('ow') + 'px',
                height:     _target.attr('oh') + 'px'
            }, 500);
        };

        function _error($message){
            console.log("Error: " + $message);
            return false;
        };


// =================================================
// ======== Handlers
// =================================================

        function _btnClose_CLICK_handler($e){
            _target.fadeOut();

            return false;
        };

        function _btnMinimize_CLICK_handler($e){
            if(_target.hasClass('minimized')){
                _target.toggleClass('minimized');

                _files.slideDown();
                _code.slideDown();
            }else{
                _target.toggleClass('minimized');

                _files.slideUp();
                _code.slideUp();
            };
        };

        function _btnMaximize_CLICK_handler($e){
            if(_target.hasClass('maximized')){
                _target.toggleClass('maximized');
                _maximizeRestoreWindow();

            }else{
                _target.toggleClass('maximized');
                _maximizeWindow();
            };

            _target.attr('oh', _target.height());
            _target.attr('ow', _target.width());
        };

        function _fileListItem_CLICK_handler($e){
            $(this).children('a').click();

            return false;
        };

        function _fileItem_CLICK_handler($e){
            $e.preventDefault();
            $e.stopPropagation();

            var isFile  =   $(this).hasClass('file');
            var href    =   $(this).attr('href');
                // we need this because the DirectoryIterator in PHP includes the "../" in the path
                // so this will set it back to regular so we can append to it to
                // the root url
                href    =   href.split('../').join('');

            // open it
            $(this).parent().toggleClass('open');

            // opts
            if(_closeChildrenFolders)
                $(this).parent().find('li').removeClass('open');

            // if we're clicking a file, load it
            if(isFile){
                $("#files-" + _id + " ul li a").removeClass("selected");
                $(this).addClass("selected");

                if(!isMediaFile(href)){
                    _self.loadFile(href);
                };

                _resetScrollView();
            };

            return false;
        };


// =================================================
// ======== Constructor
// =================================================

        _self.setup();
        _self.addTheme();
        _self.getFileList();
        _self.attach();

        // get each object
        return this;
    };
})(jQuery);


var gitHubToList    =   new(function(){

    var _self       =   this;

    function _r($dir, $base){
        var d1      =   $dir[0];
        $base[d1]   =   $dir.length > 1 ? ($base[d1] != undefined ? $base[d1] : {}) : 'file';
        $dir.shift();
        if($dir.length) _r($dir, $base[d1]);
        return $base;
    };

    function rlength(obj){
        var c = 0;
        for(var i in obj) if(typeof(obj[i]) == 'object') c++;
        return c;
    };

    function convertToList(obj, $dir) {
        $dir    =   $dir || '';
      var a, f, li, ul = document.createElement ("ul");

      for (f in obj) {
        li      =   document.createElement ("li");
        a       =   document.createElement ("a");

        if (rlength(obj) && obj[f] != 'file') {
            $(li).addClass("dir");
            a.href      =   "#directory";
            a.innerHTML =   f;
            li.appendChild( a );
            li.appendChild (convertToList (obj[f], $dir + f + '/'));
        }else{
            $(li).addClass("file");
            $(a).addClass("file");
            a.href      =   $dir + f;
            a.innerHTML =   f;
            li.appendChild( a );
        }
        ul.appendChild (li);
      }
      return ul;
    }

    this.getList        =   function getList($user, $repo, $proxy, $callback){
        $.getJSON($proxy + 'http://github.com/api/v2/json/blob/all/' + $user + '/'+ $repo + '/master', function($data){
                var directory           =   {};
                var i, ii, iii, iv      =   0;
                var tI, tII, tIII, tIV  =   null;

                for(i in $data.blobs){
                    tI  =   i.toString().split('/');
                    tII =   _r(tI, directory);
                    $.extend(directory, tII);
                }

                var list    =   convertToList( directory, 'https://github.com/' + $user + '/' + $repo +'/raw/master/' );
                $callback(list);
        });
    };

})();
