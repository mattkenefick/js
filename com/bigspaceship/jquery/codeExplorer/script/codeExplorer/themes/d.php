<?php

$themePath  =   explode('/', $_GET['css']);
array_pop($themePath);
$themePath  =   implode('/', $themePath);

ob_start();
include($_GET['css']);
$content    =   ob_get_contents();
ob_end_clean();

$content    =   str_replace('.codeExplorer ', '#'.$_GET['target'] . ' ', $content);
$content    =   str_replace('./images/', $themePath . '/images/', $content);

header('Content-type: text/css');

echo $content;
exit;
