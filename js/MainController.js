(function () {

    var app = angular.module("tournamentOrganizer");
    var MainController = function ($scope, $location) { //ADD playerhandler here

        $scope.round = 0;
        $scope.tableNumberTotal = 0;

        $("document").ready(function () {
            console.log("ready!");

            //Set Events
            $("#createPairingsBtn").on("click", createRoundPairings);

            $("#clearStorage").on("click", function () {
                console.log("clear localStorage");
                var playerIdList = JSON.parse(localStorage.getItem("playerIdList"));
                console.log(playerIdList);

                playerIdList.id.forEach(function (id) {
                    $("#" + id).remove();
                    removeLocalStoragePlayerData(id);
                });
                localStorage.removeItem("playerIdList");
                localStorage.removeItem("roundStandings");
                var initPlayerData = {
                    "id": []
                };
                localStorage.setItem("playerIdList", JSON.stringify(initPlayerData));
            });

           

                var isIdUnique = false;
                var playerIdList = JSON.parse(localStorage.getItem("playerIdList"));
                var playerId = generatePlayerId();
                var arrLength = playerIdList.id.length;



                if (playerIdList.id === null) {
                    playerIdList.id.push(generatePlayerId());
                } else {
                    while (!isIdUnique) {
                        playerId = generatePlayerId();
                        for (var i = 0; i <= arrLength; i++) {
                            if (i === arrLength) {
                                playerIdList.id.push(playerId);
                                isIdUnique = true;
                            } else if (playerIdList.id[i] == playerId) {
                                break;
                            }
                        }
                    }
                }

                console.log("playerIdList.id.length:" + arrLength);
                console.log(playerIdList.id);

                //grab input values
                var firstName = $("#firstNameInput").val();
                var lastName = $("#lastNameInput").val();
                var army = $("#armyBtn").html();
                var email = $("#emailInput").val();

                //set input fields to blank
                $("#firstNameInput:text").val("");
                $("#lastNameInput:text").val("");
                $("#armyInput:text").val("");
                $("#emailInput").val("");

                var newDate = new Date();
                var time = newDate.getHours() + ":" + (newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes());

                //Create playerData JSON obj
                var playerData = {
                    "playerId": playerId,
                    "firstName": firstName,
                    "lastName": lastName,
                    "army": army,
                    "email": email,
                    "time": time,
                    "battlePoints": "",
                    "sportsmanship": "",
                    "painting": ""
                };

                addLocalStoragePlayerData(playerData, playerIdList);

                //append new row to table
                $("#playerRegistrationTable tbody").append("<tr id=" + playerId + ">" +
                    "<td>" + playerId + "</td>" +
                    "<td>" + firstName + "</td>" +
                    "<td>" + lastName + "</td>" +
                    "<td>" + army + "</td>" +
                    "<td>" + entryPaid + "</td>" +
                    "<td>" + time + "</td>" +
                    '<td><button type="button" class="btn btn-danger">X</button>' +
                    "</tr>");

                setRemoveButton(playerId);
            });

            //load LocalStorage
            var playerIdList = JSON.parse(localStorage.getItem("playerIdList"));
            if (playerIdList === null) {
                var initPlayerData = {
                    "id": []
                };
                localStorage.setItem("playerIdList", JSON.stringify(initPlayerData));
            }
        });

        /*
         * Function that adds sets the onclick of each remove button form player table
         */
        function setRemoveButton(playerId) {
            $("#" + playerId + " button").on("click", function () {
                $("#" + playerId).remove();
                removeLocalStoragePlayerData(playerId);
            });
        }

        /*
         * Function that adds player reg data to localStorage
         */
        function addLocalStoragePlayerData(playerData, playerIdList) {
            //send updated playerIdList to localStorage	
            localStorage.setItem("playerIdList", JSON.stringify(playerIdList));
            //Create new item in localStorage that holds the player's data
            localStorage.setItem(playerData.playerId, JSON.stringify(playerData));
        }

        /*
         * Function that removes player reg data to localStorage
         */
        function removeLocalStoragePlayerData(playerId) {
            //get all registered players from localStorage 
            var playerIdList = JSON.parse(localStorage.getItem("playerIdList"));
            var removedPlayer = playerIdList.id.indexOf(playerId);
            playerIdList.id.splice(removedPlayer, 1);

            //remove player Id from master list
            localStorage.setItem("playerIdList", JSON.stringify(playerIdList));
            //remove player data
            localStorage.removeItem(playerId);
        }

        /*
         * Function that returns a random number between 1000-2000
         */
        function generatePlayerId() {
            return Math.floor(Math.random() * (2000 - 1000 + 1) + 1000);
        }

        /*
         *Update UI to start new round and create pairings
         */
        function createRoundPairings() {
            //$("#tournamentSetup").addClass("hide");
            $("#tournamentStandings").addClass("hide");
            $("#submitPlayerButton").addClass("disabled");
            $scope.round++;

            //TODO: implement round tracking to check specific cases;

            var playerIdList = JSON.parse(localStorage.getItem("playerIdList"));
            var playerPairingsRaw = createShufflePairing(playerIdList.id);
            var playerData = new Array();

            playerPairingsRaw.forEach(function (entry) {
                playerData.push(JSON.parse(localStorage.getItem(entry)));
            });
            console.log("playerData");
            console.log(playerData);

            var player1, player2;
            var roundPairings = new Array([]);

            var i, j;
            var tableNumber = 0;

            for (i = 0, j = 1; j < playerData.length; i += 2, j += 2) {
                player1 = playerData[i];
                player2 = playerData[j];
                //TODO: Check first round pairings as to not have same armies play against each other 
                roundPairings.push([]);
                roundPairings[tableNumber].push(player1);
                roundPairings[tableNumber].push(player2);
                buildRoundTable(tableNumber, roundPairings[tableNumber]);
                tableNumber++;
                $scope.tableNumberTotal++;
            };
            roundPairings.pop();

        }

        /*
         * Shuffle first round pairings
         */
        function createShufflePairing(playerIdList) {
            for (var i = playerIdList.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = playerIdList[i];
                playerIdList[i] = playerIdList[j];
                playerIdList[j] = temp;
            }
            console.log("shuffled:");
            console.log(playerIdList);
            return playerIdList;
        }

        /*
         *Creates and populates the entry panel for this pairing
         */
        function buildRoundTable(tableNumber, roundPairings) {
            console.log("roundPaings in buildRoundTable");
            console.log(roundPairings);

            var adjTableNumber = tableNumber + 1;
            var $resultTemplate = $("#roundResultPanel").clone();
            $("#createPairingsBtn").addClass("disabled")
            $("#roundResults").removeClass("hide").find("h4").text("Round " + $scope.round);
            $("#roundResults h4").val("Round " + $scope.round);
            $("#roundResults").append($resultTemplate.attr('id', "round-" + $scope.round + "-" + adjTableNumber));


            $resultTemplate.find(".panel-title").text("Round " + $scope.round + " - Table " + adjTableNumber);
            $resultTemplate.find("#playerOne").text(roundPairings[0].firstName + " " + roundPairings[0].lastName);
            $resultTemplate.find("#playerTwo").text(roundPairings[1].firstName + " " + roundPairings[1].lastName);

            $resultTemplate.find("#playerOneId").text("(" + roundPairings[0].playerId + ")");
            $resultTemplate.find("#playerTwoId").text("(" + roundPairings[1].playerId + ")");

            $resultTemplate.find("button").on("click", function () {

                var roundEntryData = [{
                    "id": roundPairings[0].playerId,
                    "battlePoints": $resultTemplate.find("#battlePointsPlayerOne").val(),
                    "sportsmanship": $resultTemplate.find("#sportsmanshipPlayerOne").val(),
                    "painting": $resultTemplate.find("#paintingPlayerOne").val()
                }, {
                    "id": roundPairings[1].playerId,
                    "battlePoints": $resultTemplate.find("#battlePointsPlayerTwo").val(),
                    "sportsmanship": $resultTemplate.find("#sportsmanshipPlayerTwo").val(),
                    "painting": $resultTemplate.find("#paintingPlayerTwo").val()
                }];
                updateStandings(roundEntryData);
                $resultTemplate.remove();
                --$scope.tableNumberTotal;
                if ($scope.tableNumberTotal === 0) {
                    $("#roundResults").addClass("hide");
                    $("#createPairingsBtn").removeClass("disabled");

                    if ($scope.round === 3) {
                        var checkStandings = JSON.parse(localStorage.getItem("roundStandings"));
                        var winner = JSON.parse(localStorage.getItem(checkStandings[0].playerId));
                        $("#tournamentModal p").text("Congrats to the winnder " + winner.firstName + " " + winner.lastName + "!");
                        $("#tournamentModal").removeClass("hide").modal('show');
                    }
                    localStorage.removeItem("roundStandings");
                }
            });
            $resultTemplate.removeClass("hide");
        }

        /*
         * Update the Standings table with round data
         */
        function updateStandings(roundEntryData) {
            $("#tournamentStandings").removeClass("hide");

            var playerOneData = JSON.parse(localStorage.getItem(roundEntryData[0].id));
            var playerTwoData = JSON.parse(localStorage.getItem(roundEntryData[1].id));

            if ($.isNumeric(playerOneData.battlePoints)) {
                playerOneData.battlePoints = parseInt(playerOneData.battlePoints) + parseInt(roundEntryData[0].battlePoints);
            } else {
                playerOneData.battlePoints = parseInt(roundEntryData[0].battlePoints);
            }

            if ($.isNumeric(playerOneData.sportsmanship)) {
                playerOneData.sportsmanship = parseInt(playerOneData.sportsmanship) + parseInt(roundEntryData[0].sportsmanship);
            } else {
                playerOneData.sportsmanship = parseInt(roundEntryData[0].battlePoints);
            }

            if ($.isNumeric(playerOneData.painting)) {
                playerOneData.painting = parseInt(playerOneData.painting) + parseInt(roundEntryData[0].painting);
            } else {
                playerOneData.painting = parseInt(roundEntryData[0].painting);
            }

            localStorage.setItem(playerOneData.playerId, JSON.stringify(playerOneData));

            if ($.isNumeric(playerTwoData.battlePoints)) {
                playerTwoData.battlePoints = parseInt(playerTwoData.battlePoints) + parseInt(roundEntryData[1].battlePoints);
            } else {
                playerTwoData.battlePoints = parseInt(roundEntryData[1].battlePoints);
            }

            if ($.isNumeric(playerTwoData.sportsmanship)) {
                playerTwoData.sportsmanship = parseInt(playerTwoData.sportsmanship) + parseInt(roundEntryData[1].sportsmanship);
            } else {
                playerTwoData.sportsmanship = parseInt(roundEntryData[1].battlePoints);
            }

            if ($.isNumeric(playerTwoData.painting)) {
                playerTwoData.painting = parseInt(playerTwoData.painting) + parseInt(roundEntryData[1].painting);
            } else {
                playerTwoData.painting = parseInt(roundEntryData[1].painting);
            }

            localStorage.setItem(playerTwoData.playerId, JSON.stringify(playerTwoData));


            var roundStandings = JSON.parse(localStorage.getItem("roundStandings"));

            if (roundStandings === null) {
                roundStandings = [{
                    "playerId": playerOneData.playerId,
                    "battlePoints": playerOneData.battlePoints
                }, {
                    "playerId": playerTwoData.playerId,
                    "battlePoints": playerTwoData.battlePoints
                }];
            } else {
                roundStandings.push({
                    "playerId": playerOneData.playerId,
                    "battlePoints": playerOneData.battlePoints
                });
                roundStandings.push({
                    "playerId": playerTwoData.playerId,
                    "battlePoints": playerTwoData.battlePoints
                });
            }

            roundStandings = roundStandings.sort(function (a, b) {
                return a.battlePoints < b.battlePoints;
            });
            localStorage.setItem("roundStandings", JSON.stringify(roundStandings));

            $("#standingsTableBody").empty();
            var $standings = $("#standingsTableBody");

            roundStandings.forEach(function (entry) {
                var tempPlayer = JSON.parse(localStorage.getItem(entry.playerId));
                $standings.append("<tr>" +
                    "<td>" + tempPlayer.playerId + "</td>" +
                    "<td>" + tempPlayer.firstName + "</td>" +
                    "<td>" + tempPlayer.lastName + "</td>" +
                    "<td>" + tempPlayer.army + "</td>" +
                    "<td>" + tempPlayer.battlePoints + "</td>" +
                    "<td>" + tempPlayer.sportsmanship + "</td>" +
                    "<td>" + tempPlayer.painting + "</td>" +
                    "</tr>");
            });
        }
    };

    app.controller("MainController", ["$scope", "$location", MainController]);

}());