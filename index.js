var exports = module.exports = {
  init: function() {
    module_this = this;
    module_this.requires = {};
    module_this.requires.request = require('request');
    module_this.requires.cookieJar = module_this.requires.request.jar();
    module_this.requires.request = module_this.requires.request.defaults({jar:module_this.requires.cookieJar});
    return true;
  },
  login: function(username, password, callback) {
    module_this = this;
    var htmlparser = require("htmlparser");
    var jsdom = require("jsdom");

    getLoginToken();

    // get login token
    function getLoginToken(callback) {
      try {
        module_this.requires.request(module_this.LOGIN_URL, function (error, response, body) {
          // console.log(body);
           if (!error && response.statusCode == 200) {
             jsdom.env({
               html: body,
               scripts: ['jquery.js'],
               done: function (err, window) {
                 var $ = window.$;
                 var token = $( "input[name='__RequestVerificationToken']" ).val();
                 login(token);
               }
             });
           }
        });
      } catch (e) {
        console.log('Could not get Login-Token from Song-Select: ' + e);
      }
    }

    function login(token) {
      console.log('Recieved Login Token');
      try {
        module_this.requires.request.post({
          url: module_this.LOGIN_URL,
          form: {
            '__RequestVerificationToken': token,
            'UserName': username,
            'Password': password,
            'RememberMe': 'false'
          }
        }, function(err,httpResponse,body){
          checkLogin(body);
        });
      } catch (e) {
        console.log('Could not get send Login-Request to Song-Select: ' + e);
      }
    }

    function checkLogin(body) {
      try {
        module_this.requires.request(module_this.BASE_URL, function (error, response, body) {
          // console.log(body);
           if (!error && response.statusCode == 200) {
            //  console.log(body);
             if(body.indexOf('ausloggen') > -1) {
               console.log('Logged In to SongSelect');
               finished();
             } else {
               console.log('Login to SongSelect was not successfull');
             }
           }
        });
      } catch (e) {
        console.log('Login to SongSelect was not successfull with Error: ' + e);
      }
    }
    function finished() {
      if(callback) callback();
    }
    return;
  },
  logout: function() {
    try {
      module_this.requires.request(this.LOGOUT_URL, function (error, response, body) {
         if (!error && response.statusCode == 200) {
            //  console.log(body) // Show the HTML for the Google homepage.
            console.log('Logged Out');

         }
      });
    } catch (e) {
      console.log('Logout on SongSelect was not successfull with Error: ' + e);
    }
  },
  downloadUsrFile: function(songNumber,callback) {
    module_this = this;
    getSongUrl();

    function getSongUrl() {
      // get url of song
      try {
        module_this.requires.request(module_this.SONGS_URL + songNumber, function (error, response, body) {
           if (!error && response.statusCode == 200) {
             // build usr-file download url
             var songUrl = response.request.uri.href;
             console.log('Fetched Song-Url: ' + songUrl);
             getUsrFile(songUrl);
           } else {
             console.log('Could not fetch the Song-Url: ' + response.request.uri.href);
           }
        });
      } catch (e) {
        console.log('Error while fetching the Song-URL: ' + e);
      }
    }

    function getUsrFile(songUrl) {
      try {
        var songUsrUrl = songUrl + '/lyrics/downloadusr';
        // download usr-file
        module_this.requires.request(songUsrUrl, function (error, response, body) {
           if (!error && response.statusCode == 200) {
             finished(body);
           } else {
             console.log('Could not fetch Song-File: '+songUsrUrl);
           }
        });
      } catch (e) {
        console.log('Error while fetching the Song-File: ' + e);
      }
    }

    function finished(data) {
      if(callback) callback(data);
    }
    return;
  },
  downloadTxtFile: function(songNumber,callback) {
    module_this = this;
    getSongUrl();

    function getSongUrl() {
      // get url of song
      try {
        module_this.requires.request(module_this.SONGS_URL + songNumber, function (error, response, body) {
           if (!error && response.statusCode == 200) {
             // build usr-file download url
             var songUrl = response.request.uri.href;
             console.log('Fetched Song-Url: ' + songUrl);
             getUsrFile(songUrl);
           } else {
             console.log('Could not fetch the Song-Url: ' + response.request.uri.href);
           }
        });
      } catch (e) {
        console.log('Error while fetching the Song-URL: ' + e);
      }
    }

    function getUsrFile(songUrl) {
      try {
        var songUsrUrl = songUrl + '/lyrics/download';
        // download usr-file
        module_this.requires.request(songUsrUrl, function (error, response, body) {
           if (!error && response.statusCode == 200) {
             finished(body);
           } else {
             console.log('Could not fetch Song-File: '+songUsrUrl);
             console.log('Maybe there is no Songtext in SongSelect available for this Song.');
             finished(false);
           }
        });
      } catch (e) {
        console.log('Error while fetching the Song-File: ' + e);
      }
    }

    function finished(data) {
      if(callback) callback(data);
    }
    return;
  }
};

exports.USER_AGENT = 'Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; GT-I9000 \nBuild/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 \nMobile Safari/534.30';
exports.BASE_URL = 'https://de.songselect.com';
exports.MOBILE_BASE_URL = 'https://mobile.songselect.com';
exports.LOGIN_URL = exports.BASE_URL + '/account/login';
exports.LOGOUT_URL = exports.BASE_URL + '/account/logout';
exports.SEARCH_URL = exports.BASE_URL + '/search/results';
exports.SONGS_URL = exports.BASE_URL + '/songs/';

// usr-file download
// https://de.songselect.com/songs/6271093/zehntausend-grunde/lyrics/downloadusr
