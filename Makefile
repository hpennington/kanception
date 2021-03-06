electron:
	cd kanception && electron-packager . --overwrite --icon=public/logo.icns
test:
	docker exec -it kanception-api npm run test
clean:
	docker-compose stop kanception-api kanception && docker-compose rm kanception-api kanception && rm -rf api/node_modules kanception/node_modules && rm api/package-lock.json kanception/package-lock.json 
migrate:
	docker exec -it kanception-api npx sequelize-cli db:migrate
heroku-migrate:
	heroku run npx sequelize-cli db:migrate --env production --app kanception