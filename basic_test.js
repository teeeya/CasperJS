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
var searchQuery = "The Weeknd";
var searchResult = "The+Weeknd";


//Action: Load the lastFM webpage. 
//Test: various components have loaded on to the page
//Purpose: This will test that the lasfm page will have loaded correctly
casper.test.begin('Load LastFM webpage', 3, function suite(test) {
    
    casper.start(url, function() {
        this.captureSelector('start.png', 'body');//take a screenshot of the header
        this.test.assertTitle("Last.fm - Listen to free music with internet radio and the largest music catalogue online", "LastFM homepage title is the one expected", "Incorrect Title");
        this.test.assertExists('.login');
        this.test.assertExists('.primary-nav');
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
casper.test.begin('Search on LastFM', 2, function suite(test) {
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
        this.clickLabel('The Weeknd','a');
      });
      casper.then(function(){
         this.captureSelector('result.png', 'body');//take a screenshot of the header
          test.assertUrlMatch("music/"+searchResult, "Successfully on Artist page");    
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
        this.clickLabel('The Weeknd','a');
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








;