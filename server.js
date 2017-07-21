var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var cloudinary = require('cloudinary');
var qs = require('querystring');

ObjectId = require('mongodb').ObjectID;

cloudinary.config({ 
  cloud_name: 'dikd9evvg', 
  api_key: '218654849534313', 
  api_secret: 'rSv6dMmSaadkKm9Ui4U597AgsGw' 
});

// parse application/json
app.use(bodyParser.json({limit:'20mb'}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit:'20mb' , extended: true  }))



var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
 
// Connection URL 
var url = 'mongodb://vasudev:godfather1989@ds121091.mlab.com:21091/imaginarium';
// Use connect method to connect to the Server

var dbRef = undefined;
var greenhorns = undefined;
var greenhornquestions = undefined;
var mentors = undefined;
var subjectives = undefined;
var mcqs = undefined;
var mediaspaces = undefined;

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to Mongo server");
 
  dbRef = db;
  greenhorns = dbRef.collection('greenhorns');
  greenhornquestions = dbRef.collection('greenhornquestions');
  mentors = dbRef.collection('mentors');
  subjectives = dbRef.collection('subjectives');
  mcqs = dbRef.collection('mcqs');

  mediaspaces = dbRef.collection('mediaspaces');
});

app.use(express.static('public'))

app.get('/head-meta', function (req, res){ res.sendFile( __dirname + "/public/headerfiles/head-meta.html" ); });
// app.get('/app.js', function (req, res){ res.sendFile( __dirname + "/public/app.js" ); });
app.get('/home', function (req, res){ res.sendFile( __dirname + "/home.html" ); });

app.get('/', function (req, res) {

	// greenhorns.insertMany([
 //    {a : 1}, {a : 2}, {a : 3}
 //  ], function(err, result) {
 //    assert.equal(err, null);
 //    assert.equal(3, result.result.n);
 //    assert.equal(3, result.ops.length);
 //    console.log("Inserted 3 documents into the document collection");
 //    //callback(result);
 //  });

  res.sendFile(__dirname + '/index.html')
})

app.post('/greenhornSignup', function (req, res){

	console.log( '/greenhornSignup' );

	console.log( req.body );
	
  try
  {
    greenhorns.find({"Email": req.body.Email}).toArray(function(err, docs) {
      assert.equal(err, null);
      
      if( docs.length != 0 )
        res.send( {message:"Email In Use"} );
      else
      {
        mentors.find({"Email": req.body.Email}).toArray(function(err, docs) {
          assert.equal(err, null);
          
          if( docs.length != 0 )
            res.send( {message:"Email In Use"} );
          else
          {
            var json = req.body;

            json.QuestionsLeft = 5;

            if( json.Gender == "Male" )            
              json.ProfilePicUrl = "images/profilepic_male.jpg";
            else
              json.ProfilePicUrl = "images/profilepic_female.jpg";

            json.Type = "Greenhorn";

            greenhorns.insert(json);
            res.send( {message:"Greenhorn Signup Successful"} );
          }
        });
      }
    });
    
  }
  catch(e)
  {
    console.log(e);

    res.send( {message:"Greenhorn Signup Failure"} );
  }
 
});

app.post('/mentorSignup', function (req, res){

  console.log( '/mentorSignup' );

  console.log( req.body );
  
  try
  {
    greenhorns.find({"Email": req.body.Email}).toArray(function(err, docs) {
      assert.equal(err, null);
      
      if( docs.length != 0 )
        res.send( {message:"Email In Use"} );
      else
      {
        mentors.find({"Email": req.body.Email}).toArray(function(err, docs) {
          assert.equal(err, null);
          
          if( docs.length != 0 )
            res.send( {message:"Email In Use"} );
          else
          {
            var json = req.body;

            if( json.Gender == "Male" )            
              json.ProfilePicUrl = "images/profilepic_male.jpg";
            else
              json.ProfilePicUrl = "images/profilepic_female.jpg";

            json.Type = "Mentor";

            mentors.insert(json);
            res.send( {message:"Mentor Signup Successful"} );
          }
        });
      }
    });
  }
  catch(e)
  {
    console.log(e);

    res.send( {message:"Mentor Signup Failure"} );
  }
 
});

app.post('/attemptLogin', function (req, res){

  console.log( '/attemptLogin' );

  console.log( req.body );
  
  var respJSON;

  try
  {
    greenhorns.find({"Email": req.body.Email,"Password":req.body.Password}).toArray(function(err, docs) {
      assert.equal(err, null);
      
      if( docs.length != 0 )
      {
        console.log( docs );
        var json = docs[0];
        delete json.Password;
        delete json._id;

        console.log( json );

        respJSON = {message:"Login Successful",Data: json ,"Type":"Greenhorn"};
        res.send( respJSON );
      }
      else
      {
        mentors.find({"Email": req.body.Email,"Password":req.body.Password}).toArray(function(err, docs) {
          assert.equal(err, null);
          
          if( docs.length != 0 )
          {
            console.log( docs );
            var json = docs[0];
            delete json.Password;
            delete json._id;
            respJSON = {message:"Login Successful",Data: json ,"Type":"Mentor"};
            
            res.send( respJSON );
          }
          else
          {
            res.send( {message:"Invalid Credentials"} );
          }
        });
      }
    });
  }
  catch(e)
  {
    console.log(e);

    res.send( {message:"Something Went Wrong"} );
  }
 
});

