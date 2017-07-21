	
	app.directive('onErrorSrc', function() {
		return {
			link : function(scope, element, attrs) {
				element.bind('error', function() {
					if (attrs.src != attrs.onErrorSrc) {
						attrs.$set('src', attrs.onErrorSrc);
						//disable the delete profile picture button when there is no image
						scope.picDeleted = true;
						scope.$apply();
					}
				});
			}
		}
	});
	
	app.service('fileUpload', [ '$http', function($http) {
		this.uploadFileToUrl = function(file, paramuser, uploadUrl) {
			var fd = new FormData();
			fd.append('file', file);
			//fd.append('user','vasudev89');
			return $http.post(uploadUrl, fd, {
				transformRequest : angular.identity,
				headers : {
					'Content-Type' : undefined,
					user : paramuser
				}
			}).then(function(response) {
				return response.data;
			}, function(errResponse) {
				console.error('Error while updating User');
				return "error";
			});
		}
	} ]);

	app.controller('ProfileController',['$scope','$filter','$location','$window','$http','$routeParams','fileUpload',
                                 
    function($scope,$filter,$location,$window,$http,$routeParams,$fileUpload){
		console.log("ProfileController.......");
		
		//
		if($routeParams.secondUser != undefined)
		{
				$scope.secondUser = true;
				$scope.currentUser = $routeParams.secondUser;
				console.log( $scope.secondUser );
		}
		else
		{
			$scope.secondUser = false;
			$scope.currentUser = JSON.parse( $window.sessionStorage.getItem("currentUser") );
			console.log(  $scope.currentUser  );

			$scope.currentUser.Phone = parseInt($scope.currentUser.Phone);

			$scope.dateDisplay = $scope.currentUser.Date;

			var date = $scope.currentUser.Date.split("/");

			$scope.currentUser.Date = new Date(date[1]+"/" + date[0] + "/" + date[2]);

		}
		
		//

		$scope.openFileChooser = function()
		{
			$('#trigger').trigger('click');
		};

		$scope.UpdatePageSize = function()
		{
			window.setTimeout(function()
			{
				document.getElementById("body_div").style.height = (document.getElementById("index_div_row").offsetHeight + 100) + 'px';
				
				$('#body_div').height( $('#body_div').height()<$(window).height()? $(window).height() : $('#body_div').height() );
			}, 200);
		};

		$scope.imageUpload = false;

		$scope.DeleteProfilePic = function()
		{
			

					var json = {
						Email : $scope.currentUser.Email,
						Type : $scope.currentUser.Type
					};

					$scope.stateDisabled = true;
					showMasterProgress(true);

	    			$http({
				        url: '/deleteProfilePicture',
				        method: "POST",
				        data: json,
				        json: true,
				        headers: {
							        "content-type": "application/json",  // <--Very important!!!
							    }
				    })
				    .then(function(response) {
				            
				    		if( response.data.message == 'Profile Pic Delete Failure' )
				            {
				            	showSnackBar('Profile Delete Failure','Red');
				            	
				            }
				            else if( response.data.message == 'Profile Pic Deleted Successfully' )
				            {
				            	showSnackBar('Profile Pic Deleted Successfully','Green');

				            	$scope.currentUser.ProfilePicUrl = response.data.Data;

				            	var output = '{';

								for (property in $scope.currentUser) {
								    output += '"' + property + '": "' + $scope.currentUser[property]+'",';
								}
								output = output.substring(0, output.length - 1);
								output += '}';
								
								$window.sessionStorage.setItem("currentUser", output );
				            }

				            $scope.stateDisabled = false;
							showMasterProgress(false);
				    }, 
				    function(response) { // optional
				            $scope.imageUpload = false;
							$scope.stateDisabled = false;
							showMasterProgress(false);
							showSnackBar('Profile Pic Update Failure','Red');
				    });
		}

		$scope.setFile = function(element)
		{
  			$scope.currentFile = element.files[0];
   			
			var extension = $scope.currentFile.name.substring($scope.currentFile.name.lastIndexOf('.'));
			
			console.log( extension );

			var validFileType1 = ".jpg";
			var validFileType2 = ".png";
		    if (extension != ".JPG" && extension != ".jpg" && extension != ".PNG" && extension != ".png" ) {
		    	$scope.invalidPicType = true;
				
		    	showSnackBar('Format Not Supported',"Red");

		    	window.setTimeout(function()
	    		{
	    			$scope.$apply($scope.invalidPicType = false);
	    		}, 5000);
		    }
		    else
		    {
		    	var uploadUrl = "/uploadProfilePicture";
		    	console.log( $scope.currentFile );

		    	var reader = new FileReader();

	  			reader.onload = function(event)
				{
					var json = {
						Email : $scope.currentUser.Email,
						file : event.target.result,
						Type : $scope.currentUser.Type
					};

					$scope.imageUpload = true;
					$scope.stateDisabled = true;
					showMasterProgress(true);

	    			$http({
				        url: '/uploadProfilePicture',
				        method: "POST",
				        data: json,
				        json: true,
				        headers: {
							        "content-type": "application/json",  // <--Very important!!!
							    }
				    })
				    .then(function(response) {
				            
				    		if( response.data.message == 'Profile Pic Update Failure' )
				            {
				            	showSnackBar('Profile Update Failure','Red');
				            	
				            }
				            else if( response.data.message == 'Profile Pic Updated Successfully' )
				            {
				            	showSnackBar('Profile Pic Updated Successfully','Green');

				            	$scope.currentUser.ProfilePicUrl = response.data.Data;

				            	var output = '{';

								for (property in $scope.currentUser) {
								    output += '"' + property + '": "' + $scope.currentUser[property]+'",';
								}
								output = output.substring(0, output.length - 1);
								output += '}';
								
								$window.sessionStorage.setItem("currentUser", output );
				            }

				            $scope.imageUpload = false;
							$scope.stateDisabled = false;
							showMasterProgress(false);
				    }, 
				    function(response) { // optional
				            $scope.imageUpload = false;
							$scope.stateDisabled = false;
							showMasterProgress(false);
							showSnackBar('Profile Pic Update Failure','Red');
				    });
				//
	  			};
	  			// when the file is read it triggers the onload event above.
	  			reader.readAsDataURL( $scope.currentFile );

	  	        /*var res = $fileUpload.uploadFileToUrl($scope.currentFile, $scope.currentUser.Email ,uploadUrl).then(
	            		function(response)
	            		{
	            			console.log('Image Upload');
	            		}
		            , 
		                function(errResponse)
		                {
		                	console.error('Error while Updating User.');
		                } 
	        	);*/
	  			
	  	        //console.log(res);
		    	//
		    }
			
  			$scope.UpdatePageSize();
		};

		$scope.ValidateUsername = function()
		{
			var reg = /^$/;
			$scope.UsernameError = reg.test( $scope.currentUser.Username );
			
			$scope.UpdatePageSize();
			
			
			/* console.log( $scope.currentUser.Email );
			console.log( $scope.UserData ); */
		}

		$scope.ValidateLocation = function()
		{
			var reg = /^$/;
			$scope.LocationError = reg.test( $scope.currentUser.Location );
			
			$scope.UpdatePageSize();
			
			
			/* console.log( $scope.currentUser.Email );
			console.log( $scope.UserData ); */
		}


		$scope.QualificationsError = false;
		$scope.ValidateQualifications = function()
		{
			var reg = /^$/;
			$scope.QualificationsError = reg.test( $scope.currentUser.Qualifications );
			
			$scope.UpdatePageSize();
		}
		
		$scope.ValidatePhone = function()
		{
			var reg = /^[7-9][0-9]{9}$/;
			$scope.PhoneError = !reg.test( $scope.currentUser.Phone );
			
			$scope.Part1Errors = $scope.EmailError || $scope.PhoneError;
			
			$scope.UpdatePageSize();
			
		}
		
		//$scope.CurrentPasswordError = $scope.NewPasswordError = $scope.ConfirmNewPasswordError = $scope.MatchNewPasswords = true;

		$scope.showChangePasswordProgress = false;

		$scope.ChangePassword = function()
		{
			$scope.showChangePasswordProgress = true;
			//showSnackBar2("Hi","Red");

			var json = {
				Email : $scope.currentUser.Email,
				CurrentPassword : $scope.ChangePasswordCurrentPassword,
				NewPassword : $scope.ChangePasswordNewPassword,
				Type : $scope.currentUser.Type
			};

			//
			$http({
			        url: '/updatePassword',
			        method: "POST",
			        data: json,
			        json: true,
			        headers: {
						        "content-type": "application/json",  // <--Very important!!!
						    }
			    })
			    .then(function(response) {
			            
			            if( response.data.message == 'Password Change Failure' )
			            {
			            	showSnackBar2('Profile Update Failure','Red');
			            	
			            }
			            else if( response.data.message == 'Current Password Incorrect' )
			            {
			            	showSnackBar2('Current Password Incorrect','Red');
			            }
			            else if( response.data.message == 'Password Changed Successfully' )
			            {
			            	showSnackBar2('Password Changed Successfully','Green');
			            	$scope.ChangePasswordReset();
			            	window.setTimeout(function(){
			            		$("#ChangePasswordModal").fadeOut('slow');
			            	},1000);
			            }

			            $scope.showChangePasswordProgress = false;
			            
			    }, 
			    function(response) { // optional
			            console.log( "Failed" );
			            showSnackBar2('Profile Update Failure','Red');
			            $scope.showChangePasswordProgress = false;
			    });
			//
		}

		$scope.ChangePasswordReset = function()
		{
			$scope.ChangePasswordCurrentPassword = '';		
			$scope.ChangePasswordCurrentPasswordTouched = false;

			$scope.ChangePasswordPasswordOverallError = true;

			$scope.ChangePasswordNewPassword = '';
			$scope.ChangePasswordNewPasswordError = false;
			$scope.ChangePasswordNewPasswordTouched = false;

			$scope.ChangePasswordConfirmNewPassword = '';
			$scope.ChangePasswordConfirmNewPasswordError = false;
			$scope.ChangePasswordConfirmNewPasswordTouched = false;
		}

		$scope.ChangePasswordCurrentPassword = '';		
		$scope.ChangePasswordCurrentPasswordTouched = false;
		$scope.ValidateChangePasswordCurrentPassword = function()
		{
			$scope.ChangePasswordCurrentPasswordTouched = true;
			$scope.CheckOverallPasswordErrors();
		}

		$scope.ChangePasswordPasswordOverallError = true;

		$scope.ChangePasswordNewPassword = '';
		$scope.ChangePasswordNewPasswordError = false;
		$scope.ChangePasswordNewPasswordTouched = false;
		$scope.ValidateChangePasswordNewPassword = function()
		{
			$scope.ChangePasswordNewPasswordTouched = true;
			var reg = /^.{8,15}$/;
			$scope.ChangePasswordNewPasswordError = !reg.test( $scope.ChangePasswordNewPassword );
			$scope.ChangePasswordConfirmNewPasswordError = ( $scope.ChangePasswordConfirmNewPassword != $scope.ChangePasswordNewPassword);
			console.log( $scope.ChangePasswordConfirmNewPassword != $scope.ChangePasswordNewPassword );
			$scope.CheckOverallPasswordErrors();
		}

		$scope.ChangePasswordConfirmNewPassword = '';
		$scope.ChangePasswordConfirmNewPasswordError = false;
		$scope.ChangePasswordConfirmNewPasswordTouched = false;
		$scope.ValidateChangePasswordConfirmNewPassword = function()
		{
			$scope.ChangePasswordConfirmNewPasswordTouched = true;
			$scope.ChangePasswordConfirmNewPasswordError = ( $scope.ChangePasswordConfirmNewPassword != $scope.ChangePasswordNewPassword);

			$scope.CheckOverallPasswordErrors();
		}

		$scope.CheckOverallPasswordErrors = function()
		{
			$scope.ChangePasswordPasswordOverallError = 
				$scope.ChangePasswordNewPasswordError || !$scope.ChangePasswordNewPasswordTouched ||
				$scope.ChangePasswordConfirmNewPasswordError || !$scope.ChangePasswordConfirmNewPasswordTouched ||
				$scope.ChangePasswordCurrentPassword == '' || $scope.ChangePasswordCurrentPassword == $scope.ChangePasswordNewPassword;
		}

		$scope.ValidateCurrentPassword = function()
		{
			var reg = /^.{8,15}$/;
			$scope.CurrentPasswordError = !reg.test( $scope.UserPasswordDetails.CurrentPassword );
			
			$scope.UpdatePageSize();
		}
		
		$scope.DateError = false;
		$scope.ValidateDate = function()
		{
			console.log($scope.currentUser.Date);
			$scope.DateError = $scope.currentUser.Date == undefined;

			if( $scope.currentUser.Date != undefined )
			{
				var year = $scope.currentUser.Date.getFullYear();
				if( year <= 1980 || year >= 2017 )
					$scope.DateError = true;
			}
		}

		$scope.ValidateNewPassword = function()
		{
			var reg = /^.{8,15}$/;
			$scope.NewPasswordError = !reg.test( $scope.UserPasswordDetails.NewPassword );
			
			$scope.MatchNewPasswords = ($scope.UserPasswordDetails.NewPassword == "" || $scope.UserPasswordDetails.ConfirmNewPassword == "" )?true:!( $scope.UserPasswordDetails.NewPassword == $scope.UserPasswordDetails.ConfirmNewPassword );
			
			$scope.UpdatePageSize();
		}
		
		$scope.ValidateConfirmNewPassword = function()
		{
			var reg = /^.{6,15}$/;
			$scope.ConfirmNewPasswordError = !reg.test( $scope.UserPasswordDetails.ConfirmNewPassword );
			
			$scope.MatchNewPasswords = ($scope.UserPasswordDetails.NewPassword == "" || $scope.UserPasswordDetails.ConfirmNewPassword == "" )?true:!( $scope.UserPasswordDetails.NewPassword == $scope.UserPasswordDetails.ConfirmNewPassword );
			
			$scope.UpdatePageSize();
		}
		
		$scope.change = false;
		
		$scope.updated = false;
		$scope.passwordUpdated = false;
		$scope.passwordUpdatedWithError = false;
		$scope.passwordUpdateError = "Current Password Incorrect";
		
		$scope.sendPasswordForUpdate = function()
		{
			$scope.CurrentPasswordError = ( $scope.CurrentPasswordError == undefined ) ? true : $scope.CurrentPasswordError;
			$scope.NewPasswordError = ( $scope.NewPasswordError == undefined ) ? true : $scope.NewPasswordError;
			$scope.ConfirmNewPasswordError = ( $scope.ConfirmNewPasswordError == undefined ) ? true : $scope.ConfirmNewPasswordError;
			$scope.MatchNewPasswords = ( $scope.MatchNewPasswords == undefined ) ? true : $scope.MatchNewPasswords;
			
			$scope.Part2Errors = ( $scope.CurrentPasswordError || $scope.NewPasswordError || $scope.ConfirmPasswordError || $scope.MatchNewPasswords );
			
			if( $scope.Part2Errors == false )
			{
				$scope.progressObj.SwitchFlag(true);
				$scope.stateDisabled = true;
				
				var resp = $UserService.updateUserPassword($scope.UserPasswordDetails)
	            .then(
	            		function(response)
	            		{
	            			$scope.response = response.status;
	            			
	            			//console.log( $scope.response );
	            			
	            			if( $scope.response == "Password Incorrect" )
	            			{
	            				$scope.passwordUpdatedWithError = true;
	            				
	            				$scope.passwordUpdateError = "Current Password Incorrect";
	            				
	            				window.setTimeout(function()
	        		    		{
	        		    			$scope.$apply($scope.passwordUpdatedWithError = false);
	        		    		}, 5000);
	        		    				
	            			}
	            			
	            			if( $scope.response == "Updated" )
	            			{
	            				$scope.passwordUpdated = true;
	            				
	            				window.setTimeout(function()
	        		    		{
	        		    			$scope.$apply($scope.passwordUpdated = false);
	        		    		}, 5000);
	        		    				
	            			}
	            			
	            			if( $scope.response == "Same Password" )
	            			{
	            				$scope.passwordUpdatedWithError = true;
	            				
	            				$scope.passwordUpdateError = "New Password Cannot be the same as the Current Password";
	            				
	            				window.setTimeout(function()
	        		    		{
	        		    			$scope.$apply($scope.passwordUpdatedWithError = false);
	        		    		}, 5000);
	        		    				
	            			}
	            			
	            			//$scope.progressObj.SwitchFlag(false);
		    				$scope.stateDisabled = false;
		    				
		    				
	            		}
		            , 
		                function(errResponse)
		                {
		                	console.error('Error while Updating User.');
		                } 
	        	);
				//console.log( $scope.UserPasswordDetails );
			}
			
			$scope.UpdatePageSize();
		}
		
		$scope.toggleChangeUpdate = function()
		{
			$scope.change = true;
			
			if( document.getElementById('change_update_btn').innerHTML == "Update" && !$scope.Part1Errors )
			{
				showMasterProgress(true);
				$scope.stateDisabled = true;
				//
				var day = "" + $scope.currentUser.Date.getDate(); //Date of the month: 2 in our example
				day = (day.length == 1)?"0" + day : day;
				var month = "" + $scope.currentUser.Date.getMonth() + 1; //Month of the Year: 0-based index, so 1 in our example
				month = (month.length == 1)?"0" + month : month;
				var year = "" + $scope.currentUser.Date.getFullYear() //Year: 2013

				var date = day + '/' + month + '/' + year;

				//$scope.currentUser.Date = date;

				$scope.currentUser.AboutYourself = ($scope.currentUser.AboutYourself == undefined)?'':$scope.currentUser.AboutYourself;

				$http({
			        url: '/updateProfile',
			        method: "POST",
			        data: $scope.currentUser,
			        json: true,
			        headers: {
						        "content-type": "application/json",  // <--Very important!!!
						    }
			    })
			    .then(function(response) {
			            
			            if( response.data.message == 'Profile Update Failure' )
			            {
			            	showSnackBar('Profile Update Failure','Red');
			            	
			            }
			            else if( response.data.message == 'Profile Update Successfully' )
			            {
			            	showSnackBar('Profile Updated Successfully','Green');

			            	var output = '{';

							for (property in response.data.Data) {
							    output += '"' + property + '": "' + response.data.Data[property]+'",';
							}
							output = output.substring(0, output.length - 1);
							output += '}';
							console.log(output);

							$window.sessionStorage.setItem("currentUser", output );

							$scope.currentUser = JSON.parse( $window.sessionStorage.getItem("currentUser") );
							console.log(  $scope.currentUser  );

							$scope.currentUser.Phone = parseInt($scope.currentUser.Phone);

							$scope.dateDisplay = $scope.currentUser.Date;

							var date = $scope.currentUser.Date.split("/");

							$scope.currentUser.Date = new Date(date[1]+"/" + date[0] + "/" + date[2]);
			            }
			            showMasterProgress(false);
			            $scope.stateDisabled = false;
			            $scope.change = false;
			            document.getElementById('change_update_btn').innerHTML = "Change";	
			    }, 
			    function(response) { // optional
			            console.log( "Failed" );
			            showSnackBar('Profile Update Failure','Red');
			            showMasterProgress(false);
			            $scope.stateDisabled = false;

			    });
				//
			}
			
			document.getElementById('change_update_btn').innerHTML = "Update";
			
			$scope.UpdatePageSize();
		}
		
		$scope.letItBe = function()
		{
			
			window.setTimeout(function()
    		{
				$scope.$apply($scope.updated = false);
    			
    			//console.log($scope.updated);
    		}, 5000);
			
			
			$scope.change = false;
			
			//
			$scope.currentUser = JSON.parse( $window.sessionStorage.getItem("currentUser") );
			console.log(  $scope.currentUser  );

			$scope.currentUser.Phone = parseInt($scope.currentUser.Phone);

			$scope.dateDisplay = $scope.currentUser.Date;

			var date = $scope.currentUser.Date.split("/");

			$scope.currentUser.Date = new Date(date[1]+"/" + date[0] + "/" + date[2]);
			//

			document.getElementById('change_update_btn').innerHTML = "Change";
			
			$scope.stateDisabled = false;
			
			$scope.EmailError = false;
			$scope.PhoneError = false;
			
			$scope.UpdatePageSize();
		}
		//

		$scope.UpdatePageSize();

	}]);