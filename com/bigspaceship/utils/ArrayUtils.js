//math
var ArrayUtils       =   new(function(){

    // private vars
    var _me         =   this;

    // public vars
    this.name       =   "ArrayUtils";

	//http://sedition.com/perl/javascript-fy.html
    this.shuffle = function shuffle ( $myArray ) {
		var i = $myArray.length;
		if ( i == 0 ) return false;
		while ( --i ) {
			var j = Math.floor( Math.random() * ( i + 1 ) );
			var tempi = $myArray[i];
			var tempj = $myArray[j];
			$myArray[i] = tempj;
			$myArray[j] = tempi;
		}
		return $myArray;
	}

    return this;
})();
