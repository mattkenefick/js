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

var Class   =   new(function(){
    this.extend =   function extend($classA, $classB){
        for(var i in $classB){
            if( typeof($classB[i]) == 'function' &&
                typeof($classA[i]) == 'function'){

                $classA._super      =   $classA._super || {};
                $classA._super[i]   =   $classB[i];
                                
            }else{
                if(!$classA[i])
                    $classA[i]  =   $classB[i];
            };
        };

        return $classA;
    };
})();
