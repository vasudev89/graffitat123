
////////

function compareStrings (a,b)
{
	var checkForPlagiarism = true;
	var piecesA = a.split("\\s");
	var piecesB = b.split("\\s");

	var count1 = 0;
	var count2 = 0;
	for (var counter = 0; counter <= piecesA.length - 1; counter++)
	{
	  for(var counter2 = 0; counter<= piecesB.length - 1; counter++)
	  {
	      if(piecesA[counter]==(piecesB[counter2]))
	      {
	      	count1++;
	      }
	  }
	}
	for (var counter = 0; counter <= piecesB.length - 1; counter++)
	{
	  for(var counter2 = 0; counter <= piecesA.length - 1; counter++)
	  {
	      if(piecesA[counter] == (piecesB[counter]))
	      {
	      	count2++;
	      }
	  }
	}

	if((count1/(piecesA.length))*100 >= 50 && (count2/(piecesB.length))*100 >= 50)
	{
	 checkForPlagiarism = false;
	}

	return checkForPlagiarism;
}

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function hndlr(response) {
		console.log('response from custom search');

		//console.log( response );

		if( response != null )
		{
			var data = response.items;

			for( var i = 0 ; i < data.length ; i++ )
			{
				console.log( compareStrings( 'w3schools' , data[i].htmlSnippet )  );
				console.log( data[i].link )
			}
		}

      
    }

String.prototype.hashCode = function(){
    if (Array.prototype.reduce){
        return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
    } 
    var hash = 0;
    if (this.length === 0) return hash;
    for (var i = 0; i < this.length; i++) {
        var character  = this.charCodeAt(i);
        hash  = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function showSnackBar(arg,col) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar")

    x.innerHTML = arg;

    // Add the "show" class to DIV
    x.className = "show";

    switch( col )
    {
    	case 'Red':
    				x.style.backgroundColor = '#800000';
    				break;
    	case 'Green':
    				x.style.backgroundColor = '#FFC706';
    				break;
    	case 'Yellow' :
    				x.style.backgroundColor = '#00C700';

    }

    //if( col == 'Red' )x.style.backgroundColor = '#800000';else x.style.backgroundColor = '#FFC706';

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function showSnackBar1(arg,col) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar1")

    x.innerHTML = arg;

    // Add the "show" class to DIV
    x.className = "show";

    if( col == 'Red' )x.style.backgroundColor = '#800000';else x.style.backgroundColor = '#FFC706';

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function showSnackBar2(arg,col) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar2")

    x.innerHTML = arg;

    // Add the "show" class to DIV
    x.className = "show";

    if( col == 'Red' )x.style.backgroundColor = '#800000';else x.style.backgroundColor = '#FFC706';

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function showSnackBar3(arg,col) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar3")

    x.innerHTML = arg;

    // Add the "show" class to DIV
    x.className = "show";

    if( col == 'Red' )x.style.backgroundColor = '#800000';else x.style.backgroundColor = '#FFC706';

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}


function showMasterProgress(arg) {
    
    if(arg)
    {
    	$("#loader1").css({'visibility':'visible'});
    	$("#loader1").fadeIn("fast");
    }	
	else
	{
		$("#loader1").fadeOut("fast",function(){
			$("#loader1").css({'visibility':'hidden'});	
		});
	}
		
}

window.setTimeout(function(){
	showMasterProgress(false);
	//alert('Hi');
},500);


function openTab(evt, cityName) {
    try
    {
    	// Declare all variables
	    var i, tabcontent, tablinks;

	    // Get all elements with class="tabcontent" and hide them
	    tabcontent = document.getElementsByClassName("tabcontent");
	    for (i = 0; i < tabcontent.length; i++) {
	        tabcontent[i].style.display = "none";
	    }

	    // Get all elements with class="tablinks" and remove the class "active"
	    tablinks = document.getElementsByClassName("tablinks");
	    for (i = 0; i < tablinks.length; i++) {
	        tablinks[i].className = tablinks[i].className.replace(" active", "");
	    }

	    // Show the current tab, and add an "active" class to the button that opened the tab
	    document.getElementById(cityName).style.display = "block";
	    evt.currentTarget.className += " active";
    }
    catch( e )
    {

    }
    
}

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Chrome, Safari and Opera 
    document.documentElement.scrollTop = 0; // For IE and Firefox
}

var app = angular.module('myApp',['ngRoute','mp.colorPicker']);

app.directive('draggable', function() {
    return function(scope, element) {
    // this gives us the native JS object
    var el = element[0];
    
    el.draggable = true;
    
    el.addEventListener(
      'dragstart',
      function(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('Text', this.id);
        this.classList.add('drag');
        return false;
      },
      false
    );
    
    el.addEventListener(
      'dragend',
      function(e) {
        this.classList.remove('drag');
        return false;
      },
      false
    );
  }
});

