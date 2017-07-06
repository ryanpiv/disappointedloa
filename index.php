 <!DOCTYPE html>
<html ng-app="Disappointed">
<head>
  <?php include 'settings.php';?>
  <style>
  	.grid{
  		height:600px;
  	}
  </style>
 </head>
<body ng-controller="MainController" data-ng-init="init()">
<nav class="navbar navbar-default navbar-fixed-top">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" target="_blank" href="http://disappointed.life">
      	<img alt="Brand" style="border-radius:5px" width="30" height="30" src="disappointed_avatar.png">
      </a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse">
      <ul class="nav navbar-nav">
        <li><a href="#lootHistory">Loot History</a></li>
        <li><a href="#loas">LoAs</a></li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>
<div class="container-fluid">
	<section id="lootHistory" style="padding-top: 50px">
		<h1 class="page-header">Loot History</h1>
		<div ui-grid="gridPagedLoot" id="gridPagedLoot1" ui-grid-pagination ui-grid-selection ui-grid-auto-resize ui-grid-resize-columns ui-grid-move-columns class="grid">
		</div>
	</section>
	<section id="loas">
		<h1 class="page-header">Leave of Absences</h1>
		<div ui-grid="gridPagedLoas" id="gridPagedLoas" ui-grid-pagination ui-grid-selection ui-grid-auto-resize ui-grid-resize-columns ui-grid-move-columns class="grid">
		</div>
	</section>
</div>

</body>
</html>
