	
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

	app.controller('mediaSpaceController',['$scope','$filter','$location','$window','$http','$routeParams','fileUpload',
                                 
    function($scope,$filter,$location,$window,$http,$routeParams,$fileUpload){
		console.log("mediaSpaceController.......");
		
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

		$scope.Loading = false;

		$scope.mediaspace = [];

		$scope.filesforupload = [];

		$scope.UpdatePageSize = function()
		{
			window.setTimeout(function()
			{
				document.getElementById("body_div").style.height = (document.getElementById("index_div_row").offsetHeight + 100) + 'px';
				
				$('#body_div').height( $('#body_div').height()<$(window).height()? $(window).height() : $('#body_div').height() );
			}, 200);
		};

		$scope.stateDisabled = false;

		$scope.fileUploadcount = 0;

		$scope.SelectAllChecks = false;

		$scope.SelectAll = function()
		{
			//$scope.SelectAllChecks = !$scope.SelectAllChecks;
		
			$scope.DeleteEnabled = $scope.SelectAllChecks;

			for( var i = 0 ; i < $scope.mediaspace.length ; i++ )
    		{
    			$scope.mediaspace[i].valuechecked = $scope.SelectAllChecks;
    			
    		}
			
		}

		$scope.DeleteEnabled = false;

		$scope.DeleteFromMediaSpace = function()
		{
			mediaspacejson = [];

			for( var i = 0 ; i < $scope.mediaspace.length ; i++ )
			{
				if( $scope.mediaspace[i].valuechecked == false )
				{
					mediaspacejson.push( $scope.mediaspace[i].url );
				}
			}

			var json = {
				Email : $scope.currentUser.Email,
				mediaspace : mediaspacejson
			};

			$scope.stateDisabled = true;
			showMasterProgress(true);

			$http({
		        url: '/deleteFromMediaSpace',
		        method: "POST",
		        data: json,
		        json: true,
		        headers: {
					        "content-type": "application/json",  // <--Very important!!!
					    }
		    })
		    .then(function(response) {
		            
		    		if( response.data.message == 'Delete Media Space Failure' )
		            {
		            	showSnackBar('Delete Media Space Failure','Red');
		            }
		            else if( response.data.message == 'Delete Media Space Success' )
		            {
		            	try
		            	{
		            		var mediaspacejson = [];

		            		for( var i = 0 ; i < $scope.mediaspace.length ; i++ )
							{
								if( $scope.mediaspace[i].valuechecked == false )
								{
									mediaspacejson.push( $scope.mediaspace[i] );
								}
							}

							$scope.mediaspace = mediaspacejson;

		            		console.log( $scope.mediaspace );

		            		showSnackBar('Delete Media Space Success','Green');
		            	}
		            	catch( e )
		            	{
		            		console.log( e );
		            		showSnackBar('Delete Media Space Failure','Red');
		            	}

		            	
		            }
		            $scope.DeleteEnabled = false;
		            $scope.stateDisabled = false;
		            showMasterProgress(false);
		    }, 
		    function(response) { // optional
		    		$scope.DeleteEnabled = false;
		    		$scope.stateDisabled = false;
		    		showMasterProgress(false);
					showSnackBar('Delete Media Space Failure','Red');
		    });
		}

		$scope.CheckChanged = function()
		{
			var count = 0 ;
			var bool = false;

			for( var i = 0 ; i < $scope.mediaspace.length ; i++)
			{
				if( $scope.mediaspace[i].valuechecked == true )
				{
					count++;
					bool = true;
				}
			}

			$scope.DeleteEnabled = bool;
			
			if( count == $scope.mediaspace.length )
			{
				$scope.SelectAllChecks = true;
			}
			else
			{
				$scope.SelectAllChecks = false;	
			}

		}

		$scope.FetchMediaSpace = function()
		{
			//
			var json = {
				Email : $scope.currentUser.Email
			};

			$scope.Loading = true;
			showMasterProgress(true);

			$http({
		        url: '/fetchMediaSpace',
		        method: "POST",
		        data: json,
		        json: true,
		        headers: {
					        "content-type": "application/json",  // <--Very important!!!
					    }
		    })
		    .then(function(response) {
		            
		    		if( response.data.message == 'Fetch Media Space Failure' )
		            {
		            	showSnackBar('Fetch Media Space Failure','Red');
		            }
		            else if( response.data.message == 'Fetch Media Space Success' )
		            {
		            	try
		            	{
		            		var json = response.data.Data.Media;	

		            		for( var i = 0 ; i < json.length ; i++ )
		            		{
		            			if(json[i] != null)
		            			{
		            				$scope.mediaspace.push( {"url":json[i] , "valuechecked" : false } )
		            			}
		            		}
								
		            		console.log( $scope.mediaspace );

		            		showSnackBar('Fetch Media Space Success','Green');
		            	}
		            	catch( e )
		            	{
		            		$scope.mediaspace = [];
		            		console.log( e );
		            		showSnackBar('Fetch Media Space Failure','Red');
		            	}

		            	
		            }

		            $scope.Loading = false;
					showMasterProgress(false);
		    }, 
		    function(response) { // optional
		    		$scope.Loading = false;
		            showMasterProgress(false);
					showSnackBar('Fetch Media Space Failure','Red');
		    });
			//
		}

		$scope.FetchMediaSpace();

		$scope.currentIndex = 0;

		$scope.plusSlides = function( arg )
		{
			if( arg == -1 && $scope.currentIndex > 0 )
			{
				$scope.currentIndex--;
				var modalImg = document.getElementById("img01");
				modalImg.src = $scope.mediaspace[$scope.currentIndex].url;
			}

			if( arg == 1 && $scope.currentIndex < $scope.mediaspace.length-1 )
			{
				$scope.currentIndex++;
				var modalImg = document.getElementById("img01");
				modalImg.src = $scope.mediaspace[$scope.currentIndex].url;
			}
			
		}

		$scope.imgModalLoad = function(arg)
		{
			var modal = document.getElementById('imgModal');

				// Get the image and insert it inside the modal - use its "alt" text as a caption
				var modalImg = document.getElementById("img01");
				
				    modal.style.display = "block";
				    modalImg.src = arg.url;
				
				 for( var i = 0 ; i < $scope.mediaspace.length ; i++ )
				 {
				 	if( $scope.mediaspace[i] == arg )
				 	{
				 		$scope.currentIndex = i;
				 		break;
				 	}
				 }

				// Get the <span> element that closes the modal
				var span = document.getElementsByClassName("close")[0];

				// When the user clicks on <span> (x), close the modal
				span.onclick = function() { 
				  modal.style.display = "none";
				}
		}

		$scope.setFile = function(e)
		{
			console.log( e.files );

			for (var i = 0; i < e.files.length; i++) {
                //$scope.filesforupload.push(e.files[i])
                
                var reader = new FileReader();
                
                reader.onload = function(event)
    			{
                	//console.log( event.target);
                	
                	window.setTimeout(function(){
                	
                		if( event.target.result.indexOf("image/jpeg") != -1 || event.target.result.indexOf("image/png") != -1 )
                		{
                			$scope.$apply( $scope.filesforupload.push({"ImageUrl": event.target.result , "Status" : "valid" , "index": new String( event.target.result.toString() ).hashCode() , "UploadStatus" : "Uploading" }) );

                			//
                			var json = {
								Email : $scope.currentUser.Email,
								file : event.target.result,
								id : new String( event.target.result.toString() ).hashCode(),
								Type : $scope.currentUser.Type
							};

							$scope.stateDisabled = true;
							showMasterProgress(true);

			    			$http({
						        url: '/uploadMediaSpaceImage',
						        method: "POST",
						        data: json,
						        json: true,
						        headers: {
									        "content-type": "application/json",  // <--Very important!!!
									    }
						    })
						    .then(function(response) {
						            
						    		if( response.data.message == 'Media Space Image Upload Failure' )
						            {
						            	$scope.fileUploadcount++;

						            	var index = response.data.Data.index;

						            	for( var i = 0 ; i < $scope.filesforupload.length ; i++ )
						            	{
						            		if( $scope.filesforupload[i].index == index )
						            		{
						            			$scope.filesforupload[i].UploadStatus = "Failed";
						            			break;
						            		}
						            	}
						            }
						            else if( response.data.message == 'Media Space Image Upload Success' )
						            {
						            	$scope.fileUploadcount++;

						            	var index = response.data.Data.index;

						            	for( var i = 0 ; i < $scope.filesforupload.length ; i++ )
						            	{
						            		if( $scope.filesforupload[i].index == index )
						            		{

						            			$scope.filesforupload.splice( i, 1);
						            			
						            			$scope.mediaspace.push( {"url": response.data.Data.url , "valuechecked" : false });

						            			break;
						            		}
						            	}

						            	if( $scope.fileUploadcount == e.files.length )
						            		showSnackBar('Media Space Upload Success','Green');

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
                			//
                		}
                		else
                		{
                			$scope.$apply( $scope.filesforupload.push({"ImageUrl": event.target.result , "Status" : "invalid" , "index":  new String( event.target.result.toString() ).hashCode() , "UploadStatus" : "invalid" }) );
                			console.log( 'error' )
                		}
                			
                		
                		$scope.UpdatePageSize();
                		
                	},100);
                	
    	  		};
    	  		
    	  		reader.readAsDataURL(e.files[i]);
            }

            window.setTimeout(function(){
            	console.log( document.getElementById("cardUploadImage_0").style.height );

            },2000);
		};

		$scope.openFileChooser = function()
		{
			$('#trigger').trigger('click');
		};


	}]);