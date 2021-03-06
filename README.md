# fed-http-server

An HTTP server with livereload included. If a file inside the folder being served is changed, added or deleted, the browser will automatically reload.


## Installing

    npm install -g fed-http-server

## Usage

    fed-http-server [-p <port>] [-d <dir>] [-l livereloadport] [-w < watchPaths || false >] [-b]


**port** (default *8080*): Port to listen on, if port is in use, a free one will be determined

**dir** (default *.*): Folder to serve

**url** (default *empty*): Path to open the specific page. *e.g.* `/#/main` 

**livereloadport** (default *35729*): Port for the livereload server. If `false` the livereload is disabled. if port is in use, a free one will be determined

**watchPaths**: Comma-separated list of glob patterns for the files to watch. *e.g.* `**/*.js,**/*.css,**/*.html,**/*.png,**/*.gif,**/*.jpg`

**b**: disable browser open

## Examples

Default usage

    > fed-http-server

    start on http://<ip>:8080
    Serving <path>
    Livereload listening on port 35729
    Watching files:
      '<path>/**/*.html'
      '<path>/**/*.js'
      '<path>/**/*.css'
      '<path>/**/*.png'
      '<path>/**/*.gif'
      '<path>/**/*.jpg'

you can use short command like this:

    > fedhs

    start on http://<ip>:8080
    Serving <path>
    Livereload listening on port 35729
    Watching files:
      '<path>/**/*.html'
      '<path>/**/*.js'
      '<path>/**/*.css'
      '<path>/**/*.png'
      '<path>/**/*.gif'
      '<path>/**/*.jpg'


All options

    > fed-http-server -p 80 -d src/ -u /#/main -l 30000 -w **/*.css,*.html 

    start on http://<ip>/#/main
    serving <path>/src
    Livereload listening on port 30000
    Watching files:
    <path>/src/**/*.css
    <path>/src/*.html

##  Reference

https://github.com/digisfera/lr-http-server