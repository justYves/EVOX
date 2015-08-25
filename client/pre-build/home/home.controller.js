app.controller('HomeController', function($scope, $http) {
	// $(function() {
	//     $('body').on('click', '.page-scroll a', function(event) {
	//         var $anchor = $(this);
	//         $('html, body').stop().animate({
	//             scrollTop: $($anchor.attr('href')).offset().top
	//         }, 1500, 'easeInOutExpo');
	//         // event.preventDefault();
	//     });
	// });

	$scope.toLogin = function() {
		$state.go('login');
	};
});