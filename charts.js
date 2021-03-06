var nightmode = false;
var nm_count = 0;
//this is a fucking dumb ass bug

var color_text = '#333';
var color_bg = '#fff';
var color_gridlines = 'rgba(213, 213, 213, 0.7)';

var raidTier;

function toggleNightMode() {
    if (nightmode) {
        //color_text = 'rgba(191, 191, 191, 1)';
        color_text = 'rgba(207, 207, 207,1)';
        color_bg = 'rgba(51, 51, 51, 1)';
        color_gridlines = 'rgba(213, 213, 213, 0.2)';
    } else {
        color_text = '#333';
        color_bg = '#fff';
        color_gridlines = 'rgba(213, 213, 213, 0.7)';

    }
    $('body').css('backgroundColor', color_bg);
    $('.page-header').css('color', color_text);
}

function drawGrids() {
    createLootHistoryBarChart();
    createLootByClassPieChart();
    createLootByTosDifficultyPieChart();
    createLootByResponsePieChart();
    createLootTosTierByPlayerPieChart();
    createLootTosTierByDifficultyChart();
    createLootTosTierTokenDistributionChart();
    createRaidersByClassPieChart();
    createLoaHistoryBarChart();
}

$(document).ready(function() {
    raidTier = Cookies.get("disappointedloa_raidtier");
    if (!raidTier) {
        raidTier = "Tomb of Sargeras";
        setRaidTier();
    }
    //get nightmode from cookies
    getNightmodeCookie();
    toggleNightMode();
    drawGrids();

    if (nightmode) {
        $("#nightmodeToggle").find('input').prop('checked', true);
    }

    $('#nightmodeToggle').on('click', function() {
        if (nm_count == 0) {
            nightmode = !nightmode;
            Cookies.set("disappointedloa_nightmode", nightmode);
            toggleNightMode();
            drawGrids();
            nm_count++;
        } else {
            nm_count = 0;
        }
    });

    $('#raid-selector ul li').on('click', function() {
        if (raidTier !== $(this).text()) {
            raidTier = $(this).text();
            setRaidTier();
            drawGrids();
        }
    });
});

function setRaidTier() {
    $("#raid-selector-active a").text(raidTier);
    Cookies.set("disappointedloa_raidtier", raidTier);
}

function getNightmodeCookie() {
    nightmode = Cookies.get("disappointedloa_nightmode");
    if (nightmode == 'true' || nightmode == true) {
        nightmode = true;
    } else {
        nightmode = false;
    }
}

function createLootHistoryBarChart() {
    var ctx = $("#myChart");
    var lootHistoryBarChart = new Chart(ctx, {
        type: 'bar',
        responsive: true,
        data: {
            datasets: [{
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Players who received items not equal to xmog, OS or Pass',
                fontColor: color_text
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: color_text
                    },
                    gridLines: {
                        color: color_gridlines
                    }
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        fontColor: color_text
                    },
                    gridLines: {
                        color: color_gridlines
                    }
                }]
            },
            chartArea: {
                backgroundColor: color_bg
            }
        }
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-unique-player-gear-count.php?raidTier=" + raidTier
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
}

