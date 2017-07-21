app.controller("homeController",['$scope','$location','$window','$http',function(  $scope , $location, $window, $http){
	
	$scope.SignupSuccess = '';
	$scope.SignupFailure = '';

	$scope.LoginTest = '';

	$scope.LoginEmail = '';
	$scope.LoginPassword = '';
	
	$scope.InvalidLogin = false;
	$scope.LoginStatus = true;
	
	$scope.LoginProgress = false;

	if( $window.sessionStorage.getItem("currentUser") != null && $window.sessionStorage.getItem("currentUser") != undefined )
	{
		//$scope.LoginEmail = $window.sessionStorage.getItem("currentUser");
		//$scope.LoginStatus = false;
	}
	
	
	$scope.logout = function()
	{
		$window.sessionStorage.clear();
		$scope.LoginStatus = true;
		
		$location.path('/home');
	}
	
	$scope.AttemptLogin = function()
	{
		var json = 	{
				"Email" : $scope.LoginEmail ,
				"Password" : $scope.LoginPassword
			};

		console.log(json);
		
		showMasterProgress(true);
		$scope.LoginProgress = true;

		$http({
		        url: '/attemptLogin',
		        method: "POST",
		        data: json,
		        json: true,
		        headers: {
					        "content-type": "application/json",  // <--Very important!!!
					    }
		    })
		    .then(function(response) {

		    		showMasterProgress(false);
					$scope.LoginProgress = false ;

					console.log( response.data );

		    		if( response.data.message == 'Invalid Credentials' )
		    		{
		    			showSnackBar('Invalid Credentials','Red');
		    		}
		    		else if( response.data.message == 'Something Went Wrong' )
		    		{
		    			showSnackBar('Something Went Wrong','Red');
		    		}
		    		else if( response.data.message == 'Login Successful' )
		    		{
		    			console.log( response.data );
		    			showSnackBar('Login Successful','Green');

		    			var navbar = 
		    			"<ul class='nav'>" + 
							"<li><a class='navigation-element' href='#/profile'>Profile</a></li>" +
							"<li><a class='navigation-element' href='#/logout'>Log Out</a></li>" +
						"</ul>"
						;

						$("#navigation").html(navbar);

						var output = '{';

						for (property in response.data.Data) {
						    output += '"' + property + '": "' + response.data.Data[property]+'",';
						}
						output = output.substring(0, output.length - 1);
						output += '}';
						console.log(output);

						$window.sessionStorage.setItem("currentUser", output );

						console.log( $window.sessionStorage.getItem("currentUser") );

						$location.path('/masterpage');
		    		}

		    }, 
		    function(response) { // optional
		            console.log( "Failed" )
		    });
	}
	
	$scope.Username = '';
	$scope.UsernameError = false;
	$scope.UsernameTouched = false;
	$scope.ValidateUsername = function()
	{
		$scope.UsernameTouched = true;
		var reg = /^$/;
		$scope.UsernameError = reg.test( $scope.Username );
		$scope.CheckOverallError();
	}
	
	$scope.Email = '';
	$scope.EmailError = false;
	$scope.EmailTouched = false;
	$scope.ValidateEmail = function()
	{
		$scope.EmailTouched = true;
		var reg = /\S+@\S+\.\S+/;
		$scope.EmailError = !reg.test( $scope.Email );
		$scope.CheckOverallError();
	}

	$scope.Password = '';
	$scope.PasswordError = false;
	$scope.PasswordTouched = false;
	$scope.ValidatePassword = function()
	{
		$scope.PasswordTouched = true;
		var reg = /^.{8,20}$/;
		$scope.PasswordError = !reg.test( $scope.Password );
		$scope.ConfirmPasswordError = ( $scope.ConfirmPassword != $scope.Password );
		$scope.CheckOverallError();
	}

	$scope.ConfirmPassword = '';
	$scope.ConfirmPasswordError = false;
	$scope.ConfirmPasswordTouched = false;
	$scope.ValidateConfirmPassword = function()
	{
		$scope.ConfirmPasswordTouched = true;
		$scope.ConfirmPasswordError = ( $scope.ConfirmPassword != $scope.Password );
		$scope.CheckOverallError();
	}
	
	$scope.Location = '';
	$scope.LocationError = false;
	$scope.LocationTouched = false;
	$scope.ValidateLocation = function()
	{
		$scope.LocationTouched = true;
		var reg = /^$/;
		$scope.LocationError = reg.test( $scope.Location );
		$scope.CheckOverallError();
	}

	$scope.Date = '';
	$scope.DateError = false;
	$scope.DateTouched = false;
	$scope.ValidateDate = function()
	{
		$scope.DateTouched = true;
		$scope.DateError = $scope.Date == undefined;

		if( $scope.Date != undefined )
		{
			var year = $scope.Date.getFullYear();
			if( year <= 1980 || year >= 2017 )
				$scope.DateError = true;
		}

		$scope.CheckOverallError();
	}
	
	$scope.Phone = '';
	$scope.PhoneError = false;
	$scope.PhoneTouched = false;
	$scope.ValidatePhone = function()
	{
		$scope.PhoneTouched = true;
		var reg = /^[7-9][0-9]{9}$/;
		$scope.PhoneError = !reg.test( $scope.Phone );
		$scope.CheckOverallError();
	}
	
	$scope.Gender = 'Male';
	
	$scope.OverallError = true;
	$scope.CheckOverallError = function(){
		$scope.OverallError = 
					$scope.UsernameError || !$scope.UsernameTouched || 
					$scope.EmailError	|| !$scope.EmailTouched || 
					$scope.PasswordError || !$scope.PasswordTouched ||
					$scope.ConfirmPasswordError || !$scope.ConfirmPasswordTouched || 
					$scope.LocationError || !$scope.LocationTouched || 
					$scope.PhoneError || !$scope.PhoneTouched ||
					$scope.DateError || !$scope.DateTouched;
		$scope.PasswordMismatch = false;
	}

	$scope.Reset = function(){
		$scope.Username = $scope.Email = $scope.Password = $scope.ConfirmPassword = $scope.Location = $scope.AboutYourself = $scope.Phone = '';
		$scope.UsernameError = $scope.EmailError = $scope.PasswordError = $scope.ConfirmPasswordError = $scope.LocationError = $scope.PhoneError = $scope.DateError = false;
		$scope.UsernameTouched = $scope.EmailTouched = $scope.PasswordTouched = $scope.ConfirmPasswordTouched = $scope.LocationTouched = $scope.PhoneTouched = $scope.DateTouched = false;
		$scope.PasswordMismatch = false;
		$scope.OverallError = true;
	}
	
	$scope.PasswordMismatch = false;
	
	$scope.ServerResponse = '';
	
	$scope.showGreenHornSignupProgress = false;

	$scope.AboutYourself = '';

	$scope.SubmitGreenhornSignUp = function()
	{
		
		if( $scope.Date == '' || $scope.Date == null )
			$scope.DateEmpty = true;
		
		if( $scope.DateEmpty != true )
		{
			$scope.showGreenHornSignupProgress = true;

			var day = "" + $scope.Date.getDate(); //Date of the month: 2 in our example
			day = (day.length == 1)?"0" + day : day;
			var month = "" + $scope.Date.getMonth() + 1; //Month of the Year: 0-based index, so 1 in our example
			month = (month.length == 1)?"0" + month : month;
			var year = "" + $scope.Date.getFullYear() //Year: 2013

			var date = day + '/' + month + '/' + year;

			$scope.AboutYourself = ($scope.AboutYourself == undefined)?'':$scope.AboutYourself;

			var json = 	{
					"Username" : $scope.Username,
					"Email" : $scope.Email ,
					"Password" : $scope.Password,
					//"ConfirmPassword" : $scope.ConfirmPassword,
					"Location" : $scope.Location,
					"Date" : date,
					"Phone" : $scope.Phone,
					"Gender" : $scope.Gender,
					"AboutYourself" : $scope.AboutYourself
				};
	
			console.log(json);

			$http({
		        url: '/greenhornSignup',
		        method: "POST",
		        data: json,
		        json: true,
		        headers: {
					        "content-type": "application/json",  // <--Very important!!!
					    }
		    })
		    .then(function(response) {
		            
		            if( response.data.message == 'Greenhorn Signup Successful' )
		            {
		            	showSnackBar('Greenhorn Signup Successful','Green');
		            	$scope.Reset();
		            }
		            else if( response.data.message == 'Email In Use' )
		            	showSnackBar('Email Already In Use','Red');
		            else
		            	showSnackBar('Greenhorn Signup Failed','Red');

		            $scope.showGreenHornSignupProgress = false;
		    
		    }, 
		    function(response) { // optional
		            console.log( "Failed" )
		    });

		}
		
		
	}
}]);