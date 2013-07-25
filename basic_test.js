var casper = require('casper').create({
  viewportSize: {
  width: 800,
  height: 600
  }
});
casper.options.waitTimeout = 20000;
var x = require('casper').selectXPath; //for easy xpath matching

//Global variables required by the test
var username="tiyatest";
var password="tiyatest";
var url = "http://www.last.fm";
var searchQuery = "M83";
var searchResult = "M83"; //If there is a space use + between words


//Action: Load the lastFM webpage. 
//Test: various components have loaded on to the page
//Purpose: This will test that the lasfm page will have loaded correctly
casper.test.begin('Load LastFM webpage (anonymous user)', 14, function suite(test) {
    
    casper.start(url, function() {
        this.captureSelector('start.png', 'body');//take a screenshot of the header
        this.waitUntilVisible('.content');
        this.test.assertTitle("Last.fm - Listen to free music with internet radio and the largest music catalogue online", "LastFM homepage title is the one expected on annonymous homepage");
        this.test.assertExists('.login', "Login link is present");
        this.test.assertExists('.primary-nav', "Top navigation present");
        this.test.assertExists('.cover-image', "Cover images are present");
        this.test.assertExists('.join', 'Join link is present');
        this.test.assertExists('.lastfm-logo', "Lastfm logo is present");
        this.test.assertExists('.anon-search-container', "Music search in header");
        this.test.assertExists('.search-box', 'search in the middle of the page');
        this.test.assertTextExists('Trending artists this week', "Trending artists this week");
        this.test.assertTextExists('Top tracks this week', 'Top tracks this week is present');
        this.test.assertTextExists('Popular events near you', 'Popular events near you is present');
        this.test.assertExists('.anon-button', 'Start your free Last.fm profile link is present');
        this.test.assertExists('.stats-container', 'Stats container found');
        this.test.assertTextExists('.r','Hardware info is present');
    });
    casper.run(function() {
        test.done();
    });

});

//Action: Join lastfm page 
//Test: Check that the join page is loaded from the anonymous homepage
//Purpose: This will test that users wanting to create a profile will be able to do so

casper.test.begin('Load the new user join form', 10, function suite(test){
  casper.start(url, function(){
    this.click('.join');
  });
  casper.then(function(){
    this.test.assertUrlMatch('/join', 'Join page successfully loaded');
    this.test.assertExists('.facebookBtn','Optional facebook login button');
    this.test.assertExists('#username', 'Username text field in the new joiner form');
    this.test.assertExists('#email','Email text field is in the new joiner form');
    this.test.assertExists('#password', 'Password text field is in the new joiner form');
    this.test.assertExists('#recaptcha_response_field', 'Security captcha is on the new joiner form');
    this.test.assertExists('#terms', 'User option to accept terms and conditions is found');
    this.test.assertExists('.submitBtn', 'Submit button is present');
    this.test.assertExists('#signIn', "Users with existing profiles can login from new joiner form");
    this.test.assertTitle('Join Last.fm – Last.fm');
  });
   
    casper.run(function() {
        test.done();
    });
});






//Action: Login to lastFM web page
//Test: Check the home page has loaded
//Purpose:This will test that logging into lastfm website has not broken.

casper.test.begin('Login to LastFM - Homepage (user logged in)',17, function suite(test) {
    casper.start(url);
    casper.then(function() {
        this.click('.login');
    });
   casper.then(function(){
      this.test.assertUrlMatch("/login", "Successfully on login page");
      this.test.assertExists('#username', 'Username is present in login form');
      this.test.assertExists('#password', 'Password is present in the login form');
      this.test.assertExists('.logintable input[type="submit"]','Submit button is present');
      this.test.assertTextExists('Forgot your username or password?', 'Forgot username/password option is found');
      this.test.assertExists('#signup', 'Users can create a new profile from login page');
      this.test.assertExists('#siteSearchBox', 'Search box is present in the header');
      this.test.assertExists('#headerPromo', 'Header promo is present');
      this.test.assertExists('#primaryNav', 'Header nav is present');

   });
   casper.then(function(){
      this.fill('form[action="/login"]', {
          'username':    username,
          'password':    password
      }, true);
    });
   casper.then(function(){  
      this.captureSelector('loggedin.png', 'body');//take a screenshot of the header
      this.test.assertUrlMatch("/home","Successfully on home page");
      this.test.assertTextExists('Hi '+username);
      this.test.assertTitle('Home – Last.fm');
      this.test.assertTextExists('Your Library', 'User library is present');
      this.test.assertExists('.stations', 'Link to recommended radio is found');
      this.test.assertTextExists('Your Recommendations', 'User recommendations are present');
      this.test.assertTextExists('People You May Know', 'People suggestions found');
      this.test.assertTextExists('Friends', 'Users friends is present');
   });
   casper.run(function() {    
      test.done();
    });
});




