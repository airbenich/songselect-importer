# SongSelect Importer

**Download SongSelect TXT and USR Files of SongSelect**

Download SongSelect TXT and USR Files of SongSelect via Node.js over the webinterface on CLI-Level.

## Usage

Use this project as a node_module 'songselect-importer' and save the files to 'node_modules/songselect-importer'.
To download a file use this code in app.js:

```javascript
var songselect = require('songselect-importer');

var username = 'your@account.com';
var password = 'yourpassword';
var cclisongnumber = '1234567';

songselect.init();
songselect.login(username,password,function (result) {
  songselect.downloadTxtFile(cclisongnumber,function (file) {
    console.log(file);
    songselect.logout();
  });
});
```
