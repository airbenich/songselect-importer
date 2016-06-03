# SongSelect Importer

**Download SongSelect TXT and USR Files of SongSelect**

Download SongSelect TXT and USR Files of SongSelect via Node.js over the webinterface on CLI-Level.

## Usage

Use this project as a node_module 'songselect-importer' and save the files to 'node_modules/songselect-importer'.
To download a file use this code in app.js:

```javascript
var songselect = require('songselect-importer');
songselect.init();
songselect.login('your@account.com','yourpassword',function (result) {
  songselect.downloadTxtFile(array[i].license,function (file) {
    console.log(file);
    songselect.logout();
  });
});
```
