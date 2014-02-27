

var base = '/Users/chenllos/Documents/dev/LIB/gulpPulgin';



var through =  require('through')
  , split   =  require('split')
  , fs      =  require('fs');


function count () {
  var lines = 0
    , nonEmptyLines = 0;

  return through(
    function write (data) {
      lines++;
      data.length && nonEmptyLines++;
      this.emit('data', 'chars: ' + data.length + '\t' + data + '\n');
    }
  , function end () {
      this.emit('data', 'total lines: ' + lines + ' | non empty lines: ' + nonEmptyLines + '\n');
      this.emit('end\n');
    }
  );
}

fs.createReadStream( base + '/test/test.js', { encoding: 'utf-8' })
  .pipe(split())
  .pipe(count())
  .pipe(process.stdout);