//Action: Search for an artist
//Test: Check the artist page has loaded
//Purpose:This will test that searching on the lastfm website has not broken
casper.test.begin('Search on LastFM', 16, function suite(test) {
    casper.start(url);
      casper.then(function(){
        this.sendKeys("#siteSearchBox", searchQuery);
      });
      casper.then(function(){ 
        this.waitUntilVisible('#siteSearchSubmit');
        this.click('#siteSearchSubmit');     
      });
      casper.then(function(){ 
        this.captureSelector('search.png', 'body');//take a screenshot of the header
        this.test.assertExists('#topResult', 'Found the top result returned in search');
      });
      casper.then(function(){
        this.clickLabel(searchQuery,'a');
      });
      casper.then(function(){
        this.captureSelector('result.png', 'body');//take a screenshot of the header
        this.test.assertUrlMatch("music/"+searchResult, "Successfully on Artist page");    
        this.test.assertExists(".scrobbles");
        //test the value of scrobbles is bigger than 0
        var str  = this.fetchText('li.scrobbles b');
        str = toNumber(regularExpression(str));
        this.test.assert(str > 0, "The number of scrobbles is bigger than 0 at " + str);
        //test that value of listeners is bigger than 0
        var str1  = this.fetchText('li.listeners b');
        str1 = toNumber(regularExpression(str1));
        this.test.assert(str > 0, "The number of plays is bigger than 0 at " + str1);

        this.test.assertExists(".tags", "Tags for the artist are present");
        this.test.assertExists(".ecommerce-actions", "User buy options are on the artist page");
        this.test.assertExists(".share-wrapper", "User share options are on the artist page");
        this.test.assertExists(".artist-similar-sidebar", "Similar artists to "+ searchQuery + " is on the artist page");
        this.test.assertExists(".artist-top-tracks", "Artist top tracks is on artist page");
        this.test.assertExists(".artist-top-albums", "Artist top album is on artist page");
        this.test.assertExists(".artist-events", 'Artist events is on the artist page');
        this.test.assertExists(".artist-listening-trend", "Listening trend is visible on the page");
        this.test.assertExists("#friends-who-listen-to", "Friends of the user who also listen to the artist is listed");
        this.test.assertExists(".artist-groups", "Artist groups on artist page");
        this.test.assertExists(".artist-listeners", "Artist listeners on artist page");
      });
     casper.run(function() {
        test.done();
      });
});




//Action: Play Radio
//Test: Check the radio plays
//Purpose:This will test that searching on the lastfm website has not broken.
casper.test.begin('Play radio on LastFM', 4, function suite(test) {
      casper.start(url);
      casper.then(function(){
        this.sendKeys("#siteSearchBox", searchQuery);
      });
       casper.then(function(){ 
        this.waitUntilVisible('#siteSearchSubmit');
        this.click('#siteSearchSubmit');     
      });
      casper.then(function(){
        this.clickLabel(searchQuery,'a');
      });
      casper.then(function(){
        this.captureSelector('one.png', 'body');//take a screenshot of the header
        this.clickLabel('Play radio','a');
      });
      casper.then(function(){
        this.waitUntilVisible('.radiocontrol');  
      });
      casper.then(function(){     
        this.test.assertUrlMatch("/listen/artist/"+searchResult+"/similarartists", "Correct radio loading");
        this.test.assertExists('#radioPlayer', "Radio Player loaded");
        this.test.assertExists('#radioControls', "Radio controls loaded");
        this.test.assertExists('#trackProgress', "Track in progresss");
        this.captureSelector('end.png', 'body');//take a screenshot of the header
      });
     casper.run(function() {
        test.done();
      });
});

//Action: View Profile
//Test: Check the user can see their profile
//PurposeL This will test that clicking on "Profile" will return the users profile
casper.test.begin('View Profile',7,function suite(test){
  casper.start(url);
  casper.then(function(){
    this.clickLabel('Profile','a'); 
  });
  casper.then(function(){
    this.test.assertUrlMatch("/user/"+username,"Profile has loaded");
    this.test.assertTitle('tiyatest’s Music Profile – Users at Last.fm');
    this.test.assertExists('.userImage', 'User image is on the profile');
    this.test.assertExists('.userActivity', 'User activity is on the profile');
    this.test.assertExists('.libraryItems', 'User library is on the profile');
    this.test.assertExists('.minifeedSmall', 'User feed is on the profile');
    this.test.assertExists('.module','Users friends are on the profile');
    this.captureSelector('shout.png', 'body');//take a screenshot of the header

  });
  casper.run(function() {
    test.done();
  });
});



//Action: View Recommendations
//Test: Check that users can see their recommendations
//Purpose: Recommendations should be returned based on the users library
casper.test.begin('View Recommendations',9,function suite(test){
  casper.start(url);
  casper.then(function(){
    this.clickLabel("Recommendations", 'a');
  });
  casper.then(function(){
    this.test.assertUrlMatch("home/recs", "Recommendations page has loaded");
    this.test.assertEval(function() {
        return __utils__.findOne('.heading').textContent === 'Music Recommended by Last.fm';
    });
    this.test.assertExists('#content');
    this.test.assertExists('.tertiaryNavigation');
    this.test.assertTitle('Music Recommended by Last.fm – Last.fm');
    this.test.assertExists('.similarArtists');
    this.test.assertExists('#artistRecs');
    this.test.assertExists('.buttons');
    this.test.assertEval(function() {
        return __utils__.findOne('a#button1').textContent === 'Add to Your Library';
    });
  });
  casper.run(function() {
    test.done();
  });

});

