var exec =require('child_process').exec;
var path = require('path');

var configPath = process.argv[2];
var complieOption = require(configPath);
console.log( 'gonna compile from this config: ' + configPath );
// var blogConfig = require(configPath);
// console.log(blogConfig);


function compileLessFiles( lessFileArr ){
    // lessc styles.less > styles.css
    var lessFileCount = lessFileArr.length;
    for( var i=0; i<lessFileCount; i++ ){
        compileOne( lessFileArr[i], complieOption.lessPath,  complieOption.cssPath );
    }
}

function compileOne( filePath, lessPath, cssPath ){
    var filePathInfo = getFilePathInfo( filePath );
    var fileName = filePathInfo.fileName;
    var targetFile = path.join( cssPath, filePathInfo.parentPath, filePathInfo.fileName+ '.css');

    var srcFile = path.join( lessPath, filePath);
    var cmd = 'lessc -x ' + srcFile + ' > ' + targetFile;
    // console.log( cmd );
    exec( cmd, {encoding: 'utf-8'}, function( err, stdin, stdout ){
        execCallback( err, cmd );
    } );
}

function execCallback( err, cmd ){
    console.log('\n');
    if( err ){
        console.log('err occured...' );
        console.log( err );
    }
    else{
        console.log( 'less compile suc! ------------------------------------------' );
    }
    console.log('here is the compile cmd:');
    console.log('        ' + cmd );
    
}


function getFilePathInfo( filePath ){
    var extention = path.extname( filePath );

    var fileName = filePath.substr( filePath.lastIndexOf( path.sep )+1, filePath.lastIndexOf( extention ) - filePath.lastIndexOf( path.sep )-1 );

    var parentPath = filePath.substr( 0, filePath.lastIndexOf( path.sep ));

    return {
        parentPath: parentPath,
        fileName: fileName,
        extName: extention
    };
}

compileLessFiles( complieOption.lessFileArr );