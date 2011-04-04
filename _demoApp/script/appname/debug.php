<?php
    $error      =   strtolower($_GET['error']);
?><!DOCTYPE html>
<html>
    <head>
        <script src="http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.5.1.min.js"></script>
        <title>Just In Time Debugger</title>
        <style>
            body{
                border-top:         30px solid #333;
                margin:             0;
                padding:            20px;
                font:               normal 13px/1.5 Helvetica, Arial;
            }
            h1 {
                margin:             0 0 10px 0;
            }
            .error {
                display:            block;
                border:             1px solid #ccc;
                background:         #efefef;
                padding:            10px;
            }
            ul {
                margin:             0;
                padding:            0;
                border:             1px solid #ccc;
                border-radius:      10px;
            }
            li {
                list-style:         none;
                padding:            5px;
            }
            li:nth-child(even) {
                background:         #f7f7f7;
            }
            li .filename {
                display:            inline-block;
                width:              200px;
                text-align:         right;
                overflow:           hidden;
                margin-right:       10px;
                color:              #666;
            }
        </style>
    </head>
    <body>
        <h1>Debugger</h1>
        <p class="error"><?=urldecode($_GET['error']);?> @ line <?=$_GET['line'];?></p>
        <ul>

<?php

        $line   =   @$_REQUEST['line'];

        $var    =   `find ./ -name "*.js" -print -exec sed -ns "$line p" {} \;`;
        $var    =   explode("\n", $var);

        foreach($var as $k => $v){

            if(substr($v,0,1) == '.' && strpos($v, '.js') > 1){
                $hide   =   '';
                if(empty($var[($k+1)]) && !$var[($k+1)]){
                    $hide   =   " style='display:none;'";
                }
                echo "<li $hide>";
                echo "<span class='filename'>$v</span>";
            }else{
                echo "<span class='code'>" . trim($v) . "</span>";
                echo "</li>";
            };
        }

?>

        </ul>
        <h3>Suggestions</h3>
        <p>
<?php if(strpos($error, 'unexpected token')) : ?>

            An Unexpected Token usually occurs when you have unmatched
            brackets or something similar. Look for extra ( [ or {.

<?php endif; ?>
<?php if(strpos($error, 'is not defined')) : ?>

            "X is not defined," means you are referencing a variable that does
            not exist. Check for something that may not have yet been defined
            or if your function is possibly executing before it had the chance
            to be defined.

<?php endif; ?>
        </p>
        <script>
            $('li').each(function(){
                if($(this).children('.code').size() == 0)
                    $(this).hide();
            });
        </script>
    </body>
</html>
