(function(){

	var app = angular.module("tournamentOrganizer", []);

	var RegistrationController = function($location){

		 var $pickButton = $("#armyBtn");
            $("#armyDropdown li a").on("click", function () {
                var army = $(this).text();
                $pickButton.text(army);
            });

            $("#entryBtnNo").on("click", function () {
                $(this).removeClass("btn-default").addClass("btn-danger");
                $("#entryBtnYes").removeClass("btn-success").addClass("btn-default");
            });

            $("#entryBtnYes").on("click", function () {
                $(this).removeClass("btn-default").addClass("btn-success");
                $("#entryBtnNo").removeClass("btn-danger").addClass("btn-default");
            });

            $("#submitPlayerButton").on("click", function () {
                if ($("#entryBtnNo").hasClass("btn-danger")) {
                    entryPaid = "No";
                } else {
                    entryPaid = "Yes";
                }


		
	}

	app.controller("RegistrationController", ["$location", RegistrationController]);


})());