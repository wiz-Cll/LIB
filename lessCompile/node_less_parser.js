var less = require('less');
var fs = require('fs');
var path = require('path');


// !!!!!!node的less模块无法解析@import``` 只能自己做吗?


console.log( 'pwd: ' + __dirname );

// process.argv 脚本执行时传入的参数
// 传入数组时不要有空格, 有空格的话就会被解析成多个参数
// console.log( process.argv );
var srcPathArg = process.argv[2];
var targetBaseArg = process.argv[3];
if( srcPathArg ){
	var sourcePath = getAbsPath( srcPathArg );
	var targetBase = getAbsPath( targetBaseArg );
	// console.log( sourcePath );

	parseLessFile( sourcePath, targetBase );
}
else{
	console.error('参数错误: 没有传递路径参数...');
	return false;
}



function getAbsPath( arg ){
	var absPath = '';
	if( arg.charAt(0) == '/' ){
		// console.log('绝对路径...');
		absPath = arg;
	}
	else{
		// console.log('相对路径...');
		absPath = path.resolve( __dirname, arg );
	}
	return absPath;
}

function parseLessFile( filePath, targetBasePath ){
	// console.log( arguments );
	// Enhance:  判断文件是否带了扩展名 path.extname
	// Enhance:  判断文件是否存在 fs.exists
	fs.readFile( filePath, 'utf-8', function( err, data ){
		if( err ){
			console.error( err );
		}

		// console.log( typeof data );

		var lessFileName = path.basename( filePath, '.less');
		// console.log( 'less file name: ' + lessFileName );
		less2css( data, true, path.join(targetBasePath, lessFileName + '.css') );
	} );
}
var parser = new(less.Parser);
function less2css( str, blCompress, saveAsThisFile ){
	console.log( arguments );
	
	parser.parse( str, function( err, tree){
		// console.log( err );
		// console.log( tree );
		var cssStr = tree.toCSS({ compress: blCompress });
		console.log( cssStr );
		fs.writeFile( saveAsThisFile, cssStr, function( err, data ){
			if(err){
				console.error( err );
			}
			console.log('less file compile suc');
		} );
	} );
}




// 解析路径
// 获取source文件
// parse/toCSS
// write