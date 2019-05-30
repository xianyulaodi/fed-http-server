const connect = require('connect'),
      serveStatic = require('serve-static'),
      serveIndex = require('serve-index'),
      path = require('path'),
      gaze = require('gaze'),
      open = require('open'),
      tinylr = require('tiny-lr'),
      debounce = require('lodash.debounce'),
      portfinder = require('portfinder'),
      getIp = require('get-ip');

module.exports = function(port, dir, url, livereloadPort, watchFiles, openBrowser, extensions, debounceDelay) {

  port = port || 8080;
  dir = dir || '.';
  url = url || '';

  if(livereloadPort === 'false' || livereloadPort === false) {
    livereloadPort = false;
  } else {
    livereloadPort = livereloadPort || 35729;
  }

  watchFiles = watchFiles || ['**/*.html', '**/*.js', '**/*.css', '**/*.png', '**/*.gif', '**/*.jpg'];

  extensions = (extensions && extensions.length > 0) ? extensions : false;

  absoluteDir = path.resolve(dir);

  const absoluteWatchFiles = watchFiles.map(function(relativePath) {
    return path.join(absoluteDir, relativePath);
  });


  const server = connect();


  if(livereloadPort) {
    portfinder.basePort = livereloadPort;  
    portfinder.getPortPromise()
    .then((liveport) => {

      server.use(require('connect-livereload')({ port: liveport }));
      const livereloadServer = tinylr();

      livereloadServer.listen(liveport, function(err) {
        if(err) {
          console.error("Livereload not started", err);
          return;
        }
        console.log('Livereload listening on port %s', liveport);

        console.log("Watching files:");
        for(let f in absoluteWatchFiles) {
          console.log('  ' + absoluteWatchFiles[f]);
        }
      });

      gaze(watchFiles, {cwd: absoluteDir}, function(err, watcher) {
        if(err) {
          console.error("Unable to watch files", err);
        }
        let files = [];
        const changed = debounce(function() {
          console.log("Sending changes:\n\t%s", files.join("\n\t"));
          livereloadServer.changed({body:{files:files}});
          files = [];
        }, debounceDelay);
        this.on('all', function(event, filepath) {
          console.log("Watch: " + filepath + ' was ' + event);
          files.push(filepath);
          changed();
        });
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  portfinder.basePort = port;  
  portfinder.getPortPromise()
    .then((port) => {
      server.use(serveStatic(absoluteDir, { extensions: extensions }))
      .use(serveIndex(absoluteDir))
      .listen(port);
      const ip = getIp()[0];
      const openUrl = `http://${ip}:${port}${url}`;
      console.log(`start on ${openUrl}`);
      console.log(`serving ${absoluteDir}`);
      if(openBrowser) { open(openUrl); }
    })
    .catch((err) => {
       console.error(err);
    });
};