app.post('/fetchMasterData', function (req, res){

  console.log( '/fetchMasterData' );

  console.log( req.body );
  
  var respJSON;

  try
  {
    switch(req.body.Type)
    {
      case "Greenhorn":
                        mentors.find({}).toArray(function(err, docs) {
                          assert.equal(err, null);
                          
                          if( docs.length != 0 )
                          {
                            console.log( docs );
                            var json = docs;

                            for( var i = 0 ; i < json.length ; i++ )
                            {
                              delete json[i].Password;
                              delete json[i]._id;
                            }

                            console.log( json );

                            respJSON = {message:"Data Fetch Successful",Data: json ,"Type":"Greenhorn"};
                            res.send( respJSON );
                          }
                          else
                          {
                            res.send( {message:"Data Fetch Failure"} );
                          }
                        });

                        break;
    }
    
  }
  catch(e)
  {
    console.log(e);

    res.send( {message:"Data Fetch Failure"} );
  }
 
});

app.post('/getMentorQuestionBoard', function (req, res){

  console.log( '/getMentorQuestionBoard' );

  console.log( req.body );
  
  var respJSON;

  var questionBoard = [];

  var Owner;

  try
  {

    mentors.find({"Email": req.body.Email}).toArray(function(err, docs) {
      assert.equal(err, null);
                              
      if( docs.length != 0 )
      {
        Owner = docs[0];

        delete Owner.Password;
        delete Owner._id;
  
        subjectives.find({"Owner": req.body.Email}).toArray(function(err, docs) {
          assert.equal(err, null);
                                  
          if( docs.length != 0 )
          {
            for( var i = 0 ; i < docs.length ; i++ )
              questionBoard.push(docs[i]);
          }

          // if( questionBoard.length != 0 )
          //   console.log('Subjectives found')

          mcqs.find({"Owner": req.body.Email}).toArray(function(err, docs) {
            assert.equal(err, null);
                                    
            if( docs.length != 0 )
            {
              for( var i = 0 ; i < docs.length ; i++ )
                questionBoard.push(docs[i]);

            }
            
            if( questionBoard.length != 0 )
            {
              for( var i = 0 ; i < questionBoard.length ; i++ )
                questionBoard[i].Owner = Owner;

              respJSON = {message:"Get Question Board Success",Data: questionBoard ,"Type":"Mentor"};
              res.send( respJSON );
              
            }
            else
            {
              respJSON = {message:"Get Question Board Failure",Data: questionBoard ,"Type":"Mentor"};
              res.send( respJSON ); 
            }

            

          });

        });
      }
      else
      {
        respJSON = {message:"Get Question Board Failure",Data: questionBoard ,"Type":"Mentor"};
        res.send( respJSON );
      }

      
    });
     
  }
  catch(e)
  {
    console.log(e);

    res.send( {message:"Get Question Board Failure"} );
  }
 
});

app.post('/getAllMentorsQuestionBoard', function (req, res){

  console.log( '/getAllMentorsQuestionBoard' );

  console.log( req.body );
  
  var respJSON;

  var questionBoard = [];

  var Owner;

  try
  {

    subjectives.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
                              
      if( docs.length != 0 )
      {
        for( var i = 0 ; i < docs.length ; i++ )
          questionBoard.push(docs[i]);
      }

      // if( questionBoard.length != 0 )
      //   console.log('Subjectives found')

      mcqs.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
                                
        if( docs.length != 0 )
        {
          for( var i = 0 ; i < docs.length ; i++ )
            questionBoard.push(docs[i]);

        }

        greenhornquestions.find({}).toArray(function(err, docs) {
          assert.equal(err, null);
          if( docs.length != 0 )
          {

            console.log( 'Greenhorn Questions' )
            console.log( docs )

            for( var i = 0 ; i < docs.length ; i++ )
              questionBoard.push(docs[i]);

            if( questionBoard.length != 0 )
            {
              var mentorsList = [];

              for( var i = 0 ; i < questionBoard.length ; i++ )
              {
                if( questionBoard[i].Type != "GreenhornQuestion" )
                  mentorsList.push( questionBoard[i].Owner );
              }

              mentors.find({"Email": {$in:mentorsList} }).toArray(function(err, docs) {
                  assert.equal(err, null);
                                          
                  if( docs.length != 0 )
                  {
                    for( var i = 0 ; i < questionBoard.length ; i++ )
                    {
                      for( var j = 0 ; j < docs.length ; j++ )
                      {
                        if( questionBoard[i].Owner == docs[j].Email )
                        {
                          questionBoard[i].Owner = docs[j];
                          break;
                        }
                      }
                    }

                    respJSON = {message:"Get Question Board Success",Data: questionBoard ,"Type":"Mentor"};
                    res.send( respJSON );
                  }
                  else
                  {
                    respJSON = {message:"Get Question Board Failure",Data: questionBoard ,"Type":"Mentor"};
                    res.send( respJSON );
                  }

                  
                });
                
            }
            else
            {
              respJSON = {message:"Get Question Board Failure",Data: questionBoard ,"Type":"Mentor"};
              res.send( respJSON ); 
            }

          }


        });
        
        

        

      });

    });

     
  }
  catch(e)
  {
    console.log(e);

    res.send( {message:"Get Question Board Failure"} );
  }
 
});