app.directive('droppable', function() {
    return {
    scope: {
      drop: '&' // parent
    },
    link: function(scope, element) {
      // again we need the native object
      var el = element[0];
      
      el.addEventListener(
        'dragover',
        function(e) {
          e.dataTransfer.dropEffect = 'move';
          // allows us to drop
          if (e.preventDefault) e.preventDefault();
          this.classList.add('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'dragenter',
        function(e) {
          this.classList.add('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'dragleave',
        function(e) {
          this.classList.remove('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'drop',
        function(e) {
          // Stops some browsers from redirecting.
          if (e.stopPropagation) e.stopPropagation();
          
          console.log( this );

          //this.classList.remove('over');
          
          console.log( e.dataTransfer.getData('Text') );

          var item = document.getElementById(e.dataTransfer.getData('Text'));
          


          //this.appendChild(item);
          
          // call the drop passed drop function
          scope.$apply('drop()');
          
          return false;
        },
        false
      );
    }
  }
});

app.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});

//

starRating = 0;

app.directive('starRating',
function() {
return {
restrict : 'A',
template : '<ul class="rating">'
					 + '	<li ng-repeat="star in stars" ng-click="toggle($index)">'
           + '<span ng-style="star" style="cursor:default;">'
           + '\u2605'
           + '</span>'
					 + '</li>'
					 + '</ul>',
scope : {
 ratingValue : '=',
 max : '=',
 onRatingSelected : '&'
},
link : function(scope, elem, attrs) {

 var updateStars = function() {
  scope.stars = [];

  var percent = ( scope.ratingValue / scope.max ) * 100;
  var perstarpercent = ( 1 / scope.max ) * 100;

  var color = "#FFC706";
  var fontSize = "35px";

  for ( var i = 0; i < scope.max; i++) {

    var starpercent = ( (i+1) / scope.max ) * 100;

    //console.log( starpercent );

    if( starpercent <= percent )
    {
      scope.stars.push({
       "background" : "linear-gradient(to right , "+color+" 100% , #a9a9a9 0%)",
       "-webkit-background-clip" : "text",
       "-webkit-text-fill-color" : "transparent",
       "box-shadow" : "2px 2px 2px #AAAAAA",
       "cursor" : "pointer",
       "font-size": fontSize
      });
    }
    else {
      if( starpercent - percent < perstarpercent )
      {
        scope.stars.push({
         "background" : "linear-gradient(to right , "+color+" "+(100 - (((starpercent - percent)/perstarpercent)*100))+"% , #a9a9a9 0%)",
         "-webkit-background-clip" : "text",
         "-webkit-text-fill-color" : "transparent",
         "box-shadow" : "2px 2px 2px #AAAAAA",
         "cursor" : "pointer",
         "font-size": fontSize
        });
      }
      else {
        scope.stars.push({
         "background" : "linear-gradient(to right , #a9a9a9 0% , #a9a9a9 100%)",
         "-webkit-background-clip" : "text",
         "-webkit-text-fill-color" : "transparent",
         "box-shadow" : "2px 2px 2px #AAAAAA",
         "cursor" : "pointer",
         "font-size": fontSize
        });
      }
    }


  }
 };

 //
 scope.stars = [];

 var color = "#FFC706";
  var fontSize = "35px";

 for ( var i = 0; i < scope.max; i++) {

    scope.stars.push({
       "background" : "linear-gradient(to right , #a9a9a9 0% , #a9a9a9 100%)",
       "-webkit-background-clip" : "text",
       "-webkit-text-fill-color" : "transparent",
       "box-shadow" : "2px 2px 2px #AAAAAA",
       "cursor" : "pointer",
       "font-size": fontSize
      });
    
  }
 //

 scope.toggle = function(index) {
  scope.ratingValue = index + 1;
  scope.onRatingSelected({
   rating : index + 1
  });
 };

 scope.$watch('ratingValue',
  function(oldVal, newVal) {
   if (newVal) {
   	
    updateStars();
   }
  });
}
};
});

//////////////////////////////////////////

app.directive('starRating1',
function() {
return {
restrict : 'A',
template : '<ul class="rating">'
					 + '	<li ng-repeat="star in stars" ng-click="">'
           + '<span ng-style="star" style="cursor:default;">'
           + '\u2605'
           + '</span>'
					 + '</li>'
					 + '</ul>',
scope : {
 ratingValue : '=',
 max : '=',
 onRatingSelected : '&'
},
link : function(scope, elem, attrs) {
 var updateStars = function() {
  scope.stars = [];

  var percent = ( scope.ratingValue / scope.max ) * 100;
  var perstarpercent = ( 1 / scope.max ) * 100;

  var color = "#FFC706";
  var fontSize = "35px";

  for ( var i = 0; i < scope.max; i++) {

    var starpercent = ( (i+1) / scope.max ) * 100;

    //console.log( starpercent );

    if( starpercent <= percent )
    {
      scope.stars.push({
       "background" : "linear-gradient(to right , "+color+" 100% , #a9a9a9 0%)",
       "-webkit-background-clip" : "text",
       "-webkit-text-fill-color" : "transparent",
       "box-shadow" : "2px 2px 2px #AAAAAA",
       "font-size": fontSize
      });
    }
    else {
      if( starpercent - percent < perstarpercent )
      {
        scope.stars.push({
         "background" : "linear-gradient(to right , "+color+" "+(100 - (((starpercent - percent)/perstarpercent)*100))+"% , #a9a9a9 0%)",
         "-webkit-background-clip" : "text",
         "-webkit-text-fill-color" : "transparent",
         "box-shadow" : "2px 2px 2px #AAAAAA",
         "font-size": fontSize
        });
      }
      else {
        scope.stars.push({
         "background" : "linear-gradient(to right , #a9a9a9 0% , #a9a9a9 100%)",
         "-webkit-background-clip" : "text",
         "-webkit-text-fill-color" : "transparent",
         "box-shadow" : "2px 2px 2px #AAAAAA",
         "font-size": fontSize
        });
      }
    }


  }
 };

 updateStars();

 scope.toggle = function(index) {
  scope.ratingValue = index + 1;
  scope.onRatingSelected({
   rating : index + 1
  });
 };

 scope.$watch('ratingValue',
  function(oldVal, newVal) {
   if (newVal) {
    updateStars();
   }
  });
}
};
});

//////////////////////////////////////////

//alert('Hi');

app.config(function($routeProvider){
	
	$routeProvider
	
	.when('/',{
		templateUrl : 'home.html',
		controller : 'homeController'
	})
	.when('/home',{
		templateUrl : 'home.html',
		controller : 'homeController'
		
	})
	.when('/login',{
	
		templateUrl : 'c_user/login.html',
		controller  : 'UserController'
		
		
	})
	.when('/logout',{
	
		templateUrl : '',
		controller  : ''
		
	})
	.when('/chat',{
	
		templateUrl : 'chat/chat.html',
		controller  : 'ChatController'
		
	})

	.when('/masterpage',{
	
		templateUrl : 'masterpage.html',
		controller  : 'masterPageController'
		
	})

	.when('/mediaspace',{
	
		templateUrl : 'mediaspace.html',
		controller  : 'mediaSpaceController'
		
	})
	
	.when('/chat/:secondUser',{
	
		templateUrl : 'chat/chat.html',
		controller  : 'ChatController'
		
	})
	
	.when('/groupchat',{
	
		templateUrl : 'groupchat/groupchat.html',
		controller  : 'GroupChatController'
		
	})
	
	
	.when('/aboutus',{
		templateUrl : 'aboutus.html'
	})
	.when('/friends',{
		templateUrl : 'friends/friend.html',
		controller  :  'FriendController'
	})
	.when('/friends/:secondUser',{
		templateUrl : 'friends/friend.html',
		controller  :  'FriendController'
	})
	.when('/searchUser',{
		templateUrl : 'c_user/searchUser.html',
		controller  :  'UserController'
	})
	.when('/jobs',{
		templateUrl : 'c_job/job.html',
		controller : 'JobController'
	})
	.when('/blogs',{
		templateUrl : 'blogs/blog.html',
		controller: 'BlogController'
	})
	.when('/blogs/:secondUser',{
		templateUrl : 'blogs/blog.html',
		controller: 'BlogController'
	})
	.when('/forums',{
		templateUrl : 'forums/forums.html',
		controller: 'ForumController'
	})
	.when('/forums/:secondUser',{
		templateUrl : 'forums/forums.html',
		controller: 'ForumController'
	})
	.when('/profile',{
		templateUrl : 'profile.html',
		controller: 'ProfileController'
	})
	.when('/profile/:secondUser',{
		templateUrl : 'profile/profile.html',
		controller: 'ProfileController'
	})
	.when('/createBlog',{
		templateUrl: 'c_blog/createBlog.html',
		controller: 'BlogController'
	})
	.when('/events',{
		templateUrl: 'c_event/listEvents.html',
	    controller: 'EventController'
	})
	
})