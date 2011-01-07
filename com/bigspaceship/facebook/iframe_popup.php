<?php
	$session = '';
	if( isset( $_GET["session"] ) )
	{
		$session = urldecode( $_GET["session"] );
	}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	
	<script type="text/javascript">
	<!--
		is_ie = ( document.all != null ) ? true : false;
		
		if( top.opener != null && top.opener.com.bigspaceship.api.facebook.OAuthBridge.confirmFacebookConnection )
		{
			top.opener.com.bigspaceship.api.facebook.OAuthBridge.confirmFacebookConnection( '<?php echo $session; ?>' );
			
			if( is_ie )
			{
				// sk: this doesn't work ... do we know something that does?
				this.focus();
				self.opener = this;
				self.close();
			}else
			{
				top.window.close();
			}
		}
		
	//-->
	</script>
	
	<title></title>
	
</head>

<body>
	<!-- Style this page however you'd like -->
	<p>You can close the window</p>

</body>
</html>
