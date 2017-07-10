 <!DOCTYPE html>
<html ng-app="Disappointed">
<head>
  <title>Disappointed Analytics</title>
  <link rel="shortcut icon" href="favicon.ico" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Disappointed Analytics" />
  <meta property="og:description" content="Analyics for Disappointed, US, Zul jin" />
  <meta property="og:image" content="disappointed_avatar.png" />
  <meta property="og:image:secure_url" content="https://disappointedloa.gear.host/disappointed_avatar.png" />
  <meta property="og:image:width" content="240" />
  <meta property="og:image:height" content="240" />
  <meta property="og:url" content="http://www.disappointedloa.gear.host" />
  <?php include 'settings.php';?>
  <style>
  	.grid{
  		height:600px;
  	}
    .row{
      padding-top:10px;
      padding-bottom:10px;
    }
    section{
      padding-bottom: 100px;
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
        <li><a href="#lootHistoryAnalytics">Loot History Analytics</a></li>
        <li><a href="#lootHistoryGrid">Loot History Grid</a></li>
        <li><a href="#raidersAnalytics">Raiders Analytics</a></li>
        <li><a href="#raidersGrid">Raiders Grid</a></li>
        <li><a href="#loaAnalytics">LoA Analytics</a></li>
        <li><a href="#loaGrid">LoA Grid</a></li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>
<div class="container-fluid" id="MainContainer">
	<section id="lootHistoryAnalytics" style="padding-top: 50px">
    <h1 class="page-header">Loot History Analytics</h1>

    <div class="row">
      <div class="col-lg-8 col-lg-offset-2">
        <canvas id="myChart"></canvas>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4">
        <canvas id="lootByClassChart"></canvas>
      </div>
      <div class="col-md-4">
        <canvas id="lootByResponseChart"></canvas>
      </div>
      <div class="col-md-4"t>
        <canvas id="lootByTosDifficultyChart"></canvas>
      </div>
    </div>
    <div class="row">
      <div class="col-md-8 col-md-offset-2"t>
        <canvas id="lootTosTierByPlayer"></canvas>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-8 col-lg-offset-2"t>
        <canvas id="lootTosTierByDifficulty"></canvas>
      </div>
    </div>

	</section>

  <section id="lootHistoryGrid">
    <h1 class="page-header">Loot History Grid</h1>
    <div class="row">
      <div class="col-md-12">
        <div ui-grid="gridPagedLoot" id="gridPagedLoot1" ui-grid-pagination ui-grid-selection ui-grid-auto-resize ui-grid-resize-columns ui-grid-move-columns class="grid">
        </div>
      </div>
    </div>
  </section>

  <section id="raidersAnalytics">
    <h1 class="page-header">Raiders Analytics</h1>
    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <canvas id="raidersByClass"></canvas>
      </div>
    </div>
  </section>

  <section id="raidersGrid">
    <h1 class="page-header">Raiders Grid</h1>
    <div class="row">
      <div class="col-md-12">
        <div ui-grid="gridPagedRaiders" id="gridPagedRaiders" ui-grid-pagination ui-grid-selection ui-grid-auto-resize ui-grid-resize-columns ui-grid-move-columns class="grid">
        </div>
      </div>
    </div>
  </section>

  <section id="loaAnalytics">
    <h1 class="page-header">Leave of Absense Analytics</h1>
    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <canvas id="myLoaChart"></canvas>
      </div>
    </div>
  </section>

	<section id="loaGrid">
		<h1 class="page-header">Leave of Absence Grid</h1>
    <div class="row">
      <div class="col-md-12">
        <div ui-grid="gridPagedLoas" id="gridPagedLoas" ui-grid-pagination ui-grid-selection ui-grid-auto-resize ui-grid-resize-columns ui-grid-move-columns class="grid">
        </div>
      </div>
		</div>
	</section>
</div>

<script>
  $('a[href^="#"]').on('click', function(e) {
      e.preventDefault();
      $(document).off("scroll");

      /*$('a').each(function () {
          $(this).removeClass('my-active');
      })
      $(this).addClass('my-active');*/

      var target = this.hash;
      $target = $(target);
      $('html, body').stop().animate({
          'scrollTop': $target.offset().top
      }, 500, 'swing', function() {
          window.location.hash = target;
          //$(document).on("scroll", onScroll);
      });
  });
</script>

</body>
</html>
