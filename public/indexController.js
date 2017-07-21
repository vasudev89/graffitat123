app.controller("indexController",['$scope','$location','$window','$http',function(  $scope , $location, $window, $http){

	$scope.SignupSuccess = '';
	$scope.SignupFailure = '';

	$scope.LoginTest = '';

	$scope.LoginEmail = '';
	$scope.LoginPassword = '';
	
	$scope.InvalidLogin = false;
	$scope.LoginStatus = true;
	
	if( $window.sessionStorage.getItem("currentUser") != null && $window.sessionStorage.getItem("currentUser") != undefined )
	{
		$scope.LoginEmail = $window.sessionStorage.getItem("currentUser");
		$scope.LoginStatus = false;
	}
	
	
	$scope.logout = function()
	{
		$window.sessionStorage.clear();
		$scope.LoginStatus = true;
		
		$location.path('/home');
	}
	
	$scope.Login = function()
	{
		var json = 	{
				"Email" : $scope.LoginEmail ,
				"Password" : $scope.LoginPassword
			};

		console.log(json);
		
		$UserService.UserLogin(json).then(function(response){
			console.log(response);
			
			if( response.msg == 'Invalid Login' )
			{
				$scope.InvalidLogin = true;
				window.setTimeout(function(){
					$scope.$apply( $scope.InvalidLogin = false );					
				}, 5000);
			}	
			else
			{
				$window.sessionStorage.setItem("currentUser", $scope.LoginEmail);
				$location.path('/profile');
				$scope.LoginStatus = false;
			}
				
			
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

	$scope.Qualifications = '';
	$scope.QualificationsError = false;
	$scope.QualificationsTouched = false;
	$scope.ValidateQualifications = function()
	{
		$scope.QualificationsTouched = true;
		var reg = /^$/;
		$scope.QualificationsError = reg.test( $scope.Qualifications );
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
					$scope.QualificationsError || !$scope.QualificationsTouched || 
					$scope.PhoneError || !$scope.PhoneTouched;
		$scope.PasswordMismatch = false;
	}

	$scope.Reset = function(){
		$scope.Username = $scope.Email = $scope.Password = $scope.ConfirmPassword = $scope.Location = $scope.Qualifications = $scope.Phone = $scope.Date = '';
		$scope.UsernameError = $scope.EmailError = $scope.PasswordError = $scope.ConfirmPasswordError = $scope.LocationError = $scope.QualificationsError = $scope.PhoneError = $scope.DateError = false;
		$scope.UsernameTouched = $scope.EmailTouched = $scope.PasswordTouched = $scope.ConfirmPasswordTouched = $scope.LocationTouched = $scope.QualificationsTouched = $scope.PhoneTouched = $scope.DateTouched = false;

		$scope.OverallError = true;
	}
	
	$scope.PasswordMismatch = false;
	
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
	
	$scope.ServerResponse = '';
	
	$scope.showMentorSignupProgress = false;

	$scope.SubmitMentorSignUp = function()
	{
		
		if( $scope.Date == '' || $scope.Date == null )
			$scope.DateEmpty = true;
		
		if( $scope.DateEmpty != true )
		{
			$scope.showMentorSignupProgress = true;

			
			var day = $scope.Date.getDate(); //Date of the month: 2 in our example
			day = (day.length == 1)?"0" + day : day;
			var month = $scope.Date.getMonth() + 1; //Month of the Year: 0-based index, so 1 in our example
			month = (month.length == 1)?"0" + month : month;
			var year = $scope.Date.getFullYear() //Year: 2013

			var date = day + '-' + month + '-' + year;

			var json = 	{
					"Username" : $scope.Username,
					"Email" : $scope.Email ,
					"Password" : $scope.Password,
					//"ConfirmPassword" : $scope.ConfirmPassword,
					"Location" : $scope.Location,
					"Date" : date,
					"Phone" : $scope.Phone,
					"Gender" : $scope.Gender,
					"Qualifications" : $scope.Qualifications
				};
	
			console.log(json);

			$http({
		        url: '/mentorSignup',
		        method: "POST",
		        data: json,
		        json: true,
		        headers: {
					        "content-type": "application/json",  // <--Very important!!!
					    }
		    })
		    .then(function(response) {
		            if( response.data.message == 'Mentor Signup Successful' )
		            {
		            	showSnackBar1('Mentor Signup Successful','Green');
		            	$scope.Reset();
		            }
		            else if( response.data.message == 'Email In Use' )
		            	showSnackBar1('Email Already In Use','Red');
		            else
		            	showSnackBar1('Mentor Signup Failed','Red');

		            $scope.showMentorSignupProgress = false;
		    
		    }, 
		    function(response) { // optional
		            console.log( "Failed" )
		    });

		}
		
		
	}
}]);