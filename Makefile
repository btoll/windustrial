CC      	= node
SERVER		= ./server/app.js

start-server:
	$(CC) $(SERVER) &

start-ui:
	./node_modules/.bin/webpack-dev-server --open

serve: start-server start-ui

