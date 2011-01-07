function formatTime ( time ) {
    var remainder;
    var hours = time / ( 60 * 60 );
    remainder = hours - (Math.floor ( hours ));
    hours = Math.floor ( hours );
    var minutes = remainder * 60;
    remainder = minutes - (Math.floor ( minutes ));
    minutes = Math.floor ( minutes );
    var seconds = remainder * 60;
    remainder = seconds - (Math.floor ( seconds ));
    seconds = Math.floor ( seconds );
    var hString = hours < 10 ? "0" + hours : "" + hours;
    var mString = minutes < 10 ? "0" + minutes : "" + minutes;
    var sString = seconds < 10 ? "0" + seconds : "" + seconds;
    if ( time < 0 || isNaN(time)) return "00:00";
    if ( hours > 0 )    {
        return hString + ":" + mString + ":" + sString;
    }else{
        return mString + ":" + sString;
    }
}

String.prototype.between = function(prefix, suffix) {
  s = this;
  var i = s.indexOf(prefix);
  if (i >= 0) {
    s = s.substring(i + prefix.length);
  }
  else {
    return '';
  }
  if (suffix) {
    i = s.indexOf(suffix);
    if (i >= 0) {
      s = s.substring(0, i);
    }
    else {
      return '';
    }
  }
  return s;
}

if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    }
}

if(!Array.sortOn){
    Array.prototype.sortOn = function($key){
        this.sort(
                function(a, b){
                    return (a[$key] > b[$key]) - (a[$key] < b[$key]);
                }
            );
    };
};

function foreach($haystack, $callback){
    for(var i in $haystack){
        if(typeof($haystack[i]) != 'function'){
            $callback(i, $haystack[i]);
        };
    };
};

function stripHTML(html) {
    return $('<div>' + html + '</div>').text();
}

function defaultInputTextBoxes(){
    $('input[type=text]').unbind('focus');
    $('input[type=text]').unbind('blur');

    $('input[type=text]').each(function(){
        $(this).attr('default', $(this).val());
    });

    $('input[type=text]').focus(function(){
        if($(this).val() == $(this).attr('default')){
            $(this).val('');
        };
    });

    $('input[type=text]').blur(function(){
        if($(this).val() == ''){
            $(this).val($(this).attr('default'));
        };
    });
}

function print_r(theObj, $space, $levelMax, $level, $ignoreKeys){
    if(!$space)     $space = ' ';
    if(!$level)     $level = 0;
    if(!$levelMax)  $levelMax = 3;
    if($level > $levelMax)
        return;

    if(typeof(theObj) == 'array' || typeof(theObj) == 'object'){
        for(var p in theObj){
            if(theObj[p] && theObj[p].toString() == '[object Object]'){
                Out.debug({}, $level + ": " +$space + "[" + p + "] => " + theObj[p] );

                if( $ignoreKeys && $ignoreKeys.length && $ignoreKeys.indexOf(p) > -1 ){}else{
                    if($level < $levelMax )
                        print_r(theObj[p], $space + '  ', $levelMax, ($level+1), $ignoreKeys);
                }
            } else {
                Out.debug({}, $level + ": " +$space +  "[" + p + "] => " + theObj[p] );
            }
        }
    }
}

function callback_r(theObj, $callback, $levelMax, $level, $ignoreKeys){
    if(!$level)     $level = 0;
    if(!$levelMax)  $levelMax = 3;
    if($level > $levelMax)
        return;

    if(typeof(theObj) == 'array' || typeof(theObj) == 'object'){
        for(var p in theObj){

            $callback(theObj, $level);

            if(theObj[p] && theObj[p].toString() == '[object Object]'){
                if( $ignoreKeys.indexOf(p) > -1 ){}else{
                    if($level < $levelMax )
                        callback_r(theObj[p], $callback, $levelMax, ($level+1), $ignoreKeys);
                }
            } else {
                $callback(theObj, $level);
            }
        }
    }
}

function distance($a, $b){
    var dx = $a.x - $b.x;
    var dy = $a.y - $b.y;
    return Math.sqrt(dx * dx + dy * dy);
};

if(!Point){
    function Point($x, $y, $z){
        return {x: $x, y: $y, z: $z};
    };
};
