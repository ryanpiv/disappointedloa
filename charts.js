$(document).ready(function() {
    var ctx = $("#myChart");
    var lootHistoryBarChart = new Chart(ctx, {
        type: 'bar',
        //responsive: true,
        data: {
            //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: 'Players who received items not equal to xmog, OS or Pass',
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
        var bg_colors = [];
        for (var i = 0; i < data.length; i++) {
            players.push(data[i].player);
            players_items.push(data[i].num);
            bg_colors.push(colorByClass(data[i].class));
        }
        lootHistoryBarChart.data.datasets[0].data = players_items;
        lootHistoryBarChart.data.labels = players;
        lootHistoryBarChart.data.datasets[0].backgroundColor = bg_colors;
        lootHistoryBarChart.data.datasets[0].borderColor = bg_colors;
        lootHistoryBarChart.update();
    });

    var ctx_loa = $("#myLoaChart");
    var loaHistoryBarChart = new Chart(ctx_loa, {
        type: 'bar',
        //responsive: true,
        data: {
            //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
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
            title: {
                display: true,
                text: '# of Normal or NoLoA LoAs'
            },
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

    var lootByClassChart = $('#lootByClassChart');
    var lootByClassPieChart = new Chart(lootByClassChart, {
        type: 'pie',
        responsive: true,
        data: {
            labels: [],
            datasets: [{
                label: '# of Votes',
                backgroundColor: classColors,
                data: []
            }],
            borderWidth: 1
        },
        options: {
            title: {
                display: true,
                text: 'Loot distribution by class'
            }
        }
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-loot-by-class.php"
    }).done(function(data) {
        var classes = [];
        var classCount = [];
        for (var i = 0; i < data.length; i++) {
            classes.push(data[i].class);
            classCount.push(data[i].classcount);
        }
        lootByClassPieChart.data.datasets[0].data = classCount;
        lootByClassPieChart.data.labels = classes;
        lootByClassPieChart.update();
    });

    var lootByResponseChart = $('#lootByResponseChart');
    var lootByResponsePieChart = new Chart(lootByResponseChart, {
        type: 'pie',
        responsive: true,
        data: {
            labels: [],
            datasets: [{
                label: '# of Votes',
                backgroundColor: classColors,
                data: []
            }],
            borderWidth: 1
        },
        options: {
            title: {
                display: true,
                text: 'Loot distribution by response'
            }
        }
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-loot-by-response.php"
    }).done(function(data) {
        var responses = [];
        var responseCount = [];
        for (var i = 0; i < data.length; i++) {
            responses.push(data[i].response);
            responseCount.push(data[i].responsecount);
        }
        lootByResponsePieChart.data.datasets[0].data = responseCount;
        lootByResponsePieChart.data.labels = responses;
        lootByResponsePieChart.update();
    });

    var lootByTosDifficultyChart = $('#lootByTosDifficultyChart');
    var lootByTosDifficultyPieChart = new Chart(lootByTosDifficultyChart, {
        type: 'pie',
        responsive: true,
        data: {
            labels: [],
            datasets: [{
                label: '# of Votes',
                backgroundColor: ['rgba(230,126,34 ,0.5)', //orange
                    'rgba(231,76,60 ,0.5)', //red
                    'rgba(39,174,96 ,0.5)', //green
                ],
                data: []
            }],
            borderWidth: 1
        },
        options: {
            title: {
                display: true,
                text: 'Loot distribution by ToS Difficulty'
            }
        }
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-loot-by-tos-difficulty.php"
    }).done(function(data) {
        var instances = [];
        var instancesCount = [];
        for (var i = 0; i < data.length; i++) {
            instances.push(data[i].instance);
            instancesCount.push(data[i].instancecount);
        }
        lootByTosDifficultyPieChart.data.datasets[0].data = instancesCount;
        lootByTosDifficultyPieChart.data.labels = instances;
        lootByTosDifficultyPieChart.update();
    });

    var lootTosTierByPlayer = $("#lootTosTierByPlayer");
    var lootTosTierByPlayerPieChart = new Chart(lootTosTierByPlayer, {
        type: 'bar',
        responsive: true,
        data: {
            labels: [],
            datasets: [{
                label: '# of Votes',
                data: []
            }],
            borderWidth: 1
        },
        options: {
            title: {
                display: true,
                text: 'Tier distribution betweer players on all difficulties for all response types'
            }
        }
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-player-tier-all.php"
    }).done(function(data) {
        var dataArray = [];
        var players = [];
        var playersItemsCount = [];
        var bg_colors = [];
        for (var i = 0; i < data.length; i++) {
            players.push(data[i].player);
            playersItemsCount.push(data[i].num);
            bg_colors.push(colorByClass(data[i].class));
        }
        //addData(lootTosTierByPlayerPieChart, players, playersItemsCount);

        lootTosTierByPlayerPieChart.data.datasets[0].data = playersItemsCount;
        lootTosTierByPlayerPieChart.data.labels = players;

        lootTosTierByPlayerPieChart.data.datasets[0].backgroundColor = bg_colors;
        lootTosTierByPlayerPieChart.data.datasets[0].borderColor = bg_colors;
        lootTosTierByPlayerPieChart.update();
    });

    var lootTosTierByDifficulty = $("#lootTosTierByDifficulty");
    var lootTosTierByDifficultyChart = new Chart(lootTosTierByDifficulty, {
        type: 'bar',
        responsive: true,
        data: {
            labels: [],
            datasets: [{
                label: 'Normal',
                backgroundColor: 'rgba(241, 196, 15,1.0)',
                borderColor: 'rgba(241, 196, 15,1.0)',
                data: []
            }, {
                label: 'Heroic',
                backgroundColor: 'rgba(230, 126, 34,1.0)',
                borderColor: 'rgba(230, 126, 34,1.0)',
                data: []
            }, {
                label: 'Mythic',
                backgroundColor: 'rgba(231, 76, 60,1.0)',
                borderColor: 'rgba(231, 76, 60,1.0)',
                data: []
            }],
            borderWidth: 1
        },
        options: {
            title: {
                display: true,
                text: 'Tier distribution betweer players by difficulty'
            },
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
        url: "js/data/get-unique-players.php"
    }).done(function(data) {
        var lblArray = [];
        for (var i = 0; i < data.length; i++) {
            lblArray.push(data[i].player);
        }
        lootTosTierByDifficultyChart.data.labels = lblArray;
        $.ajax({
            method: "GET",
            url: "js/data/get-player-tier-normal.php"
        }).done(function(data) {
            var dataArray = [];
            var players = [];
            var playersItemsCount = [];
            var bg_colors = [];
            for (var i = 0; i < data.length; i++) {
                players.push(data[i].player);
                playersItemsCount.push(data[i].num);
                bg_colors.push(colorByClass(data[i].class));
            }

            lootTosTierByDifficultyChart.data.datasets[0].data = playersItemsCount;
            lootTosTierByDifficultyChart.data.labels = players;

            //lootTosTierByDifficultyChart.data.datasets[0].backgroundColor = bg_colors;
            //lootTosTierByDifficultyChart.data.datasets[0].borderColor = bg_colors;
            lootTosTierByDifficultyChart.update();
        });
        $.ajax({
            method: "GET",
            url: "js/data/get-player-tier-heroic.php"
        }).done(function(data) {
            var players = [];
            var playersItemsCount = [];
            var bg_colors = [];
            for (var i = 0; i < data.length; i++) {
                players.push(data[i].player);
                playersItemsCount.push(data[i].num);
                bg_colors.push(colorByClass(data[i].class));
            }

            lootTosTierByDifficultyChart.data.datasets[1].data = playersItemsCount;
            lootTosTierByDifficultyChart.data.labels = players;

            //lootTosTierByDifficultyChart.data.datasets[1].backgroundColor = bg_colors;
            //lootTosTierByDifficultyChart.data.datasets[1].borderColor = bg_colors;
            lootTosTierByDifficultyChart.update();
        });
        $.ajax({
            method: "GET",
            url: "js/data/get-player-tier-mythic.php"
        }).done(function(data) {
            var dataArray = [];
            var players = [];
            var playersItemsCount = [];
            var bg_colors = [];
            for (var i = 0; i < data.length; i++) {
                players.push(data[i].player);
                playersItemsCount.push(data[i].num);
                bg_colors.push(colorByClass(data[i].class));
            }

            lootTosTierByDifficultyChart.data.datasets[2].data = playersItemsCount;
            lootTosTierByDifficultyChart.data.labels = players;

            //lootTosTierByDifficultyChart.data.datasets[2].backgroundColor = bg_colors;
            //lootTosTierByDifficultyChart.data.datasets[2].borderColor = bg_colors;
            lootTosTierByDifficultyChart.update();
        });

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

var classColors = [
    'rgba(231, 76, 60,0.5)', //dk
    'rgba(142, 68, 173,0.5)', //dh
    'rgba(230, 126, 34,0.5)', //druid
    'rgba(39, 174, 96,0.5)', //hunter
    'rgba(60, 177, 255,0.5)', //mage
    'rgba(26, 188, 156,0.5)', //monk
    'rgba(240,98,146 ,0.5)', //paladin
    'rgba(189, 195, 199,0.5)', //priest
    'rgba(241, 196, 15,0.5)', //rogue
    'rgba(31, 114, 168,0.5)', //shaman
    'rgba(132,117,69,0.5)' //warrior
];

function colorByClass(className) {
    switch (className.toLowerCase()) {
        case 'deathknight':
            return classColors[0];
            break;
        case 'demonhunter':
            return classColors[1];
            break;
        case 'druid':
            return classColors[2];
            break;
        case 'hunter':
            return classColors[3];
            break;
        case 'mage':
            return classColors[4];
            break;
        case 'monk':
            return classColors[5];
            break;
        case 'paladin':
            return classColors[6];
            break;
        case 'priest':
            return classColors[7];
            break;
        case 'rogue':
            return classColors[8];
            break;
        case 'shaman':
            return classColors[9];
            break;
        case 'warrior':
            return classColors[10];
            break;
        default:
            return 'rgba(44, 62, 80,1.0)';
            break;
    }
}
