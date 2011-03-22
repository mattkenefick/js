<?php
define('ROOTPATH', realpath(dirname(__FILE__)) . '/');

// installed in the docroot?
if (realpath(dirname(__FILE__)) == $_SERVER['DOCUMENT_ROOT']){
    define('ROOT', '/');
}else{
    define('ROOT', '/' . substr(ROOTPATH, strlen($_SERVER['DOCUMENT_ROOT'])+1));
}

$tmp        =   (isset($_SERVER['HTTPS']) ? "https://" : "http://") . $_SERVER['HTTP_HOST'] . ROOT ;
if(substr($tmp, -1) != '/')
    $tmp    .=  '/';

define('BASEURL', $tmp);

/**
 * Get an individual file
 **/
if(isset($_GET['file'])){
    $options = array(
        CURLOPT_RETURNTRANSFER => true,     // return web page
        CURLOPT_HEADER         => false,    // don't return headers
        CURLOPT_FOLLOWLOCATION => true,     // follow redirects
        CURLOPT_ENCODING       => "",       // handle all encodings
        CURLOPT_USERAGENT      => "spider", // who am i
        CURLOPT_AUTOREFERER    => true,     // set referer on redirect
        CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
        CURLOPT_TIMEOUT        => 120,      // timeout on response
        CURLOPT_MAXREDIRS      => 10,       // stop after 10 redirects
    );

    $ch      = curl_init( $_GET['file'] );
    curl_setopt_array( $ch, $options );
    $content = curl_exec( $ch );
    $err     = curl_errno( $ch );
    $errmsg  = curl_error( $ch );
    $header  = curl_getinfo( $ch );
    curl_close( $ch );

    $header['errno']   = $err;
    $header['errmsg']  = $errmsg;
    echo $content;
    exit;
};

$replace    =   str_replace($_GET['root'], '', BASEURL);
$dir        =   substr_count($replace, '/');
$goBack     =   str_repeat('../', 2);

/**
 * Get a directory structure,
 * formatted with UL/LI
 */
if(isset($codeDirectory)){
    function fillStrWithFileNodes( DirectoryIterator $dir ){
      $data     =   '';
      foreach ( $dir as $node ){
        if ( $node->isDir() && !$node->isDot() ){
            $data   .=  '<li class="dir">';
            $data   .=  '<a href="#directory">' . $node->getFilename() . '</a>';
            $data   .=  '<ul>';
            $data   .=  fillStrWithFileNodes( new DirectoryIterator( $node->getPathname() ) );
            $data   .=  '</ul>';
            $data   .=  '</li>';
        } else if ( $node->isFile() ) {
            $data   .=  '<li class="file">';
            $data   .=  '<a href="' . $node->getPathname() . '" class="file">' . $node->getFilename() . '</a>';
            $data   .=  '</li>';
        }
      }
      return $data;
    }

    // this removes all the attempts to go backwards in a directory
    $fileData = fillStrWithFileNodes( new DirectoryIterator( $goBack . str_replace('../', '', $codeDirectory) ) );

    echo '<ul>' . $fileData . '</ul>';
    exit;
}
