var casper = require('casper').create({
  viewportSize: {
    width: 800,
    height: 600
  }
});
var x = require('casper').selectXPath; //for easy xpath matching

//Global variables required by the test
var username="teeeya";
var password="monk3y";
var url = "http://www.last.fm";


//Action: Load the lastFM webpage. 
//Test: various components have loaded on to the page
//Purpose: This will test that the lasfm page will have loaded correctly
casper.test.begin('Load LastFM webpage', 3, function suite(test) {
    casper.start(url, function() {
        test.assertTitle("Last.fm - Listen to free music with internet radio and the largest music catalogue online", "LastFM homepage title is the one expected", "Incorrect Title");
        test.assertExists('.login');
        test.assertExists('.primary-nav');
    }).run(function() {
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
            'password':    password,
        }, true);
    })
   casper.then(function(){  
    test.assertUrlMatch("/home","Successfully on home page");
   }).run(function() {
        test.done();
        casper.exit();
    });
});




