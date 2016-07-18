//require express
var express = require('express');
var app = express();
//require pug
var pug = require('pug');
//set view engine to serve middleware
app.set('view engine', 'pug');
//set where to look for templates
app.set('views', __dirname + '/templates');
//app.get function to render template

// set up server on Port 3000
app.listen(3000, function() {
	console.log("The frontend server is running on port 3000!");
});
//set up Twitter JS Client
var error = function (err, response, body) {
        console.log('ERROR [%s]', err);
   };
 //on success log success to the console
var success = function (data) {
       console.log('Data [%s]', data);
         };
// set folder structure for middleware to be able to call stylesheets
app.use('/static', express.static(__dirname + '/public'));
// require Twitter Node Client
var Twitter = require('twitter');
//configuration object for the Twitter App REMEMBER TO DELETE BEFORE POSTING TO GIT!
var config = {
    "consumer_key": "",
    "consumer_secret": "",
    "access_token_key": "",
    "access_token_secret": ""
	};
// set up instance of twitter client variable
var client = new Twitter(config);
// get user data
client.get('statuses/user_timeline', {screen_name: 'Engzig', count: '5'}, function(error, tweets, response){
   if (!error) {
		// create array variables in which to store the relevant Twitter data from the response
    var tweetContent = [];
    var noOfRetweets = [];
    var noOfLikes = [];
    var dateTweeted = [];
		// for each tweet push the relevant data into the arrays
    for (var i = 0; i < tweets.length; i++) {
    tweetContent.push(tweets[i].text);
    noOfRetweets.push(tweets[i].retweet_count);
    noOfLikes.push(tweets[i].favorite_count);
    dateTweeted.push(tweets[i].created_at);
   }
	 // get friends list
    client.get('friends/list', {screen_name: 'Engzig', count: '5'}, function(error, friends, response) {
      if (!error) {
				// create array variables in which to store the relevant Twitter data from the response
        var profileImageFriends = [];
        var realName =[];
        var screenNameFriends =[];
        //var profileSummary =[];
				// for each friend push the relevant data into the arrays
        for (var i = 0; i < friends.users.length; i++) {
          profileImageFriends.push(friends.users[i].profile_image_url);
          realName.push(friends.users[i].name);
          screenNameFriends.push(friends.users[i].screen_name);
          //profileSummary.push(friends.users[i].description);
        }
				// get direct messages
        client.get('direct_messages', function(error, messages, response) {
          if (!error) {
						// create array variables in which to store the relevant Twitter data from the response
            var messageBody =[];
            var senderScreenName =[];
            var dateTimeSent =[];
						var profileImageMessage = [];
						// for each message push the relevant data into the arrays
            for (var i = 0; i < 5; i++) {
              messageBody.push(messages[i].text);
              senderScreenName.push(messages[i].sender_screen_name);
              dateTimeSent.push(messages[i].created_at);
							profileImageMessage.push(messages[i].sender.profile_image_url);
							console.log(profileImageMessage);
            }
						// get user profile attributes
            client.get('users/show', {screen_name: 'Engzig'}, function(error, profileAttrs, response) {
              if (!error) {
								//assign relevant data from the response to variables
                var profileImage = profileAttrs.profile_image_url;
                var screenName = profileAttrs.screen_name;
                var banner = profileAttrs.profile_banner_url;
								// created these variables for assignment to Pug in more clarity
                var profileImageFriends1 = profileImageFriends[0];
                var profileImageFriends2 = profileImageFriends[1];
                var profileImageFriends3 = profileImageFriends[2];
                var profileImageFriends4 = profileImageFriends[3];
                var profileImageFriends5 = profileImageFriends[4];
								//render template with all the necessary variables
                app.get('/', function (req, res) {
                  res.render('index', {
                    profileImage: profileImage,
                    screenName: screenName,
                    tweetContent: tweetContent,
                    noOfRetweets: noOfRetweets,
                    noOfLikes: noOfLikes,
                    dateTweeted: dateTweeted,
                    banner: banner,
                    profileImageFriends1: profileImageFriends1,
                    profileImageFriends2: profileImageFriends2,
                    profileImageFriends3: profileImageFriends3,
                    profileImageFriends4: profileImageFriends4,
                    profileImageFriends5: profileImageFriends5,
                    realName: realName,
                    screenNameFriends: screenNameFriends,
                    messageBody: messageBody,
                    senderScreenName: senderScreenName,
                    dateTimeSent: dateTimeSent,
										profileImageMessage: profileImageMessage
                    });
                  });
                }
              });
            }
          });
        }
      });
    }
});