app.post('/deleteQuestion', function (req, res){

  console.log( '/deleteQuestion' );

  console.log( req.body );
  
  var respJSON;

  try
  {

    if( req.body.Question.Type != undefined && req.body.Question.Type == "GreenhornQuestion" )
    {
      greenhornquestions.remove({"_id": ObjectId( req.body.Question._id )},function(err,result){

        if (err) {
            console.log(err);
            res.send( {message:"Delete Question Failure"} );
        }
        console.log(result);
        res.send( {message:"Delete Question Success"} );
        

      });
    }
    else
    {
      console.log( req.body.Question._id );

      switch( req.body.Question.QuestionType )
      {
        case "Subjective" :
                            subjectives.remove({"_id": ObjectId( req.body.Question._id )},function(err,result){

                              if (err) {
                                  console.log(err);
                                  res.send( {message:"Delete Question Failure"} );
                              }
                              console.log(result);
                              res.send( {message:"Delete Question Success"} );
                              

                            });

                            
                            break;
        case "MCQTrue_False" :
                            mcqs.remove({"_id": ObjectId( req.body.Question._id )},function(err,result){

                              if (err) {
                                  console.log(err);
                                  res.send( {message:"Delete Question Failure"} );
                              }
                              console.log(result);
                              res.send( {message:"Delete Question Success"} );
                              

                            });
                            break;
        case "MCQGeneric" :
                            mcqs.remove({"_id": ObjectId( req.body.Question._id )},function(err,result){

                              if (err) {
                                  console.log(err);
                                  res.send( {message:"Delete Question Failure"} );
                              }
                              console.log(result);
                              res.send( {message:"Delete Question Success"} );
                              

                            });
                            break;
      }
    }
     
  }
  catch(e)
  {
    console.log(e);

    res.send( {message:"Delete Question Failure"} );
  }
 
});

app.post('/postGreenhornQuestion', function (req, res){

  console.log( '/postGreenhornQuestion' );

  console.log( req.body );
  
  var respJSON;

  try
  {
    var json = req.body;

    json.DateUpdated = new Date();

    greenhornquestions.insert(json , function(err,docs){

      assert.equal(err, null);
      
      if( docs.length != 0 )
      {
        console.log( docs );
        var json = docs;

        console.log( json );

        greenhorns.findAndModify(
          {Email: req.body.Owner.Email}, // query
          [['_id','asc']],  // sort order
          {$set: 
            {
              QuestionsLeft : parseInt( req.body.Owner.QuestionsLeft ) - 1
            }
          }, // replacement, replaces only the field "hi"
          {}, // options
          function(err, object) {
              if (err){
                  console.warn(err.message);  // returns error if no matching object found
                  respJSON = {message:"Greenhorn Post Question Failure"};
              }else{
                  console.log(object);

                  var json = {"QuestionsLeft":parseInt( req.body.Owner.QuestionsLeft ) - 1};

                  respJSON = {message:"Greenhorn Post Question Success",Data: json ,"Type":"Greenhorn"};
                  res.send( respJSON );
              }
          });

      }
      else
      {
        res.send( {message:"Greenhorn Post Question Failure"} );
      }

    });
    
  }
  catch(e)
  {
    console.log(e);

    res.send( {message:"Greenhorn Post Question Failure"} );
  }
 
});

