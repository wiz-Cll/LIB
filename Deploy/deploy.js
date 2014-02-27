var path = require('path'),
    child = require('child_process'),
    fs = require('fs');

var config = {
    path: {
        current: '/Users/chenllos/Documents/dev/LIB/Deploy/current',
        running: '/Users/chenllos/Documents/dev/LIB/Deploy/running',
        forword: '/Users/chenllos/Documents/dev/LIB/Deploy/forword/blog',
        backup: '/Users/chenllos/Documents/dev/LIB/Deploy/backup'
    },
    git: {
        url: 'https://github.com/wiz-Cll/blog.git',
        // old hash
        usingHash: 'a38a0621b2531771235e54f4366c8a0a85d6046a'

        // up-to-date hash
        // usingHash: '2c859f341bf979738765cbe55eb72252b4b95875'
    }
};

var ignoreHashCompare = process.argv[2];



var Deploy = {
    getCurrentHash: function( callback ){
        var getGitLogCmd = 'cd '+config.path.forword + ' && git pull';
        child.exec( getGitLogCmd, function( err, stdout, stdin ){
            if( err ){

            }
            else{
                // var currentHash = getHashFromLog( stdout );
                // callback( currentHash );
                console.log( stdout );
            }
        });
    },
    checkHashAndDecide: function(){

    }
};



function getHashFromLog( log ){
    var lastHash =  stdout.match( /commit\ ([0-9a-zA-Z]{40,})/ );
    lastHash = lastHash[ 1 ];
    return lastHash;
}

// var testLog = 'Already up-to-date.\ncommit 2c859f341bf979738765cbe55eb72252b4b95875\nAuthor: wiz-Cll <cll@wiz.cn>\nDa';
// console.log( getCurrentHash( testLog ) );



function autoDeploy(){
    Deploy.getCurrentHash();
    // console.log('gonna go deploy~~~~');
    // console.log('copying all files to running folder with time stamp...');

    // console.log('exec deploy commond...');

    // console.log('change soft link...');

    // console.log('copy last used to backup and add a time stamp...');

    // console.log('remove last used folder...');

    // console.log('wait for next deploy');
}

autoDeploy();