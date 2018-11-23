     CC = node
 SERVER = ./server/app.js

.PHONY: clean dev deploy start-server start-ui serve

clean:
	rm -rf bft.zip dist/

deploy:
	@./node_modules/.bin/webpack
	@echo "[make] Created index.html and bft.js in dist/"
	@zip -r bft.zip dist/
	@echo "[make] Created bft.zip archive"

start-server:
	$(CC) $(SERVER) &

start-ui:
	./node_modules/.bin/webpack-dev-server --open

serve: start-server start-ui