function createLootByClassPieChart() {
    var lootByClassChart = $('#lootByClassChart');
    var lootByClassPieChart = new Chart(lootByClassChart, {
        type: 'pie',
        responsive: true,
        data: {
            labels: [],
            datasets: [{
                backgroundColor: classColors,
                data: []
            }],
            borderWidth: 1
        },
        options: {
            title: {
                display: true,
                text: 'Loot distribution by class',
                fontColor: color_text
            },
            legend: {
                labels: {
                    fontColor: color_text
                }
            },
            xAxes: [{
                ticks: {
                    autoSkip: false,
                    fontColor: color_text
                },
                gridLines: {
                    color: color_gridlines
                }
            }]
        }
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-loot-by-class.php?raidTier=" + raidTier
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
}

function createLootByResponsePieChart() {
    var lootByResponseChart = $('#lootByResponseChart');
    var lootByResponsePieChart = new Chart(lootByResponseChart, {
        type: 'pie',
        responsive: true,
        data: {
            labels: [],
            datasets: [{
                backgroundColor: classColors,
                data: []
            }],
            borderWidth: 1
        },
        options: {
            title: {
                display: true,
                text: 'Loot distribution by response',
                fontColor: color_text
            },
            legend: {
                labels: {
                    fontColor: color_text
                }
            },
            xAxes: [{
                ticks: {
                    autoSkip: false,
                    fontColor: color_text
                },
                gridLines: {
                    color: color_gridlines
                }
            }]
        }
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-loot-by-response.php?raidTier=" + raidTier
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

}

function createLootByTosDifficultyPieChart() {
    // ***** Loot distribution by the current raid *****
    var lootByTosDifficultyChart = $('#lootByTosDifficultyChart');
    var lootByTosDifficultyPieChart = new Chart(lootByTosDifficultyChart, {
        type: 'pie',
        responsive: true,
        data: {
            labels: [],
            datasets: [{
                backgroundColor: ['rgba(230, 126, 34,0.7)', //heroic
                    'rgba(231, 76, 60,0.7)', //mythic
                    'rgba(241, 196, 15,0.7)', //normal
                ],
                data: []
            }],
            borderWidth: 1
        },
        options: {
            title: {
                display: true,
                text: 'Loot distribution by ToS Difficulty',
                fontColor: color_text
            },
            legend: {
                labels: {
                    fontColor: color_text
                }
            },
            xAxes: [{
                ticks: {
                    autoSkip: false,
                    fontColor: color_text
                },
                gridLines: {
                    color: color_gridlines
                }
            }]
        }
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-loot-by-raid-difficulty.php?raidTier=" + raidTier
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
}

function createLootTosTierByPlayerPieChart() {
    // ***** Players who have received tier *****
    var lootTosTierByPlayer = $("#lootTosTierByPlayer");
    var lootTosTierByPlayerPieChart = new Chart(lootTosTierByPlayer, {
        type: 'bar',
        responsive: true,
        data: {
            datasets: [{
                data: []
            }],
            borderWidth: 1
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Tier distribution between players on all difficulties for all response types',
                fontColor: color_text
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: color_text
                    },
                    gridLines: {
                        color: color_gridlines
                    }
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        fontColor: color_text
                    },
                    gridLines: {
                        color: color_gridlines
                    }
                }]
            }
        }
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-player-tier-all.php?raidTier=" + raidTier
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
}

function createLootTosTierByDifficultyChart() {
    // ***** Players who have received any tier per difficulty *****
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
                text: 'Tier distribution between players by difficulty',
                fontColor: color_text
            },
            scales: {
                yAxes: [{
                    ticks: {
                        stepSize: 1,
                        fontColor: color_text
                    },
                    gridLines: {
                        color: color_gridlines
                    }
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        fontColor: color_text
                    },
                    gridLines: {
                        color: color_gridlines
                    }
                }]
            },
            legend: {
                labels: {
                    fontColor: color_text
                }
            }
        }
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-active-raiders.php"
    }).done(function(data) {
        var lblArray = [];
        for (var i = 0; i < data.length; i++) {
            lblArray.push(data[i].player);
        }
        lootTosTierByDifficultyChart.data.labels = lblArray;
        $.ajax({
            method: "GET",
            url: "js/data/get-player-tier-normal.php?raidTier=" + raidTier
        }).done(function(data) {
            var playersItemsCount = Array.apply(null, Array(lblArray.length)).map(function() {
                return 0
            });
            for (var i = 0; i < data.length; i++) {
                //playersItemsCount.push(data[i].num);
                for (var x = 0; x < lblArray.length; x++) {
                    if (lblArray[x] == data[i].player) {
                        playersItemsCount[x] = data[i].num;
                    }
                }
            }

            lootTosTierByDifficultyChart.data.datasets[0].data = playersItemsCount;
            lootTosTierByDifficultyChart.update();
        });
        $.ajax({
            method: "GET",
            url: "js/data/get-player-tier-heroic.php?raidTier=" + raidTier
        }).done(function(data) {
            var playersItemsCount = Array.apply(null, Array(lblArray.length)).map(function() {
                return 0
            });
            for (var i = 0; i < data.length; i++) {
                //playersItemsCount.push(data[i].num);
                for (var x = 0; x < lblArray.length; x++) {
                    if (lblArray[x] == data[i].player) {
                        playersItemsCount[x] = data[i].num;
                        break;
                    }
                }
            }

            lootTosTierByDifficultyChart.data.datasets[1].data = playersItemsCount;
            lootTosTierByDifficultyChart.update();
        });
        $.ajax({
            method: "GET",
            url: "js/data/get-player-tier-mythic.php?raidTier=" + raidTier
        }).done(function(data) {
            var playersItemsCount = Array.apply(null, Array(lblArray.length)).map(function() {
                return 0
            });
            for (var i = 0; i < data.length; i++) {
                //playersItemsCount.push(data[i].num);
                for (var x = 0; x < lblArray.length; x++) {
                    if (lblArray[x] == data[i].player) {
                        playersItemsCount[x] = data[i].num;
                    }
                }
            }

            lootTosTierByDifficultyChart.data.datasets[2].data = playersItemsCount;
            lootTosTierByDifficultyChart.update();
        });
    });
}

