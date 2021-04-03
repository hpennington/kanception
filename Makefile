electron:
	cd kanception && electron-packager . --overwrite --icon=public/logo.icns
test:
	docker exec -it kanception-api npm run test
