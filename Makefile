     CC = node
    BFT = corelyticsbftapi.azurewebsites.net
 CONFIG = ./client/components/config.js
DEVPORT = 3001
 SERVER = ./server/app.js

.PHONY: clean dev deploy start-server start-ui serve

clean:
	rm -rf bft.zip dist/

dev:
	@sed -i 's/https:/http:/' $(CONFIG)
	@sed -i 's/$(BFT)/localhost/' $(CONFIG)
	@sed -i 's/443/$(DEVPORT)/' $(CONFIG)
	@echo "[make] Changed endpoint socket -> http://localhost:$(DEVPORT)"

deploy:
	@sed -i 's/http:/https:/' $(CONFIG)
	@sed -i 's/localhost/$(BFT)/' $(CONFIG)
	@sed -i 's/$(DEVPORT)/443/' $(CONFIG)
	@echo "[make] Changed endpoint socket -> https://$(BFT):443"
	@./node_modules/.bin/webpack
	@echo "[make] Created index.html and bft.js in dist/"
	@zip -r bft.zip dist/
	@echo "[make] Created bft.zip archive"

start-server:
	$(CC) $(SERVER) &

start-ui:
	./node_modules/.bin/webpack-dev-server --open

serve: start-server start-ui