app.post('/addRatingToResponseGreenhornQuestions', function (req, res){

  console.log( '/addRatingToResponseGreenhornQuestions' );

  console.log( req.body );
  
  var respJSON;

  var ownerEmail = req.body.Responses[req.body.counti].Owner.Email;

  console.log( ownerEmail );

  try
  {
    
  //
  mentors.find({ "Email" : ownerEmail }).toArray(
  function(err, docs)
  {
    assert.equal(err, null);

    console.log( docs );

    if( docs.length != 0 )
    {
      console.log( docs );
      var json = docs[0];

      console.log( 'Current Rating' );
      console.log( json.rating );

      if( json.rating == undefined )
      {
        json.rating = req.body.Responses[req.body.counti].rating;
        json.ratingCount = 1;
      }
      else
      {
        json.rating = (json.rating * json.ratingCount + req.body.Responses[req.body.counti].rating)/(json.ratingCount+1);
        json.ratingCount += 1;

        console.log('Rating Advance');
        console.log( json.rating )
      }

      mentors.findAndModify(
          {"Email": ownerEmail}, // query
          [['_id','asc']],  // sort order
          {$set: 
            {
              rating : json.rating,
              ratingCount : json.ratingCount
            }
          }, // replacement, replaces only the field "hi"
          {}, // options
          function(err, object)
          {
            if (err){
                console.warn(err.message);  // returns error if no matching object found
                respJSON = {message:"addRatingToResponseGreenhornQuestions Failure"};
            }else{

              greenhornquestions.findAndModify(
                {"_id": ObjectId( req.body._id )}, // query
                [['_id','asc']],  // sort order
                {$set: 
                  {
                    Responses : req.body.Responses
                  }
                }, // replacement, replaces only the field "hi"
                {}, // options
                function(err, object) {
                    if (err){
                        console.warn(err.message);  // returns error if no matching object found
                        respJSON = {message:"addRatingToResponseGreenhornQuestions Failure"};
                    }else{
                        console.log(object);

                        var json1 = req.body.Responses;
                        console.log( 'New rating:' );
                        console.log( json.rating );
                        json1[req.body.countj].Owner.rating = json.rating;
                        
                        respJSON = {message:"addRatingToResponseGreenhornQuestions Success",Data: json1};
                        res.send( respJSON );
                    }
                });

            }
          });
    }
    else
    {
      res.send( {message:"addRatingToResponseGreenhornQuestions Failure"} );
    }

  });           

  }
  catch(e)
  {
    console.log(e);

    res.send( {message:"addRatingToResponseGreenhornQuestions Failure"} );
  }
 
});

app.post('/fetchGreenhornQuestions', function (req, res){

  console.log( '/fetchGreenhornQuestions' );

  console.log( req.body );
  
  var respJSON;

  try
  {
    greenhornquestions.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      
      if( docs.length != 0 )
      {
        console.log( docs );
        var json = docs;

        respJSON = {message:"Fetch Greenhorn Questions Successful",Data: json ,"Type":"Mentor"};
        res.send( respJSON );
        
      }
      else
      {
        respJSON = {message:"Fetch Greenhorn Questions Failure"};
      }
    });
  }
  catch(e)
  {
    console.log(e);

    res.send( {message:"Fetch Greenhorn Questions Failure"} );
  }
 
});

app.post('/fetchGreenhornMyQuestions', function (req, res){

  console.log( '/fetchGreenhornMyQuestions' );

  console.log( req.body );
  
  var respJSON;

  try
  {
    greenhornquestions.find({ "Owner.Email" : req.body.Email }).toArray(function(err, docs) {
      assert.equal(err, null);
      
      if( docs.length != 0 )
      {
        console.log( docs );
        var json = docs;

        respJSON = {message:"Fetch Greenhorn My Questions Successful",Data: json ,"Type":"Greenhorn"};
        res.send( respJSON );
        
      }
      else
      {
        respJSON = {message:"Fetch Greenhorn My Questions Failure"};
      }
    });
  }
  catch(e)
  {
    console.log(e);

    res.send( {message:"Fetch Greenhorn My Questions Failure"} );
  }
 
});

app.post('/postMentorResponseToGreenhornQuestion', function (req, res){

  console.log( '/postMentorResponseToGreenhornQuestion' );

  console.log( req.body );
  
  var respJSON;

  try
  {
    greenhornquestions.findAndModify(
                                  {"_id": ObjectId( req.body._id )}, // query
                                  [['_id','asc']],  // sort order
                                  {$set: 
                                    {
                                      Responses : req.body.Responses
                                    }
                                  }, // replacement, replaces only the field "hi"
                                  {}, // options
                                  function(err, object) {
                                      if (err){
                                          console.warn(err.message);  // returns error if no matching object found
                                          respJSON = {message:"Post Mentor Response Failure"};
                                      }else{
                                          console.log(object);

                                          respJSON = {message:"Post Mentor Response Success"};
                                          res.send( respJSON );
                                      }
                                  });

  }
  catch(e)
  {
    console.log(e);

    res.send( {message:"Post Mentor Response Failure"} );
  }
 
});