function createLootTosTierTokenDistributionChart() {
    //lootTosTierTokenDistribution
    // ***** Tier Token drops by All and every difficulty for all responses and raiders *****
    var lootTosTierTokenDistribution = $('#lootTosTierTokenDistribution');
    var lootTosTierTokenDistributionChart = new Chart(lootTosTierTokenDistribution, {
        type: 'bar',
        responsive: true,
        data: {
            labels: ['Vanquisher', 'Conqueror', 'Protector'],
            datasets: [{
                label: 'All',
                backgroundColor: 'rgba(149, 165, 166,1.0)',
                borderColor: 'rgba(149, 165, 166,1.0)',
                data: []
            }, {
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
                text: 'Tier Token drops by all and every difficulty for all responses and raider statuses',
                fontColor: color_text
            },
            legend: {
                labels: {
                    fontColor: color_text
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 5,
                        fontColor: color_text
                    },
                    gridLines: {
                        color: color_gridlines
                    }
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        fontColor: color_text
                    },
                    gridLines: {
                        color: color_gridlines
                    }
                }]
            }
        }
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-tokens-all.php?raidTier=" + raidTier
    }).done(function(data) {
        var tokensCount = sortTierArray(data);
        lootTosTierTokenDistributionChart.data.datasets[0].data = tokensCount;
        lootTosTierTokenDistributionChart.update();
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-tokens-normal.php?raidTier=" + raidTier
    }).done(function(data) {
        var tokensCount = sortTierArray(data);
        lootTosTierTokenDistributionChart.data.datasets[1].data = tokensCount;
        lootTosTierTokenDistributionChart.update();
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-tokens-heroic.php?raidTier=" + raidTier
    }).done(function(data) {
        var tokensCount = sortTierArray(data);
        lootTosTierTokenDistributionChart.data.datasets[2].data = tokensCount;
        lootTosTierTokenDistributionChart.update();
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-tokens-mythic.php?raidTier=" + raidTier
    }).done(function(data) {
        var tokensCount = sortTierArray(data);
        lootTosTierTokenDistributionChart.data.datasets[3].data = tokensCount;
        lootTosTierTokenDistributionChart.update();
    });
}

function createRaidersByClassPieChart() {
    // ***** Raider distribution by class *****
    var raidersByClass = $('#raidersByClass');
    var raidersByClassPieChart = new Chart(raidersByClass, {
        type: 'bar',
        responsive: true,
        data: {
            labels: [],
            datasets: [{
                backgroundColor: [],
                data: []
            }],
            borderWidth: 1
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Active raider distribution by class',
                fontColor: color_text
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1,
                        fontColor: color_text
                    },
                    gridLines: {
                        color: color_gridlines
                    }
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        fontColor: color_text
                    },
                    gridLines: {
                        color: color_gridlines
                    }
                }]
            }
        }
    });
    $.ajax({
        method: "GET",
        url: "js/data/get-active-raiders-by-class.php"
    }).done(function(data) {
        var class_ = [];
        var class_count = [];
        var bg_colors = [];
        for (var i = 0; i < data.length; i++) {
            class_.push(data[i].class);
            class_count.push(data[i].num);
            bg_colors.push(colorByClass(data[i].class));
        }
        raidersByClassPieChart.data.datasets[0].data = class_count;
        raidersByClassPieChart.data.labels = class_;

        raidersByClassPieChart.data.datasets[0].backgroundColor = bg_colors;
        raidersByClassPieChart.data.datasets[0].borderColor = bg_colors;
        raidersByClassPieChart.update();
    });
}

function createLoaHistoryBarChart() {
    var ctx_loa = $("#myLoaChart");
    var loaHistoryBarChart = new Chart(ctx_loa, {
        type: 'bar',
        responsive: true,
        data: {
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
                text: '# of Normal or NoLoA LoAs',
                fontColor: color_text
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: color_text,
                        stepSize: 1
                    },
                    gridLines: {
                        color: color_gridlines
                    }
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        fontColor: color_text
                    },
                    gridLines: {
                        color: color_gridlines
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
}


function sortTierArray(tierArray) {
    var newArray = [];
    for (var i = 0; i < tierArray.length; i++) {
        if (tierArray[i].item.toLowerCase().includes('vanquisher')) {
            newArray[0] = tierArray[i].num;
        } else if (tierArray[i].item.toLowerCase().includes('conqueror')) {
            newArray[1] = tierArray[i].num;
        } else if (tierArray[i].item.toLowerCase().includes('protector')) {
            newArray[2] = tierArray[i].num;
        }
    }
    return newArray;
}

Chart.pluginService.register({
    beforeDraw: function(chart, easing) {
        if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
            var helpers = Chart.helpers;
            var ctx = chart.chart.ctx;
            var chartArea = chart.chartArea;

            ctx.save();
            ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
            ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
            ctx.restore();
        }
    }
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
    'rgba(231, 76, 60,0.7)', //dk
    'rgba(155, 89, 182,0.7)', //dh
    'rgba(230, 126, 34,0.7)', //druid
    'rgba(39, 174, 96,0.7)', //hunter
    'rgba(60, 177, 255,0.7)', //mage
    'rgba(26, 188, 156,0.7)', //monk
    'rgba(240,98,146 ,0.7)', //paladin
    'rgba(189, 195, 199,0.7)', //priest
    'rgba(241, 196, 15,0.7)', //rogue
    'rgba(31, 114, 168,0.7)', //shaman
    'rgba(142, 68, 173,0.7)', //warlock
    'rgba(132,117,69,0.7)' //warrior
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
        case 'warlock':
            return classColors[10];
            break;
        case 'warrior':
            return classColors[11];
            break;
        default:
            return 'rgba(44, 62, 80,1.0)';
            break;
    }
}