//Action: View Library
//Test: Check that users can see their own library
//Purpose: Users should be able to go directly to their library from their home page
casper.test.begin('View Library', 12, function suite(test){
  casper.start(url);
  casper.then(function(){
    this.clickLabel("Library", 'a');
  });
  //Landing tab - Music
  casper.then(function(){
    this.test.assertUrlMatch('user/'+username+'/library', "User library has loaded");
    this.test.assertTitle('tiyatest’s Library – Users at Last.fm');
    this.test.assertExists('#libraryNavigation');
    this.test.assertExists('.top-crumb');
    this.captureSelector('landingtab.png', 'body');//take a screenshot of the header
  });
  //Loved tracks
  casper.then(function(){
    this.waitUntilVisible("#libraryNavigation");
    this.clickLabel('Loved tracks','span');
  });
  casper.then(function(){
    this.test.assertUrlMatch("user/"+username+"/library/loved", "Successfully loaded loved tracks");
    this.test.assertExists(".lovedtracks");
  })
  casper.then(function(){
    this.clickLabel("Playlists", "span");
  });
  casper.then(function(){
    this.test.assertUrlMatch("user/"+username+"/library/playlists", "Successfully loaded the playlists page");
    this.test.assertExists("#content");
   });
  casper.then(function(){
    this.clickLabel("Tags", "span");
  });
  casper.then(function(){
    this.test.assertExists(".cloud");
    this.test.assertDoesntExist("#libraryList");
  });
casper.then(function(){
  this.click("#librarySubNav a");
})
casper.then(function(){
  this.test.assertExists("#libraryList");
  this.test.assertDoesntExist(".cloud");
});
  casper.run(function() {
    test.done();
  });
});


//Action: View events
//Test: Check users can see their events, friends events and any events they have added
//Purpose: Users should check that they can see events

casper.test.begin('View Events', 4, function suite(test){
  casper.start(url);

  casper.then(function(){
   this.click('.visible-menu li a[href="/user/'+username+'/events"]');
  });
  casper.then(function(){
     this.captureSelector('events.png', '#content');//take a screenshot of the heade
    this.test.assertExists('.tertiaryNavigation', 'Events menu found on the page');
    this.test.assertTitle(username+'’s Events – Users at Last.fm', 'Title of the page is correct');
    this.test.assertUrlMatch('user/'+username+'/events', 'Events page successfully loaded');
    this.test.assertExists('.actions-bar', "Calendar options have been loaded");
   });
  casper.run(function() {
    test.done();
  });

});







//Action: Logout of lastFM web page
//Test: Check the home page has loaded
//Purpose:This will test that logging out of lastfm website has not broken.
casper.test.begin('Logout of LastFM', 14, function suite(test) {
    casper.start(url);
       casper.then(function(){
           this.waitUntilVisible('#logoutLink');
           this.clickLabel('Logout', 'a');
       });
       casper.then(function(){  
        //Logging out should return to anonymous home page
        this.waitUntilVisible('.content');
        this.test.assertTitle("Last.fm - Listen to free music with internet radio and the largest music catalogue online", "LastFM homepage title is the one expected on annonymous homepage");
        this.test.assertExists('.login', "Login link is present");
        this.test.assertExists('.primary-nav', "Top navigation present");
        this.test.assertExists('.cover-image', "Cover images are present");
        this.test.assertExists('.join', 'Join link is present');
        this.test.assertExists('.lastfm-logo', "Lastfm logo is present");
        this.test.assertExists('.anon-search-container', "Music search in header");
        this.test.assertExists('.search-box', 'search in the middle of the page');
        this.test.assertTextExists('Trending artists this week', "Trending artists this week");
        this.test.assertTextExists('Top tracks this week', 'Top tracks this week is present');
        this.test.assertTextExists('Popular events near you', 'Popular events near you is present');
        this.test.assertExists('.anon-button', 'Start your free Last.fm profile link is present');
        this.test.assertExists('.stats-container', 'Stats container found');
        this.test.assertTextExists('.r','Hardware info is present');
       });

   casper.run(function() {
      this.test.renderResults(true, 0, this.cli.get('save') || false); //this should be added to the very last test
      test.done();
      casper.exit();//this should be added to the very last test
    });
});




//HELPER METHODS


function regularExpression(stringValue){
    var regex = /,/g; 
    var input =stringValue; 
    if(regex.test(input)) {
      var matches = input.match(regex);
      for(var match in matches) {
        input = input.replace(",", "");
      } 
      return input;
    } else {
      return stringValue;
    }
}

function toNumber(stringValue){
  return parseInt(stringValue);

}
