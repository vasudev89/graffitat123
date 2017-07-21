	
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

	app.controller('masterPageController',['$scope','$filter','$location','$window','$http','$routeParams','fileUpload',
                                 
    function($scope,$filter,$location,$window,$http,$routeParams,$fileUpload){
		console.log("masterPageController.......");
		
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

		$scope.ResetGreenHornPostQuestion = function()
		{
			$scope.GreenhornPostQuestion = '';
			$scope.GreenhornPostQuestionTouched = false;
			$scope.GreenhornPostQuestionError = false;
			$scope.GreenhornPostQuestionPosting = false;
		}

		$scope.GreenhornPostQuestion = '';
		$scope.GreenhornPostQuestionTouched = false;
		$scope.GreenhornPostQuestionError = false;
		$scope.GreenhornPostQuestionPosting = false;
		$scope.ValidateGreenhornPostQuestion = function(){

			$scope.GreenhornPostQuestionTouched = true;

			if( $scope.GreenhornPostQuestion == undefined || $scope.GreenhornPostQuestion.length <=5 )
				$scope.GreenhornPostQuestionError = true;
			else
				$scope.GreenhornPostQuestionError = false;

		}

		$scope.ShowGalleryFlag = false;		

		
		$scope.mediaspace = [];

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

		$scope.currentIndex1 = 0;

		$scope.plusSlides1 = function( arg )
		{
			console.log( arg );

			if( arg == -1 && $scope.currentIndex1 > 0 )
			{
				$scope.currentIndex1--;
				var modalImg = document.getElementById("img02");
				modalImg.src = $scope.currentMediaView[$scope.currentIndex1];
			}

			if( arg == 1 && $scope.currentIndex1 < $scope.currentMediaView.length-1 )
			{
				$scope.currentIndex1++;
				var modalImg = document.getElementById("img02");
				modalImg.src = $scope.currentMediaView[$scope.currentIndex1];
			}
			
		}

		$scope.currentMediaView = [];

		$scope.imgModalLoad1 = function(arg,list)
		{
			$scope.currentMediaView = list.Media;
			console.log( $scope.currentMediaView );

			var modal = document.getElementById('imgModal1');

				// Get the image and insert it inside the modal - use its "alt" text as a caption
				var modalImg = document.getElementById("img02");
				
				    modal.style.display = "block";
				    modalImg.src = arg;
				
				 for( var i = 0 ; i < $scope.currentMediaView.length ; i++ )
				 {
				 	if( $scope.currentMediaView[i] == arg )
				 	{
				 		$scope.currentIndex1 = i;
				 		console.log( $scope.currentIndex1 );
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

		$scope.postQuestionMCQCurrentMediaView = [];
		$scope.postQuestionMCQCurrentIndex = 0;

		$scope.postQuestionMCQPlusSlides = function( arg )
		{
			console.log( arg );

			if( arg == -1 && $scope.postQuestionMCQCurrentIndex > 0 )
			{
				$scope.postQuestionMCQCurrentIndex--;
				var modalImg = document.getElementById("postQuestionMCQModalImg");
				modalImg.src = $scope.postQuestionMCQCurrentMediaView[$scope.postQuestionMCQCurrentIndex].url;
			}

			if( arg == 1 && $scope.postQuestionMCQCurrentIndex < $scope.postQuestionMCQCurrentMediaView.length-1 )
			{
				$scope.postQuestionMCQCurrentIndex++;
				var modalImg = document.getElementById("postQuestionMCQModalImg");
				modalImg.src = $scope.postQuestionMCQCurrentMediaView[$scope.postQuestionMCQCurrentIndex].url;
			}
			
		}

		$scope.postQuestionMCQImgModalLoad = function(arg,list)
		{
			$scope.postQuestionMCQCurrentMediaView = list;
			console.log('postQuestionMCQCurrentMediaView');
			console.log( $scope.postQuestionMCQCurrentMediaView );

			var modal = document.getElementById('postQuestionMCQModal');

				// Get the image and insert it inside the modal - use its "alt" text as a caption
				var modalImg = document.getElementById("postQuestionMCQModalImg");
				
				    modal.style.display = "block";
				    modalImg.src = arg.url;
				
				 for( var i = 0 ; i < $scope.postQuestionMCQCurrentMediaView.length ; i++ )
				 {
				 	if( $scope.postQuestionMCQCurrentMediaView[i].url == arg.url )
				 	{
				 		$scope.postQuestionMCQCurrentIndex = i;
				 		console.log( $scope.postQuestionMCQCurrentIndex );
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

		$scope.QuestionMedia = [];

		$scope.CheckChanged = function(arg)
		{
			console.log( arg );

			if( arg.valuechecked )
			{
				$scope.QuestionMedia.push( arg.url );
			}
			else
			{
				for( var i = 0 ; i < $scope.QuestionMedia.length ; i++ )
				{
					if( $scope.QuestionMedia[i] == arg.url )
					{
						$scope.QuestionMedia.splice(i,1);
						break;
					}
				}	
			}

			console.log( $scope.QuestionMedia );
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
		            
		    		console.log('Media Space Response');
		    		console.log( response )

		    		if( response.data.message == 'Fetch Media Space Failure' )
		            {
		            	showSnackBar('Fetch Media Space Failure','Red');
		            }
		            else if( response.data.message == 'Fetch Media Space Success' )
		            {
		            	try
		            	{
		            		var json = response.data.Data.Media;	

		            		console.log(json)

		            		for( var i = 0 ; i < json.length ; i++ )
		            		{
		            			if(json[i] != null)
		            			{
		            				$scope.mediaspace.push( {"url":json[i] , "valuechecked" : false } )
		            			}
		            		}
							
							console.log('mediaspace');	
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

		$scope.PostGreenhornQuestion = function()
		{
			var json = {
				"Question" : $scope.GreenhornPostQuestion,
				"Media" : $scope.QuestionMedia,
				"Type" : "GreenhornQuestion",
				"Owner" : $scope.currentUser
			};

			showMasterProgress(true);
			//
			$http({
		        url: '/postGreenhornQuestion',
		        method: "POST",
		        data: json,
		        json: true,
		        headers: {
					        "content-type": "application/json",  // <--Very important!!!
					    }
		    })
		    .then(function(response) {
		            
		    		if( response.data.message == 'Greenhorn Post Question Failure' )
		            {
		            	showSnackBar('Post Question Failure','Red');
		            	
		            }
		            else if( response.data.message == 'Greenhorn Post Question Success' )
		            {
		            	
		            	try
		            	{
		            		
		            		showSnackBar('Post Question Success','Green');	

		            		$scope.QuestionMedia = [];

		            		$("#GreenhornPostQuestionModal").fadeOut('slow',function(){
		            			$scope.$apply( $scope.ResetGreenHornPostQuestion() );
		            			$scope.$apply( $scope.FetchAllMentorsQuestionBoard() );

		            			$scope.$apply( $scope.currentUser.QuestionsLeft = response.data.Data.QuestionsLeft );

		            			var output = '{';

								for (property in $scope.currentUser) {
								    output += '"' + property + '": "' + $scope.currentUser[property]+'",';
								}
								output = output.substring(0, output.length - 1);
								output += '}';
								
								$window.sessionStorage.setItem("currentUser", output );

		            			$("#GreenhornPostQuestionModal").modal( 'hide' );
		            		});
		            	}
		            	catch( e )
		            	{
		            		$scope.currentMentorQuestionBoard = [];

		            		showSnackBar('Post Question Failure','Red');	
		            	}
		            	
		            }

		            for( var i = 0 ; i < $scope.mediaspace.length ; i++ )
		            {
		            	$scope.mediaspace[i].valuechecked = false ;
		            	$scope.ShowGalleryFlag = false;
		            }

		            showMasterProgress(false);
					$scope.QuestionMedia = [];					
					$scope.UpdatePageSize();
		    }, 
		    function(response) { // optional
		    		for( var i = 0 ; i < $scope.mediaspace.length ; i++ )
		            {
		            	$scope.mediaspace[i].valuechecked = false ;
		            	$scope.ShowGalleryFlag = false;
		            }
		            showMasterProgress(false);
		            $scope.QuestionMedia = [];					
					showSnackBar('Post Question Failure','Red');
					$scope.UpdatePageSize();
		    });
		}


		$scope.DeleteQuestion = function( arg )
		{
			console.log( arg );

			var json = {
				Question : arg
			};

			showMasterProgress(true);
			//
			$http({
		        url: '/deleteQuestion',
		        method: "POST",
		        data: json,
		        json: true,
		        headers: {
					        "content-type": "application/json",  // <--Very important!!!
					    }
		    })
		    .then(function(response) {
		            
		    		if( response.data.message == 'Delete Question Failure' )
		            {
		            	showSnackBar('Delete Question Failure','Red');
		            	
		            }
		            else if( response.data.message == 'Delete Question Success' )
		            {
		            	
		            	try
		            	{
		            		var count = 0;
		            		for( var i = 0 ; i < $scope.questionboard.length ; i++ )
		            		{
		            			if( $scope.questionboard[i].index == arg.index)
		            			{
		            				break;
		            			}

		            			count++;
		            		}

		            		$scope.questionboard.splice(count,1);

		            		showSnackBar('Delete Question Success','Green');	
		            	}
		            	catch( e )
		            	{
		            		$scope.currentMentorQuestionBoard = [];

		            		showSnackBar('Get Question Board Failure','Red');	
		            	}
		            	
		            }

		            showMasterProgress(false);
					
					$scope.UpdatePageSize();
		    }, 
		    function(response) { // optional
		            showMasterProgress(false);
					showSnackBar('Delete Question Failure','Red');
					$scope.UpdatePageSize();
		    });
		}
		
		//

		$scope.UpdatePageSize = function()
		{
			window.setTimeout(function()
			{
				document.getElementById("body_div").style.height = (document.getElementById("index_div_row").offsetHeight + 10) + 'px';
				
				$('#body_div').height( $('#body_div').height()<$(window).height()? $(window).height() : $('#body_div').height() );
			}, 200);
		};

		$scope.Loading = false;
		$scope.LoadNotStarted = true;

		$scope.data = [];

		$scope.currentMentor = undefined;

		$scope.ViewMentorProfile = function(arg)
		{
			$("#ViewMentorModal").modal('show');
			$scope.currentMentor = $scope.data[arg];
		}

		$scope.QuestionTypeSelectTouched = false;
		$scope.QuestionTypeSelect = 'MCQ';
		$scope.QuestionTypeSelectChange = function()
		{
			$scope.QuestionTypeSelectTouched = true;
			console.log( $scope.QuestionTypeSelect );
			
		}

		$scope.SubjectiveQuestion = '';
		
		$scope.MCQResponseType = 'True/False';

		$scope.MCQResponseTypeTrueFalse = 'True';

		$scope.MCQResponseTypeGenericNoOfOptions = '4';

		$scope.MCQResponseTypeGenericCorrectOption = '1';

		$scope.MCQQuestionTouched = false;
		$scope.ResetQuestions = function()
		{
			console.log( 'Reset Called' );
			$scope.QuestionTypeSelectTouched = false;
			$scope.QuestionTypeSelect = 'MCQ';
			$scope.SubjectiveQuestion = '';

			$scope.MCQQuestion = '';		
			$scope.MCQQuestionTouched = false;
			$scope.MCQResponseType = 'True/False';

			$scope.MCQResponseTypeTrueFalse = 'True';

			$scope.MCQResponseTypeGenericNoOfOptions = '4';

			$scope.MCQResponseTypeGenericCorrectOption = '1';
		}

		$scope.MCQQuestionChange = function()
		{

			if( $scope.MCQQuestion != '' )  $scope.MCQQuestionError = false;
			console.log( $scope.MCQQuestion );

			$scope.MCQQuestionTouched = true;

		}

		$scope.MCQResponseTypeGenericNoOfOptionsChange = function()
		{
			$scope.MCQResponseTypeGenericCorrectOption = '1';
		}

		$scope.currentMentorQuestionBoard = [];


		$scope.CloseViewMentorModal = function()
		{
			window.setTimeout(function(){
				$scope.$apply( $scope.currentMentorQuestionBoard = [] );
			},2000);
		}

		$scope.FetchMentorQuestionBoard = function(arg)
		{
			var json = {
				Email : arg
			};

			showMasterProgress(true);
			//
			$http({
		        url: '/getMentorQuestionBoard',
		        method: "POST",
		        data: json,
		        json: true,
		        headers: {
					        "content-type": "application/json",  // <--Very important!!!
					    }
		    })
		    .then(function(response) {
		            
		    		if( response.data.message == 'Get Question Board Failure' )
		            {
		            	showSnackBar('Get Question Board Failure','Red');
		            	
		            }
		            else if( response.data.message == 'No Questions to Show' )
		            {
		            	showSnackBar('No Questions to Show','Red');
		            	
		            }
		            else if( response.data.message == 'Get Question Board Success' )
		            {
		            	
		            	try
		            	{
		            		$scope.currentMentorQuestionBoard  = response.data.Data;
		            		console.log( $scope.currentMentorQuestionBoard  )

		            		for( var i = 0 ; i < $scope.currentMentorQuestionBoard.length ; i++ )
		            		{
		            			$scope.currentMentorQuestionBoard[i].index = i;
		            			var date = new Date( $scope.currentMentorQuestionBoard[i].DateUpdated );
		            			$scope.currentMentorQuestionBoard[i].DateUpdated = date.getUTCDate() + "/" + (date.getUTCMonth() + 1) +"/"+ date.getUTCFullYear();
		            		}

		            		showSnackBar('Get Question Board Success','Green');	
		            	}
		            	catch( e )
		            	{
		            		$scope.currentMentorQuestionBoard = [];

		            		showSnackBar('Get Question Board Failure','Red');	
		            	}
		            	
		            }

		            showMasterProgress(false);
					
					//$scope.UpdatePageSize();
		    }, 
		    function(response) { // optional
		            showMasterProgress(false);
					$scope.Loading = false;
					showSnackBar('Get Question Board Failure','Red');
					$scope.UpdatePageSize();
		    });
		}

		$scope.questionboardLoaded = false;

		$scope.FetchAllMentorsQuestionBoard = function()
		{
			var json = {
				Email : $scope.currentUser.Email
			};

			showMasterProgress(true);
			//
			$http({
		        url: '/getAllMentorsQuestionBoard',
		        method: "POST",
		        data: json,
		        json: true,
		        headers: {
					        "content-type": "application/json",  // <--Very important!!!
					    }
		    })
		    .then(function(response) {
		            
		    		if( response.data.message == 'Get Question Board Failure' )
		            {
		            	showSnackBar('Get Question Board Failure','Red');
		            	
		            }
		            else if( response.data.message == 'No Questions to Show' )
		            {
		            	showSnackBar('No Questions to Show','Red');
		            	
		            }
		            else if( response.data.message == 'Get Question Board Success' )
		            {
		            	
		            	try
		            	{
		            		$scope.questionboard  = response.data.Data;
		            		console.log( $scope.questionboard  )

		            		for( var i = 0 ; i < $scope.questionboard.length ; i++ )
		            		{
		            			$scope.questionboard[i].index = i;
		            			var date = new Date( $scope.questionboard[i].DateUpdated );
		            			$scope.questionboard[i].DateUpdated = date.getUTCDate() + "/" + (date.getUTCMonth() + 1) +"/"+ date.getUTCFullYear();
		            		}

		            		$scope.questionboardLoaded = true;

		            		showSnackBar('Get Question Board Success','Green');	
		            	}
		            	catch( e )
		            	{
		            		$scope.currentMentorQuestionBoard = [];

		            		showSnackBar('Get Question Board Failure','Red');	
		            	}
		            	
		            }

		            showMasterProgress(false);
					
					//$scope.UpdatePageSize();
		    }, 
		    function(response) { // optional
		            showMasterProgress(false);
					$scope.Loading = false;
					showSnackBar('Get Question Board Failure','Red');
					$scope.UpdatePageSize();
		    });
		}

		$scope.Posting = false;

		$scope.OptionError = false;

		$scope.PostQuestion = function()
		{
			switch( $scope.QuestionTypeSelect )
			{
				case "MCQ":

							if( $scope.MCQQuestion == undefined || $scope.MCQQuestion.length < 5 )
								$scope.MCQQuestionError = true;
							else
							{
								switch( $scope.MCQResponseType )
								{
									case "True/False" :

														//
														console.log( $scope.MCQResponseTypeTrueFalse );
														$scope.Posting = true;
														showMasterProgress(true);

														var json = 
														{
															Email : $scope.currentUser.Email,
															Question :
																{
																	QuestionType : "MCQTrue_False",
																	Question : $scope.MCQQuestion ,
																	CorrectOption : $scope.MCQResponseTypeTrueFalse ,
																	Owner : $scope.currentUser.Email,
																	"Media" : $scope.QuestionMedia
																},
															Type: "Mentor"
														};


														//
														$http({
													        url: '/postQuestion',
													        method: "POST",
													        data: json,
													        json: true,
													        headers: {
																        "content-type": "application/json",  // <--Very important!!!
																    }
													    })
													    .then(function(response) {
													            
													    		if( response.data.message == 'Post Question Failure' )
													            {
													            	showSnackBar('Post Question Failure','Red');
													            	
													            }
													            else if( response.data.message == 'Post Question Successful' )
													            {
													            	
													            	try
													            	{
													            		showSnackBar('Post Question Successful','Green');	

													            		$("#PostQuestionModal").fadeOut('slow',function(){
													            			$scope.$apply( $scope.ResetQuestions() );
													            			$("#PostQuestionModal").modal( 'hide' );
													            		});
													            	}
													            	catch( e )
													            	{
													            		$scope.data = [];

													            		showSnackBar('Post Question Failure','Red');	
													            	}
													            	
													            }

													            showMasterProgress(false);
																$scope.Posting = false;
																$scope.ShowGalleryFlag = false;
																$scope.QuestionMedia = [];
																$scope.UpdatePageSize();
																$scope.LoadPage();
													    }, 
													    function(response) { // optional
													            showMasterProgress(false);
																$scope.Posting = false;
																$scope.QuestionMedia = [];
																showSnackBar('Post Question Failure','Red');
																$scope.UpdatePageSize();
													    });
														//
														//

														break;
									case "Generic" :
														var flag = false;

														switch( parseInt( $scope.MCQResponseTypeGenericNoOfOptions ) )
														{
															case 2:
																	if( $scope.Option1Value == undefined || $scope.Option1Value.length == 0 )
																	{
																		flag=true;
																		break;
																	}

																	if( $scope.Option2Value == undefined || $scope.Option2Value.length == 0 )
																	{
																		flag=true;
																		break;
																	}

																	break;
															case 3:
																	if( $scope.Option1Value == undefined || $scope.Option1Value.length == 0 )
																	{
																		flag=true;
																		break;
																	}

																	if( $scope.Option2Value == undefined || $scope.Option2Value.length == 0 )
																	{
																		flag=true;
																		break;
																	}

																	if( $scope.Option3Value == undefined || $scope.Option3Value.length == 0 )
																	{
																		flag=true;
																		break;
																	}
																	break;
															case 4:
																	if( $scope.Option1Value == undefined || $scope.Option1Value.length == 0 )
																	{
																		flag=true;
																		break;
																	}

																	if( $scope.Option2Value == undefined || $scope.Option2Value.length == 0 )
																	{
																		flag=true;
																		break;
																	}

																	if( $scope.Option3Value == undefined || $scope.Option3Value.length == 0 )
																	{
																		flag=true;
																		break;
																	}
																	if( $scope.Option4Value == undefined || $scope.Option4Value.length == 0 )
																	{
																		flag=true;
																		break;
																	}
																	break;
														}

														if(flag)$scope.OptionError = true;
														//
														if( !flag )
														{
															$scope.Posting = true;
															showMasterProgress(true);

															var optArr = [];

															switch( parseInt( $scope.MCQResponseTypeGenericNoOfOptions ) )
															{
																case 2:
																		optArr.push( $scope.Option1Value );
																		optArr.push( $scope.Option2Value );

																		break;
																case 3:
																		optArr.push( $scope.Option1Value );
																		optArr.push( $scope.Option2Value );
																		optArr.push( $scope.Option3Value );
																		break;
																case 4:
																		optArr.push( $scope.Option1Value );
																		optArr.push( $scope.Option2Value );
																		optArr.push( $scope.Option3Value );
																		optArr.push( $scope.Option4Value );
																		break;
															}


															var json = 
															{
																Email : $scope.currentUser.Email,
																Question :
																	{
																		QuestionType : "MCQGeneric",
																		Question : $scope.MCQQuestion ,
																		NoOfOptions: parseInt( $scope.MCQResponseTypeGenericNoOfOptions ),
																		Options : optArr,
																		CorrectOption : parseInt( $scope.MCQResponseTypeGenericCorrectOption ),
																		Owner : $scope.currentUser.Email,
																		"Media" : $scope.QuestionMedia
																	},
																Type: "Mentor"
															};


															//
															$http({
														        url: '/postQuestion',
														        method: "POST",
														        data: json,
														        json: true,
														        headers: {
																	        "content-type": "application/json",  // <--Very important!!!
																	    }
														    })
														    .then(function(response) {
														            
														    		if( response.data.message == 'Post Question Failure' )
														            {
														            	showSnackBar('Post Question Failure','Red');
														            	
														            }
														            else if( response.data.message == 'Post Question Successful' )
														            {
														            	
														            	try
														            	{
														            		showSnackBar('Post Question Successful','Green');	

														            		$("#PostQuestionModal").fadeOut('slow',function(){
														            			$scope.$apply( $scope.ResetQuestions() );
														            			$("#PostQuestionModal").modal( 'hide' );
														            		});
														            	}
														            	catch( e )
														            	{
														            		$scope.data = [];

														            		showSnackBar('Post Question Failure','Red');	
														            	}
														            	
														            }

														            showMasterProgress(false);
																	$scope.Posting = false;
																	$scope.QuestionMedia = [];
																	$scope.ShowGalleryFlag = false;
																	$scope.UpdatePageSize();
																	$scope.LoadPage();
														    }, 
														    function(response) { // optional
														            showMasterProgress(false);
																	$scope.Posting = false;
																	showSnackBar('Post Question Failure','Red');
																	$scope.UpdatePageSize();
																	$scope.QuestionMedia = [];
																	$scope.ShowGalleryFlag = false;
														    });
															//
														}
														
														
														break;
								}
							}
							break;
				case "Subjective":

							console.log('Subjective Question');

							console.log( $scope.SubjectiveQuestion.length )

							if( $scope.SubjectiveQuestion.length < 5 )
								$scope.SubjectiveQuestionError = true;
							else
							{
								$scope.Posting = true;
								showMasterProgress(true);

								var json = 
								{
									Email : $scope.currentUser.Email,
									Question :
										{
											QuestionType : "Subjective",
											Question : $scope.SubjectiveQuestion ,
											Owner : $scope.currentUser.Email,
											"Media" : $scope.QuestionMedia
										},
									Type: "Mentor"
								};


								//
								$http({
							        url: '/postQuestion',
							        method: "POST",
							        data: json,
							        json: true,
							        headers: {
										        "content-type": "application/json",  // <--Very important!!!
										    }
							    })
							    .then(function(response) {
							            
							    		if( response.data.message == 'Post Question Failure' )
							            {
							            	showSnackBar('Post Question Failure','Red');
							            	
							            }
							            else if( response.data.message == 'Post Question Successful' )
							            {
							            	
							            	try
							            	{
							            		showSnackBar('Post Question Successful','Green');	

							            		window.setTimeout(function(){
								            		$("#PostQuestionModal").fadeOut('slow',function(){
								            			$scope.$apply( $scope.ResetQuestions() );

								            			$scope.$apply( $scope.LoadPage() );
								            			$("#PostQuestionModal").modal( 'hide' );
								            		});
								            	},1000);
							            	}
							            	catch( e )
							            	{
							            		$scope.data = [];

							            		showSnackBar('Post Question Failure','Red');	
							            	}
							            	
							            }

							            showMasterProgress(false);
										$scope.Posting = false;
										$scope.QuestionMedia = [];
										$scope.ShowGalleryFlag = false;
										$scope.LoadPage();
										$scope.UpdatePageSize();
							    }, 
							    function(response) { // optional
							            showMasterProgress(false);
										$scope.Posting = false;
										showSnackBar('Post Question Failure','Red');
										$scope.UpdatePageSize();
										$scope.QuestionMedia = [];
										$scope.ShowGalleryFlag = false;
							    });
								//

							}
							
							break;
			}

		}

		var questionboard = [];

		$scope.greenhornquestions = [];

		$scope.FetchGreenhornQuestions = function()
		{
			showMasterProgress(true);
			$http({
			        url: '/fetchGreenhornQuestions',
			        method: "POST",
			        json: true,
			        headers: {
						        "content-type": "application/json",  // <--Very important!!!
						    }
			    })
			    .then(function(response) {
			            
			    		if( response.data.message == 'Fetch Greenhorn Questions Failure' )
			            {
			            	showSnackBar('Fetch Greenhorn Questions Failure','Red');
			            	
			            }
			            else if( response.data.message == 'Fetch Greenhorn Questions Successful' )
			            {
			            	
			            	try
			            	{
			            		$scope.greenhornquestions = response.data.Data;
			            		console.log( 'Greenhorn Questions:' );
			            		console.log( $scope.greenhornquestions )

			            		for( var i = 0 ; i < $scope.greenhornquestions.length ; i++ )
			            		{
			            			$scope.greenhornquestions[i].index = i;
			            			var date = new Date( $scope.greenhornquestions[i].DateUpdated );
									$scope.greenhornquestions[i].DateUpdated = date.getUTCDate() + "/" + (date.getUTCMonth() + 1) +"/"+ date.getUTCFullYear();
			            		}

			            		showSnackBar('Fetch Greenhorn Questions Successful','Green');	
			            	}
			            	catch( e )
			            	{
			            		$scope.data = [];

			            		showSnackBar('Fetch Greenhorn Questions Failure','Red');	
			            	}
			            	
			            }

			            showMasterProgress(false);
						$scope.Loading = false;

						$scope.UpdatePageSize();
			    }, 
			    function(response) { // optional
			            showMasterProgress(false);
						$scope.Loading = false;
						showSnackBar('Data Fetch Failure','Red');
						$scope.UpdatePageSize();
			    });
		}

		$scope.GreenHornQuestionResponse = '';
		$scope.showResponseStyles = false;

		$scope.currentStyle = 'Basics';

		$scope.MakeBold = function( index )
		{
			var data = document.getElementById( 'response_' + index );

			var selObj = window.getSelection(); 
		    var selRange = selObj.getRangeAt(0);

		    console.log(selRange);

		    document.execCommand('bold');
		}

		$scope.MakeUnderline = function( index )
		{
			var data = document.getElementById( 'response_' + index );

			var selObj = window.getSelection(); 
		    var selRange = selObj.getRangeAt(0);

		    console.log(selRange);

		    document.execCommand('underline');
		}

		$scope.MakeItalic = function( index )
		{
			document.execCommand('italic');
		}

		$scope.MakeStrikethrough = function( index )
		{
			document.execCommand('strikeThrough');
		}

		$scope.fontFamilies = ["Times New Roman","Calibri"];

		$scope.currentFontFamily = $scope.fontFamilies[0];

		$scope.ChangeFont = function( arg )
		{
			console.log('Chaged:');

			console.log(arg);

			$scope.currentFontFamily = arg;

			console.log( $scope.currentFontFamily )
		}

		$scope.fontsize = 4;

		var execFontSize = function (size, unit) {
		    var spanString = $('<span/>', {
		        'text': document.getSelection()
		    }).css('font-size', size + unit).prop('outerHTML');

		    document.execCommand('insertHTML', false, spanString);
		};

		$scope.color = '#f05a28';

		$scope.currentColorScope = 'Foreground';

		$scope.ResetColor = function()
		{
			document.execCommand("removeFormat", false, "foreColor");
			document.execCommand("removeFormat", false, "backColor");
		}

		$scope.ResetStyles = function()
		{
			document.execCommand("removeFormat", false, "");
			$scope.fontsize = 4;
			$scope.color = '#f05a28';
			$scope.currentColorScope = 'Foreground';
			$scope.currentFontFamily = $scope.fontFamilies[0];
			$scope.GreenHornQuestionResponse = '';
			$scope.showResponseStyles = false;
			$scope.currentStyle = 'Basics';
		}

		$scope.ApplyColor = function()
		{
			console.log( $scope.currentColorScope );
			console.log( $scope.color );

			var col = $scope.color.substring(1, $scope.color.length);

			console.log( col );

			if( $scope.currentColorScope == 'Foreground' )
			{
				document.execCommand('foreColor', false, col );
			}
			else
			{
				document.execCommand('backColor', false, col );
			}
				
		}

		$scope.Align = function( arg )
		{

			switch( arg )
			{
				case 'Left' :
								document.execCommand("justifyLeft", false, ""); 
								break;
				case 'Center' :
								document.execCommand("justifyCenter", false, ""); 
								break;
				case 'Right' :
								document.execCommand("justifyRight", false, ""); 
								break;
				case 'Justify' :
								document.execCommand("justifyFull", false, ""); 
								break;
			}

		}

		$scope.ChangeFontSize = function()
		{
			console.log('Font Size Chaged:');

			console.log($scope.fontsize);

			//execFontSize($scope.fontsize, 'px');
			document.execCommand("fontSize", false, $scope.fontsize);
		}

		$scope.currentGreenhornQuestion = undefined;

		$scope.postResponsetoGreenhorModalLoad = function( arg )
		{
			document.getElementById('postResponsetoGreenhorModal').style.display = "block";
			$scope.currentGreenhornQuestion = arg;

			console.log( arg );
		}

		$scope.ViewMentorResponse = '';
		$scope.ViewMentorResponseCurrentMentorPic = '';
		$scope.ViewMentorResponseCurrentMentorUsername = '';
		$scope.ViewMentorResponseCurrentMentorQualifications = '';

		$scope.currentMentorResponse = undefined;

		$scope.starRating = 0;

		$scope.rating = 0;
		$scope.mentorRating = 3;

		$scope.viewMentorResponseOnModal = function(arg)
		{
			$scope.rating = 0;

			document.getElementById('viewMentorResponseModal').style.display = "block";

			$scope.currentMentorResponse = arg;

			console.log( 'viewMentorResponseOnModal' );
			
			console.log( $scope.currentMentorResponse.rating == undefined )

			if( $scope.currentMentorResponse.rating == undefined )
				$scope.currentMentorResponse.rating = 0;
			else
			{
				$scope.rating = 15;
				window.setTimeout(function(){

					$scope.$apply( $scope.rating = $scope.currentMentorResponse.rating );
					console.log( $scope.rating );

				},150)
				
			}

			if( $scope.currentMentorResponse.Owner.rating == undefined )
			{
				$scope.mentorRating = $scope.currentMentorResponse.Owner.rating = 0;
			}
			else
			{
				$scope.mentorRating = $scope.currentMentorResponse.Owner.rating;
			}

			console.log( $scope.currentMentorResponse );

			$scope.ViewMentorResponse = arg.MentorResponse;
			$scope.ViewMentorResponseCurrentMentorPic =  arg.Owner.ProfilePicUrl ;
			$scope.ViewMentorResponseCurrentMentorUsername =  arg.Owner.Username ;
			$scope.ViewMentorResponseCurrentMentorQualifications = arg.Owner.Qualifications;
			console.log( $scope.ViewMentorResponse );
		}

		$scope.handleDrop = function() {
	        alert('Item has been dropped');
	    }
    
	    $scope.getSelectedRating = function (rating) {

	    	showMasterProgress(true);
	    	showSnackBar('Saving...','Green');

	    	$scope.currentMentorResponse.rating = rating;
	        console.log($scope.currentMentorResponse);

	        //console.log($scope.myquestions);

	        var counti = 0;
	        var countj = 0;

	        var flag = false;

	        l: for( var i = 0 ; i < $scope.myquestions.length ; i++ )
	        {
	        	if( $scope.myquestions[i].Responses != undefined )
	        	for( var j = 0 ; j < $scope.myquestions[i].Responses.length ; j++ )
	        	{
	        		if( $scope.myquestions[i].Responses[j].Owner.Email == $scope.currentMentorResponse.Owner.Email

	        			&&

	        			$scope.myquestions[i].Responses[j].MentorResponse == $scope.currentMentorResponse.MentorResponse
	        		 )
	        		{
	        			
	        			countj = j;
	        			counti = i;

	        			flag = true;

	        			break l;
	        		}
	        	}
	        }

	        if(flag)
	        {
	        	console.log( counti );
	        	console.log( countj );
	        	console.log('found');
	        	

	        	var json = $scope.myquestions[i];
		        json.counti = counti;
		        json.countj = countj;

		        console.log( json );


		        $http({
				        url: '/addRatingToResponseGreenhornQuestions',
				        method: "POST",
				        data : json,
				        json: true,
				        headers: {
							        "content-type": "application/json",  // <--Very important!!!
							    }
				    })
				    .then(function(response) {
				            
				    		if( response.data.message == 'addRatingToResponseGreenhornQuestions Failure' )
				            {
				            	showSnackBar('Save Failed','Red');
				            	
				            }
				            else if( response.data.message == 'addRatingToResponseGreenhornQuestions Success' )
				            {
				            	showSnackBar('Saved','Yellow');
				            	console.log( response.data.Data );
				            	$scope.myquestions[counti].Responses = response.data.Data;

				            	console.log( 'Responses:' );
				            	console.log( $scope.myquestions[counti].Responses );

				            	window.setTimeout(function(){

									$scope.$apply( $scope.mentorRating = $scope.currentMentorResponse.Owner.rating = $scope.myquestions[counti].Responses[countj].Owner.rating );
									
								},150)
				            }

				            showMasterProgress(false);
							
							
				    }, 
				    function(response) { // optional
				            showMasterProgress(false);
							showSnackBar('addRatingToResponseGreenhornQuestions Failure','Red');
							
				    });
	        }


	    }

		$scope.currentMentorResponseRatingUpdate = function()
		{
			console.log( 'currentMentorResponseRatingUpdate' );
			console.log( $scope.currentMentorResponse.rating );
		}

		$scope.PlagiarismWarning = false;

		$scope.PlagiarismLinks = [];

		$scope.CheckPlagiarism = function()
		{
			window.setTimeout(function(){

				$scope.PlagiarismLinks = [];
			console.log( strip( $scope.GreenHornQuestionResponse ) );

			$http({
			        url: 'https://www.googleapis.com/customsearch/v1?key=AIzaSyBKZXdvq1rfK2r0WUrgjcWCuqA8IDJgzfg&cx=017576662512468239146:omuauf_lfve&q='+ strip($scope.GreenHornQuestionResponse) +'',
			        method: "GET"
			    }).then(function(response) {
			        console.log( response.data );

			        var data = response.data.items;

			        if( data != undefined )
			        {
			        	$scope.PlagiarismWarning = true;
			        	for( var i = 0 ; i < data.length ; i++ )
						{
							console.log( compareStrings( strip( $scope.GreenHornQuestionResponse ) , data[i].htmlSnippet )  );
							console.log( data[i].link )
							$scope.PlagiarismLinks.push( data[i].link );
						}
			        }
					
			    }, 
			    function(response) { // optional
			        console.log( response );

			        $scope.PlagiarismWarning = false;

					$scope.PlagiarismLinks = [];
			    });


			},1000);
			
		}

		$scope.viewResponsetoGreenhorModalLoad = function(arg)
		{
			document.getElementById('postResponsetoGreenhorModal').style.display = "block";
			console.log( arg );

			var resp = "";

			$scope.currentGreenhornQuestion = arg;

			for( var i = 0 ; i < arg.Responses.length ; i++ )
			{
				if( arg.Responses[i].Owner.Email == $scope.currentUser.Email )
				{
					resp = arg.Responses[i].MentorResponse;
					break;
				}
			}

			console.log( resp );

			$scope.GreenHornQuestionResponse = resp;
		}

		$scope.FindMyResponse = function(arg)
		{
			var flag = false;

			if( arg != undefined )
			{
				//console.log( arg )

				for( var i = 0 ; i < arg.length ; i++ )
				{
					//console.log(arg[i].Owner.Email)
					if( arg[i].Owner.Email == $scope.currentUser.Email )
					{
						flag = true;
						break;
					}

				}

			}
			

			return flag;
		}

		$scope.SubmitResponse = function()
		{
			//console.log( $scope.currentGreenhornQuestion );
			//console.log( $scope.GreenHornQuestionResponse );

			if( $scope.currentGreenhornQuestion.Responses == undefined )
			{
				$scope.currentGreenhornQuestion.Responses = [];

				var responseObject = {"Owner": $scope.currentUser , "MentorResponse" : $scope.GreenHornQuestionResponse};

				$scope.currentGreenhornQuestion.Responses.push( responseObject );
			}
			else
			{
				var bool = false;

				for ( var i = 0 ; i < $scope.currentGreenhornQuestion.Responses.length ; i++ )
				{
					if( $scope.currentGreenhornQuestion.Responses[i].Owner.Email == $scope.currentUser.Email )
					{
						$scope.currentGreenhornQuestion.Responses[i].MentorResponse = $scope.GreenHornQuestionResponse;
						bool = true;
						break;
					}
				}

				if( !bool )
				{
					var responseObject = {"Owner": $scope.currentUser , "MentorResponse" : $scope.GreenHornQuestionResponse};
					$scope.currentGreenhornQuestion.Responses.push( responseObject );
				}
			}

			console.log( $scope.currentGreenhornQuestion );

			showMasterProgress(true);

			$http({
			        url: '/postMentorResponseToGreenhornQuestion',
			        method: "POST",
			        data : $scope.currentGreenhornQuestion,
			        json: true,
			        headers: {
						        "content-type": "application/json",  // <--Very important!!!
						    }
			    })
			    .then(function(response) {
			            
			    		if( response.data.message == 'Post Mentor Response Failure' )
			            {
			            	showSnackBar('Post Mentor Response Failure','Red');
			            	
			            }
			            else if( response.data.message == 'Post Mentor Response Success' )
			            {
			            	showSnackBar('Post Mentor Response Success','Green');
			            	$("#postResponsetoGreenhorModal").fadeOut("slow");
			            	$scope.ResetStyles();
			            }

			            showMasterProgress(false);
						
						$scope.UpdatePageSize();
			    }, 
			    function(response) { // optional
			            showMasterProgress(false);
						showSnackBar('Post Mentor Response Failure','Red');
						$scope.UpdatePageSize();
			    });
		}

		$scope.selected_id = 0;
		$scope.selected_name = 'Starbuck';

		$scope.ApplyFont = function( )
		{
			console.log( $scope.selected_id );
			
			document.execCommand("fontName", false, $scope.currentFontFamily);
		}

		$scope.SubmitGreenHornQuestionResponse = function(x,GreenHornQuestionResponse,y)
		{
			console.log(x);
			console.log( GreenHornQuestionResponse );

			console.log(y);
			console.log( document.getElementById( 'response_' + y ) );

			if( x.Responses == undefined )
			{
				var json = {Owner : $scope.currentUser , Response: GreenHornQuestionResponse};
				x.Responses = [];
				x.Responses.push( json ); 
			}
			else
			{
				var json = {Owner : $scope.currentUser , Response: GreenHornQuestionResponse};
				x.Responses.push( json ); 
			}

			$scope.GreenHornQuestionResponse = '';
			console.log(x);
		}

		$scope.myquestions = [];

		$scope.FetchGreenhornMyQuestions = function()
		{
			console.log('FetchGreenhornMyQuestions');

			showMasterProgress(true);

			var json = {Email: $scope.currentUser.Email};

			$http({
			        url: '/fetchGreenhornMyQuestions',
			        method: "POST",
			        data : json,
			        json: true,
			        headers: {
						        "content-type": "application/json",  // <--Very important!!!
						    }
			    })
			    .then(function(response) {
			            
			    		if( response.data.message == 'Fetch Greenhorn My Questions Failure' )
			            {
			            	showSnackBar('Fetch Greenhorn Questions Failure','Red');
			            	
			            }
			            else if( response.data.message == 'Fetch Greenhorn My Questions Successful' )
			            {
			            	
			            	try
			            	{
			            		$scope.myquestions = response.data.Data;
			            		console.log( 'Greenhorn My Questions:' );
			            		console.log( $scope.myquestions )

			            		for( var i = 0 ; i < $scope.myquestions.length ; i++ )
			            		{
			            			$scope.myquestions[i].index = i;
			            			var date = new Date( $scope.myquestions[i].DateUpdated );
									$scope.myquestions[i].DateUpdated = date.getUTCDate() + "/" + (date.getUTCMonth() + 1) +"/"+ date.getUTCFullYear();
			            		}

			            		showSnackBar('Fetch Greenhorn Questions Successful','Green');	
			            	}
			            	catch( e )
			            	{
			            		$scope.myquestions = [];

			            		showSnackBar('Fetch Greenhorn Questions Failure','Red');	
			            	}
			            	
			            }

			            showMasterProgress(false);
						
						$scope.UpdatePageSize();
			    }, 
			    function(response) { // optional
			            showMasterProgress(false);
						$scope.Loading = false;
						showSnackBar('Fetch Greenhorn Questions Failure','Red');
						$scope.UpdatePageSize();
			    });
		}

		$scope.LoadPage = function()
		{
			console.log('Load Call');

			$scope.LoadNotStarted = false;
			
					switch( $scope.currentUser.Type )
					{
						case "Greenhorn" :
											var json = {
												Email : $scope.currentUser.Email,
												Type : $scope.currentUser.Type
											};

											showMasterProgress(true);
											$scope.Loading = true; 
											//
											$http({
										        url: '/fetchMasterData',
										        method: "POST",
										        data: json,
										        json: true,
										        headers: {
													        "content-type": "application/json",  // <--Very important!!!
													    }
										    })
										    .then(function(response) {
										            
										    		if( response.data.message == 'Data Fetch Failure' )
										            {
										            	showSnackBar('Data Fetch Failure','Red');
										            	
										            }
										            else if( response.data.message == 'Data Fetch Successful' )
										            {
										            	
										            	try
										            	{
										            		$scope.data = response.data.Data;
										            		console.log( $scope.data )

										            		for( var i = 0 ; i < $scope.data.length ; i++ )
										            		{
										            			$scope.data[i].index = i;
										            		}

										            		showSnackBar('Data Fetch Successful','Green');	
										            	}
										            	catch( e )
										            	{
										            		$scope.data = [];

										            		showSnackBar('Data Fetch Failure','Red');	
										            	}
										            	
										            }

										            showMasterProgress(false);
													$scope.Loading = false;

													$scope.UpdatePageSize();
										    }, 
										    function(response) { // optional
										            showMasterProgress(false);
													$scope.Loading = false;
													showSnackBar('Data Fetch Failure','Red');
													$scope.UpdatePageSize();
										    });

											$scope.FetchAllMentorsQuestionBoard();
											$scope.FetchGreenhornMyQuestions();

											//
											break;
							case "Mentor" :
											var json = {
												Email : $scope.currentUser.Email,
												Type : $scope.currentUser.Type
											};

											showMasterProgress(true);
											$scope.Loading = true; 
											//
											$http({
										        url: '/getMentorQuestionBoard',
										        method: "POST",
										        data: json,
										        json: true,
										        headers: {
													        "content-type": "application/json",  // <--Very important!!!
													    }
										    })
										    .then(function(response) {
										            
										    		if( response.data.message == 'Get Question Board Failure' )
										            {
										            	showSnackBar('Get Question Board Failure','Red');
										            	
										            }
										            else if( response.data.message == 'No Questions to Show' )
										            {
										            	showSnackBar('No Questions to Show','Red');
										            	
										            }
										            else if( response.data.message == 'Get Question Board Success' )
										            {
										            	
										            	try
										            	{
										            		$scope.questionboard  = response.data.Data;
										            		console.log( $scope.questionboard  )

										            		for( var i = 0 ; i < $scope.questionboard .length ; i++ )
										            		{
										            			$scope.questionboard[i].index = i;
										            			var date = new Date( $scope.questionboard[i].DateUpdated );
										            			$scope.questionboard[i].DateUpdated = date.getUTCDate() + "/" + (date.getUTCMonth() + 1) +"/"+ date.getUTCFullYear();
										            		}

										            		showSnackBar('Get Question Board Success','Green');	
										            	}
										            	catch( e )
										            	{
										            		$scope.questionboard = [];

										            		showSnackBar('Get Question Board Failure','Red');	
										            	}
										            	
										            }

										            showMasterProgress(false);
													$scope.Loading = false;

													$scope.UpdatePageSize();
										    }, 
										    function(response) { // optional
										            showMasterProgress(false);
													$scope.Loading = false;
													showSnackBar('Get Question Board Failure','Red');
													$scope.UpdatePageSize();
										    });
											//
											$scope.FetchGreenhornQuestions();
											break;
					}

	    			
			
		}

		window.setTimeout(function(){
			$scope.$apply( $scope.LoadPage() );
		},200);
		

		$scope.UpdatePageSize();

	}]);