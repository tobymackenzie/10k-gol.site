<!DOCTYPE html>
<html<?php if($id){ ?> class="page-<?=$id?>"<?php } ?> lang="en"><?php
	?><head><?php
		?><meta charset="utf-8" /><?php
		?><title><?=(isset($title) ? $title . ' - ' : '')?>Conway's Game of Life (10k) - &lt;toby&gt;</title><?php
		?><meta content="initial-scale=1,width=device-width" name="viewport" /><?php
if($hasCache){
		?><link href="<?=$this->getAssetUrl('main.css')?>" rel="stylesheet" /><?php
}else{
		?><style><!-- --></style><?php
}
	?></head><?php
	?><body><?php
		include(__DIR__ . '/header.php');
		?><main id="main"><?php
			if(isset($content)){
				echo $content;
			}
			?><a class="blocker" href="#"><b>Back to top</b></a><?php
		?></main><?php
		include(__DIR__ . '/footer.php');
		?><script><!-- --></script><?php
//--lazy load css for no-js.  use fake media attribute to load non-blocking and not apply to page
if(!$hasCache){
		?><noscript><link href="<?=$this->getAssetUrl('main.css')?>" rel="stylesheet" media="only x" /></noscript><?php
}
	?></body><?php
?></html>