app.post('/postQuestion', function (req, res){

  console.log( '/postQuestion' );

  console.log( req.body );
  
  var respJSON;

  try
  {
    switch(req.body.Question.QuestionType)
    {
      case "Subjective":

                        var json = req.body.Question;

                        json.DateUpdated = new Date();

                        subjectives.insert(json , function(err,docs){

                          assert.equal(err, null);
                          
                          if( docs.length != 0 )
                          {
                            console.log( docs );
                            var json = docs;

                            console.log( json );

                            respJSON = {message:"Post Question Successful",Data: json ,"Type":"Mentor"};
                            res.send( respJSON );
                          }
                          else
                          {
                            res.send( {message:"Post Question Failure"} );
                          }

                        });
                        

                        break;
      case "MCQTrue_False":

                        var json = req.body.Question;

                        json.DateUpdated = new Date();

                        mcqs.insert(json , function(err,docs){

                          assert.equal(err, null);
                          
                          if( docs.length != 0 )
                          {
                            console.log( docs );
                            var json = docs;

                            console.log( json );

                            respJSON = {message:"Post Question Successful",Data: json ,"Type":"Mentor"};
                            res.send( respJSON );
                          }
                          else
                          {
                            res.send( {message:"Post Question Failure"} );
                          }

                        });
                        

                        break;
        case "MCQGeneric":

                        var json = req.body.Question;

                        json.DateUpdated = new Date();

                        mcqs.insert(json , function(err,docs){

                          assert.equal(err, null);
                          
                          if( docs.length != 0 )
                          {
                            console.log( docs );
                            var json = docs;

                            console.log( json );

                            respJSON = {message:"Post Question Successful",Data: json ,"Type":"Mentor"};
                            res.send( respJSON );
                          }
                          else
                          {
                            res.send( {message:"Post Question Failure"} );
                          }

                        });
                        

                        break;
    }
    
  }
  catch(e)
  {
    console.log(e);

    res.send( {message:"Post Question Failure"} );
  }
 
});

app.post('/deleteProfilePicture', function (req, res){

  console.log( '/deleteProfilePicture' );

  try{
    console.log(req.body.Email);
  
    //cloudinary.uploader.upload(req.body.file, function(result) 
    {
      //console.log(result)

      console.log( req.body.Type );

      switch( req.body.Type )
      {
        case "Greenhorn" : 

                            greenhorns.find({"Email": req.body.Email}).toArray(function(err, docs) {
                              assert.equal(err, null);
                              
                              if( docs.length != 0 )
                              {
                                console.log( docs );
                                var json = docs[0];

                                if( json.Gender == "Male")
                                {
                                  json.ProfilePicUrl = "images/profilepic_male.jpg";
                                }
                                else
                                {
                                  json.ProfilePicUrl = "images/profilepic_female.jpg";
                                }

                                console.log( json.ProfilePicUrl );

                                greenhorns.findAndModify(
                                  {Email: req.body.Email}, // query
                                  [['_id','asc']],  // sort order
                                  {$set: 
                                    {
                                      ProfilePicUrl : json.ProfilePicUrl
                                    }
                                  }, // replacement, replaces only the field "hi"
                                  {}, // options
                                  function(err, object) {
                                      if (err){
                                          console.warn(err.message);  // returns error if no matching object found
                                          respJSON = {message:"Profile Pic Delete Failure"};
                                      }else{
                                          console.log(object);

                                          respJSON = {message:"Profile Pic Deleted Successfully",Data: json.ProfilePicUrl ,"Type":"Mentor"};
                                          res.send( respJSON );
                                      }
                                  });
                                
                                
                              }
                              else
                              {
                                respJSON = {message:"Profile Pic Delete Failure"};
                              }
                            });


                          break;
        case "Mentor" :

                        mentors.find({"Email": req.body.Email}).toArray(function(err, docs) {
                              assert.equal(err, null);
                              
                              if( docs.length != 0 )
                              {
                                console.log( docs );
                                var json = docs[0];

                                if( json.Gender == "Male")
                                {
                                  json.ProfilePicUrl = "images/profilepic_male.jpg";
                                }
                                else
                                {
                                  json.ProfilePicUrl = "images/profilepic_female.jpg";
                                }

                                console.log( json.ProfilePicUrl );

                                mentors.findAndModify(
                                  {Email: req.body.Email}, // query
                                  [['_id','asc']],  // sort order
                                  {$set: 
                                    {
                                      ProfilePicUrl : json.ProfilePicUrl
                                    }
                                  }, // replacement, replaces only the field "hi"
                                  {}, // options
                                  function(err, object) {
                                      if (err){
                                          console.warn(err.message);  // returns error if no matching object found
                                          respJSON = {message:"Profile Pic Delete Failure"};
                                      }else{
                                          console.log(object);

                                          respJSON = {message:"Profile Pic Deleted Successfully",Data: json.ProfilePicUrl ,"Type":"Mentor"};
                                          res.send( respJSON );
                                      }
                                  });
                                
                                
                              }
                              else
                              {
                                respJSON = {message:"Profile Pic Delete Failure"};
                              }
                            });

                        break;
      }

    }
  }
  catch(e)
  {
    res.send( {message:"Profile Pic Update Failure"} );
  }
  
});

