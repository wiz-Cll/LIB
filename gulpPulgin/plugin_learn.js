var plugin = function( files, callback ){
    console.log( arguments );
    console.log( callback.toString() );
    callback( null, files );
};

module.exports = plugin;