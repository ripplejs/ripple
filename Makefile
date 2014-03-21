COMPONENT = ./node_modules/.bin/component
KARMA = ./node_modules/karma/bin/karma
JSHINT = ./node_modules/.bin/jshint
MOCHA = ./node_modules/.bin/mocha-phantomjs
BUMP = ./node_modules/.bin/bump
MINIFY = ./node_modules/.bin/minify

build: components index.js lib
	@${COMPONENT} build --dev

components: node_modules component.json
	@${COMPONENT} install --dev

clean:
	rm -fr build components dist

node_modules:
	npm install

minify: node_modules
	${MINIFY} build/build.js build/build.min.js

standalone: build
	@${COMPONENT} build --standalone ripple --name standalone
	-rm -r dist
	mkdir dist
	cp build/standalone.js dist/ripple.js && rm build/standalone.js
	@${MINIFY} dist/ripple.js dist/ripple.min.js

karma: node_modules build
	${KARMA} start

lint: node_modules
	${JSHINT} lib/**/*.js index.js

test: node_modules lint build
	${MOCHA} /test/runner.html

ci: node_modules test karma

patch: build standalone
	${BUMP} patch

release: build standalone
	${BUMP} minor

.PHONY: clean test karma patch release standalone