app.post('/uploadProfilePicture', function (req, res){

  console.log( '/uploadProfilePicture' );

  try{
    console.log(req.body.Email);
  
    cloudinary.uploader.upload(req.body.file, function(result) 
    {
      //console.log(result)
      var url = result.secure_url;

      switch( req.body.Type )
      {
        case "Greenhorn" : 

                            greenhorns.find({"Email": req.body.Email}).toArray(function(err, docs) {
                              assert.equal(err, null);
                              
                              if( docs.length != 0 )
                              {
                                console.log( docs );
                                var json = docs[0];

                                json.ProfilePicUrl = url;

                                console.log( json.ProfilePicUrl );

                                greenhorns.findAndModify(
                                  {Email: req.body.Email}, // query
                                  [['_id','asc']],  // sort order
                                  {$set: 
                                    {
                                      ProfilePicUrl : json.ProfilePicUrl
                                    }
                                  }, // replacement, replaces only the field "hi"
                                  {}, // options
                                  function(err, object) {
                                      if (err){
                                          console.warn(err.message);  // returns error if no matching object found
                                          respJSON = {message:"Profile Pic Update Failure"};
                                      }else{
                                          console.log(object);

                                          respJSON = {message:"Profile Pic Updated Successfully",Data: json.ProfilePicUrl ,"Type":"Greenhorn"};
                                          res.send( respJSON );
                                      }
                                  });
                                
                                
                              }
                              else
                              {
                                respJSON = {message:"Profile Pic Update Failure"};
                              }
                            });


                          break;
        case "Mentor" :

                        mentors.find({"Email": req.body.Email}).toArray(function(err, docs) {
                              assert.equal(err, null);
                              
                              if( docs.length != 0 )
                              {
                                console.log( docs );
                                var json = docs[0];

                                json.ProfilePicUrl = url;

                                console.log( json.ProfilePicUrl );

                                mentors.findAndModify(
                                  {Email: req.body.Email}, // query
                                  [['_id','asc']],  // sort order
                                  {$set: 
                                    {
                                      ProfilePicUrl : json.ProfilePicUrl
                                    }
                                  }, // replacement, replaces only the field "hi"
                                  {}, // options
                                  function(err, object) {
                                      if (err){
                                          console.warn(err.message);  // returns error if no matching object found
                                          respJSON = {message:"Profile Pic Update Failure"};
                                      }else{
                                          console.log(object);

                                          respJSON = {message:"Profile Pic Updated Successfully",Data: json.ProfilePicUrl ,"Type":"Mentor"};
                                          res.send( respJSON );
                                      }
                                  });
                                
                                
                              }
                              else
                              {
                                respJSON = {message:"Profile Pic Update Failure"};
                              }
                            });

                        break;
      }

    });
  }
  catch(e)
  {
    res.send( {message:"Profile Pic Update Failure"} );
  }
  
});

app.post('/fetchMediaSpace', function (req, res){

  console.log( '/fetchMediaSpace' );

  try{
    console.log(req.body.Email);

    mediaspaces.find({Email: req.body.Email}).toArray(function(err,docs){

      if( docs.length != 0 )
      {
        respJSON = {message:"Fetch Media Space Success",Data: docs[0] };
        res.send( respJSON );
      }
      else
      {
        respJSON = {message:"Fetch Media Space Failure" };
        res.send( respJSON );
      }

    });
  
    
  }
  catch(e)
  {
    console.log(e);
    respJSON = {message:"Fetch Media Space Failure" };
    res.send( respJSON );
  }
  
});

app.post('/uploadMediaSpaceImage', function (req, res){

  console.log( '/uploadMediaSpaceImage' );

  try{
    console.log(req.body.Email);
  
    var index = req.body.id;

    console.log( "Index :" + index );

    cloudinary.uploader.upload(req.body.file, function(result) 
    {
      //console.log(result)
      var url = result.secure_url;

      mediaspaces.find({Email: req.body.Email}).toArray(function(err,docs){

        assert.equal(err, null);
        
        // console.log('docs:');
         console.log(docs );

        if( docs.length != 0 )
        {
          //console.log( docs );
          var json = docs[0];

          //console.log( json );

          json.Media.push(url);

          mediaspaces.findAndModify(
            {Email: req.body.Email}, // query
            [['_id','asc']],  // sort order
            {$set: 
              {
                Media : json.Media
              }
            }, // replacement, replaces only the field "hi"
            {}, // options
            function(err, object) {
                if (err){
                    console.warn(err.message);  // returns error if no matching object found
                    var json = {"index" : index};

                    respJSON = {message:"Media Space Image Upload Failure",Data: json };
                    res.send( respJSON );
                }else{
                    //console.log(object);

                    var json = {"url" : url, "index" : index};

                    respJSON = {message:"Media Space Image Upload Success",Data: json };
                    res.send( respJSON );
                }
            });

        }
        else
        {
          var json = {"Email": req.body.Email , "Media": [url]};

          mediaspaces.insert(json , function( err , docs){

            assert.equal(err, null);

            var json = {"url" : url, "index" : index};

            respJSON = {message:"Media Space Image Upload Success",Data: json };
            res.send( respJSON );

          });
          
        }

      });

    });
  }
  catch(e)
  {
    var json = {"index" : index};
    res.send( {message:"Media Space Image Upload Failure" ,Data: json} );
  }
  
});

