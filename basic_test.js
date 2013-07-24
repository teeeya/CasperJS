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

casper.test.begin('Login to LastFM', 2, function suite(test) {
    casper.start(url);
    casper.then(function() {
        this.click('.login');
    });
   casper.then(function(){
      test.assertUrlMatch("/login", "Successfully on login page");
   });
   casper.then(function(){
      this.fill('form[action="/login"]', {
          'username':    username,
          'password':    password
      }, true);
    });
   casper.then(function(){  
        this.captureSelector('loggedin.png', 'body');//take a screenshot of the header
      test.assertUrlMatch("/home","Successfully on home page");
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
        test.assertExists('#topResult', 'Found the top result returned in search');
      });
      casper.then(function(){
        this.clickLabel(searchQuery,'a');
      });
      casper.then(function(){
        this.captureSelector('result.png', 'body');//take a screenshot of the header
        test.assertUrlMatch("music/"+searchResult, "Successfully on Artist page");    
        test.assertExists(".scrobbles");
        //test the value of scrobbles is bigger than 0
        var str  = this.fetchText('li.scrobbles b');
        str = toNumber(regularExpression(str));
        test.assert(str > 0, "The number of scrobbles is bigger than 0 at " + str);
        //test that value of listeners is bigger than 0
        var str1  = this.fetchText('li.listeners b');
        str1 = toNumber(regularExpression(str1));
        test.assert(str > 0, "The number of plays is bigger than 0 at " + str1);

        test.assertExists(".tags", "Tags for the artist are present");
        test.assertExists(".ecommerce-actions", "User buy options are on the artist page");
        test.assertExists(".share-wrapper", "User share options are on the artist page");
        test.assertExists(".artist-similar-sidebar", "Similar artists to "+ searchQuery + " is on the artist page");
        test.assertExists(".artist-top-tracks", "Artist top tracks is on artist page");
        test.assertExists(".artist-top-albums", "Artist top album is on artist page");
        test.assertExists(".artist-events", 'Artist events is on the artist page');
        test.assertExists(".artist-listening-trend", "Listening trend is visible on the page");
        test.assertExists("#friends-who-listen-to", "Friends of the user who also listen to the artist is listed");
        test.assertExists(".artist-groups", "Artist groups on artist page");
        test.assertExists(".artist-listeners", "Artist listeners on artist page");
      });
     casper.run(function() {
        test.done();
      });
});


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
        test.assertUrlMatch("/listen/artist/"+searchResult+"/similarartists", "Correct radio loading");
        test.assertExists('#radioPlayer', "Radio Player loaded");
        test.assertExists('#radioControls', "Radio controls loaded");
        test.assertExists('#trackProgress', "Track in progresss");
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
    test.assertUrlMatch("/user/"+username,"Profile has loaded");
    test.assertTitle('tiyatest’s Music Profile – Users at Last.fm');
    test.assertExists('.userImage');
    test.assertExists('.userActivity');
    test.assertExists('.module-body');
    test.assertExists('.minifeedSmall');
    test.assertExists('.module');
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
    test.assertUrlMatch("home/recs", "Recommendations page has loaded");
    test.assertEval(function() {
        return __utils__.findOne('.heading').textContent === 'Music Recommended by Last.fm';
    });
    test.assertExists('#content');
    test.assertExists('.tertiaryNavigation');
    test.assertTitle('Music Recommended by Last.fm – Last.fm');
    test.assertExists('.similarArtists');
    test.assertExists('#artistRecs');
    test.assertExists('.buttons');
    test.assertEval(function() {
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
    test.assertUrlMatch('user/'+username+'/library', "User library has loaded");
    test.assertTitle('tiyatest’s Library – Users at Last.fm');
    test.assertExists('#libraryNavigation');
    test.assertExists('.top-crumb');
    this.captureSelector('landingtab.png', 'body');//take a screenshot of the header
  });
  //Loved tracks
  casper.then(function(){
    this.waitUntilVisible("#libraryNavigation");
    this.clickLabel('Loved tracks','span');
  });
  casper.then(function(){
    test.assertUrlMatch("user/"+username+"/library/loved", "Successfully loaded loved tracks");
    test.assertExists(".lovedtracks");
  })
  casper.then(function(){
    this.clickLabel("Playlists", "span");
  });
  casper.then(function(){
    test.assertUrlMatch("user/"+username+"/library/playlists", "Successfully loaded the playlists page");
    test.assertExists("#content");
   });
  casper.then(function(){
    this.clickLabel("Tags", "span");
  });
  casper.then(function(){
    test.assertExists(".cloud");
    test.assertDoesntExist("#libraryList");
  });
casper.then(function(){
  this.click("#librarySubNav a");
})
casper.then(function(){
  test.assertExists("#libraryList");
  test.assertDoesntExist(".cloud");
});
  casper.run(function() {
    test.done();
  });
});








//Action: Logout of lastFM web page
//Test: Check the home page has loaded
//Purpose:This will test that logging out of lastfm website has not broken.
casper.test.begin('Logout of LastFM', 3, function suite(test) {
    casper.start(url);
       casper.then(function(){
           this.waitUntilVisible('#logoutLink');
           this.clickLabel('Logout', 'a');
       });
       casper.then(function(){  
            this.captureSelector('loggedoutheader.png', 'body');//take a screenshot of the header
            this.test.assertTitle("Last.fm - Listen to free music with internet radio and the largest music catalogue online", "LastFM homepage title is the one expected", "Incorrect Title");
            this.test.assertExists('.login');
            this.test.assertExists('.primary-nav');
       });

   casper.run(function() {
      this.test.renderResults(true, 0, this.cli.get('save') || false); //this should be added to the very last test
      test.done();
      casper.exit();//this should be added to the very last test
    });
});
