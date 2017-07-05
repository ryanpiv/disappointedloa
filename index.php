<!DOCTYPE html>
<html ng-app="Disappointed">
<head>
  <?php include 'settings.php';?>

 </head>
<body ng-controller="MainController" data-ng-init="init()">


    <section id="edit-data">
    	<div class="col-lg-11 col-lg-offset-1 col-md-10 col-md-offset-2">
    		<h1 class="page-header">Edit Data</h1>
			<div ui-grid="gridPagedLoot" id="gridPagedLoot1" ui-grid-pagination ui-grid-selection class="grid"></div>
		</div>
    </section>
</body>
</html>