app.post('/deleteFromMediaSpace', function (req, res){

  console.log( '/deleteFromMediaSpace' );

  try{
    console.log(req.body.Email);
  
    mediaspaces.findAndModify(
            {Email: req.body.Email}, // query
            [['_id','asc']],  // sort order
            {$set: 
              {
                Media : req.body.mediaspace
              }
            }, // replacement, replaces only the field "hi"
            {}, // options
            function(err, object) {
                if (err){
                    console.warn(err.message);  // returns error if no matching object found
                    respJSON = {message:"Delete Media Space Failure"};
                    res.send( respJSON );
                }else{
                    //console.log(object);

                    respJSON = {message:"Delete Media Space Success" };
                    res.send( respJSON );
                }
            });

    
  }
  catch(e)
  {
    respJSON = {message:"Delete Media Space Failure"};
    res.send( respJSON );
  }
  
});

app.post('/updatePassword', function (req, res){

  console.log( '/updatePassword' );

  console.log( req.body );
  
  var respJSON;

  try
  {
    switch( req.body.Type )
    {
      case "Greenhorn" : 

                          greenhorns.find({"Email": req.body.Email}).toArray(function(err, docs) {
                            assert.equal(err, null);
                            
                            if( docs.length != 0 )
                            {
                              console.log( docs );
                              var json = docs[0];

                              if( json.Password != req.body.CurrentPassword )
                              {
                                respJSON = {message:"Current Password Incorrect"};
                                res.send( respJSON );
                              }
                              else
                              {
                                //
                                greenhorns.findAndModify(
                                {Email: req.body.Email}, // query
                                [['_id','asc']],  // sort order
                                {$set: 
                                  {
                                    Password : req.body.NewPassword
                                  }
                                }, // replacement, replaces only the field "hi"
                                {}, // options
                                function(err, object) {
                                    if (err){
                                        console.warn(err.message);  // returns error if no matching object found
                                        respJSON = {message:"Password Change Failure"};
                                        res.send( respJSON );
                                    }else{
                                        respJSON = {message:"Password Changed Successfully"};
                                        res.send( respJSON );
                                    }
                                });
                              
                                //  
                              }
                              
                              
                              
                            }
                            else
                            {
                              respJSON = {message:"Password Change Failure"};
                            }
                          });


                        break;
      case "Mentor" :


                          mentors.find({"Email": req.body.Email}).toArray(function(err, docs) {
                            assert.equal(err, null);
                            
                            if( docs.length != 0 )
                            {
                              console.log( docs );
                              var json = docs[0];

                              if( json.Password != req.body.CurrentPassword )
                              {
                                respJSON = {message:"Current Password Incorrect"};
                                res.send( respJSON );
                              }
                              else
                              {
                                //
                                mentors.findAndModify(
                                {Email: req.body.Email}, // query
                                [['_id','asc']],  // sort order
                                {$set: 
                                  {
                                    Password : req.body.NewPassword
                                  }
                                }, // replacement, replaces only the field "hi"
                                {}, // options
                                function(err, object) {
                                    if (err){
                                        console.warn(err.message);  // returns error if no matching object found
                                        respJSON = {message:"Password Change Failure"};
                                        res.send( respJSON );
                                    }else{
                                        respJSON = {message:"Password Changed Successfully"};
                                        res.send( respJSON );
                                    }
                                });
                              
                                //  
                              }
                              
                              
                              
                            }
                            else
                            {
                              respJSON = {message:"Password Change Failure"};
                            }
                          });

                      break;
    }

    
  }
  catch(e)
  {
    console.log(e);

    res.send( {message:"Password Change Failure"} );
  }
 
});

