$(document).ready(function() {
    var ctx = $("#myChart");
    var lootHistoryBarChart = new Chart(ctx, {
        type: 'bar',
        //responsive: true,
        data: {
            //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: 'Players who received items not equal to xmog, OS or Pass',
                //data: [12, 19, 3, 5, 2, 3],
                backgroundColor: largeBackgroundColorArray,
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-unique-player-gear-count.php"
    }).done(function(data) {
        var players = [];
        var players_items = [];
        for (var i = 0; i < data.length; i++) {
            players.push(data[i].player);
            players_items.push(data[i].num);
        }
        lootHistoryBarChart.data.datasets[0].data = players_items;
        lootHistoryBarChart.data.labels = players;
        lootHistoryBarChart.update();
    });

    var myPieChart = $('#myPieChart');
    var pieChart = new Chart(myPieChart, {
        type: 'bar',
        responsive: true,
        data: {
            labels: [],
            datasets: [{
                label: '# of Votes',
                data: []
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    /*$.ajax({
        method: "GET",
        url: "js/data/get-unique-players.php"
    }).done(function(data) {
        var temp = [];
        for (var i = 0; i < data.length; i++) {
            temp.push(data[i].player);
        }
        lootHistoryBarChart.data.labels = temp;
        lootHistoryBarChart.update();
    });*/

    var ctx_loa = $("#myLoaChart");
    var loaHistoryBarChart = new Chart(ctx_loa, {
        type: 'bar',
        //responsive: true,
        data: {
            //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Normal or NoLoA LoAs',
                //data: [12, 19, 3, 5, 2, 3],
                backgroundColor: largeBackgroundColorArray,
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-unique-player-loa-count.php"
    }).done(function(data) {
        var players = [];
        var players_loas = [];
        for (var i = 0; i < data.length; i++) {
            players.push(data[i].discordusername);
            players_loas.push(data[i].num);
        }
        loaHistoryBarChart.data.datasets[0].data = players_loas;
        loaHistoryBarChart.data.labels = players;
        loaHistoryBarChart.update();
    });
});


function generateRandomColor() {
    return '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
}

var largeBackgroundColorArray = [
    'rgba(255, 99, 132, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(255, 206, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)',
    'rgba(153, 102, 255, 0.4)',
    'rgba(255, 159, 64, 0.4)',
    'rgba(255, 99, 132, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(255, 206, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)',
    'rgba(153, 102, 255, 0.4)',
    'rgba(255, 159, 64, 0.4)',
    'rgba(255, 99, 132, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(255, 206, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)',
    'rgba(153, 102, 255, 0.4)',
    'rgba(255, 159, 64, 0.4)',
    'rgba(255, 99, 132, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(255, 206, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)',
    'rgba(153, 102, 255, 0.4)',
    'rgba(255, 159, 64, 0.4)',
    'rgba(255, 99, 132, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(255, 206, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)',
    'rgba(153, 102, 255, 0.4)',
    'rgba(255, 159, 64, 0.4)',
    'rgba(255, 99, 132, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(255, 206, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)',
    'rgba(153, 102, 255, 0.4)',
    'rgba(255, 159, 64, 0.4)',
    'rgba(255, 99, 132, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(255, 206, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)',
    'rgba(153, 102, 255, 0.4)',
    'rgba(255, 159, 64, 0.4)',
    'rgba(255, 99, 132, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(255, 206, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)',
    'rgba(153, 102, 255, 0.4)',
    'rgba(255, 159, 64, 0.4)',
    'rgba(255, 99, 132, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(255, 206, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)',
    'rgba(153, 102, 255, 0.4)',
    'rgba(255, 159, 64, 0.4)',
    'rgba(255, 99, 132, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(255, 206, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)',
    'rgba(153, 102, 255, 0.4)',
    'rgba(255, 159, 64, 0.4)'
]