app.post('/updateProfile', function (req, res){

  console.log( '/updateProfile' );

  console.log( req.body );
  
  var respJSON;

  try
  {
    switch( req.body.Type )
    {
      case "Greenhorn" : 

                          greenhorns.find({"Email": req.body.Email}).toArray(function(err, docs) {
                            assert.equal(err, null);
                            
                            if( docs.length != 0 )
                            {
                              console.log( docs );
                              var json = docs[0];

                              json.Username = req.body.Username;

                              var date = new Date( req.body.Date );

                              console.log( date );

                              var day = "" + date.getDate(); //Date of the month: 2 in our example
                              day = (day.length == 1)?"0" + day : day;
                              var month = "" + date.getMonth() + 1; //Month of the Year: 0-based index, so 1 in our example
                              month = (month.length == 1)?"0" + month : month;
                              var year = "" + date.getFullYear() //Year: 2013

                              date = day + '/' + month + '/' + year;

                              console.log(date);

                              json.Date = date;
                              json.AboutYourself = req.body.AboutYourself;
                              json.Location = req.body.Location;
                              
                              console.log( json.ProfilePicUrl );

                              if( json.Gender != req.body.Gender)
                              {
                                console.log('Gender Diff');
                                if( json.ProfilePicUrl == "images/profilepic_male.jpg" || json.ProfilePicUrl == "images/profilepic_female.jpg" )
                                {
                                  if( req.body.Gender == "Male" )
                                    json.ProfilePicUrl = "images/profilepic_male.jpg";
                                  else
                                    json.ProfilePicUrl = "images/profilepic_female.jpg"
                                }
                              }

                              console.log( json.ProfilePicUrl );

                              json.Gender = req.body.Gender;
                              json.Phone = req.body.Phone;

                              greenhorns.findAndModify(
                                {Email: req.body.Email}, // query
                                [['_id','asc']],  // sort order
                                {$set: 
                                  {
                                    Username : req.body.Username,
                                    Date : date,
                                    AboutYourself : req.body.AboutYourself,
                                    Location : req.body.Location,
                                    Gender : req.body.Gender,
                                    Phone : req.body.Phone,
                                    ProfilePicUrl : json.ProfilePicUrl
                                  }
                                }, // replacement, replaces only the field "hi"
                                {}, // options
                                function(err, object) {
                                    if (err){
                                        console.warn(err.message);  // returns error if no matching object found
                                        respJSON = {message:"Profile Update Failure"};
                                    }else{
                                        console.log(object);

                                        delete json.Password;
                                        delete json._id;

                                        console.log( json );

                                        respJSON = {message:"Profile Update Successfully",Data: json ,"Type":"Greenhorn"};
                                        res.send( respJSON );
                                    }
                                });
                              
                              
                            }
                            else
                            {
                              respJSON = {message:"Profile Update Failure"};
                            }
                          });


                        break;
      case "Mentor" :

                            mentors.find({"Email": req.body.Email}).toArray(function(err, docs) {
                            assert.equal(err, null);
                            
                            if( docs.length != 0 )
                            {
                              console.log( docs );
                              var json = docs[0];

                              json.Username = req.body.Username;

                              var date = new Date( req.body.Date );

                              console.log( date );

                              var day = "" + date.getDate(); //Date of the month: 2 in our example
                              day = (day.length == 1)?"0" + day : day;
                              var month = "" + date.getMonth() + 1; //Month of the Year: 0-based index, so 1 in our example
                              month = (month.length == 1)?"0" + month : month;
                              var year = "" + date.getFullYear() //Year: 2013

                              date = day + '/' + month + '/' + year;

                              console.log(date);

                              json.Date = date;
                              json.Qualifications = req.body.Qualifications;
                              json.Location = req.body.Location;
                              
                              console.log( json.ProfilePicUrl );

                              if( json.Gender != req.body.Gender)
                              {
                                console.log('Gender Diff');
                                if( json.ProfilePicUrl == "images/profilepic_male.jpg" || json.ProfilePicUrl == "images/profilepic_female.jpg" )
                                {
                                  if( req.body.Gender == "Male" )
                                    json.ProfilePicUrl = "images/profilepic_male.jpg";
                                  else
                                    json.ProfilePicUrl = "images/profilepic_female.jpg"
                                }
                              }

                              console.log( json.ProfilePicUrl );

                              json.Gender = req.body.Gender;
                              json.Phone = req.body.Phone;

                              mentors.findAndModify(
                                {Email: req.body.Email}, // query
                                [['_id','asc']],  // sort order
                                {$set: 
                                  {
                                    Username : req.body.Username,
                                    Date : date,
                                    Qualifications : req.body.Qualifications,
                                    Location : req.body.Location,
                                    Gender : req.body.Gender,
                                    Phone : req.body.Phone,
                                    ProfilePicUrl : json.ProfilePicUrl
                                  }
                                }, // replacement, replaces only the field "hi"
                                {}, // options
                                function(err, object) {
                                    if (err){
                                        console.warn(err.message);  // returns error if no matching object found
                                        respJSON = {message:"Profile Update Failure"};
                                    }else{
                                        console.log(object);

                                        delete json.Password;
                                        delete json._id;

                                        console.log( json );

                                        respJSON = {message:"Profile Update Successfully",Data: json ,"Type":"Greenhorn"};
                                        res.send( respJSON );
                                    }
                                });
                              
                              
                            }
                            else
                            {
                              respJSON = {message:"Profile Update Failure"};
                            }
                          });

                      break;
    }

    
  }
  catch(e)
  {
    console.log(e);

    res.send( {message:"Something Went Wrong"} );
  }
 
});

var port = process.env.PORT || 8874;

app.listen(port, function () {
  console.log('Example app listening on port '+port+'!')
})