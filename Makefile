COMPONENT = ./node_modules/.bin/component
KARMA = ./node_modules/karma/bin/karma
JSHINT = ./node_modules/.bin/jshint
MOCHA = ./node_modules/.bin/mocha-phantomjs
BUMP = ./node_modules/.bin/bump
MINIFY = ./node_modules/.bin/minify
BFC = ./node_modules/.bin/bfc

build: components $(find lib/*.js)
	@${COMPONENT} build --dev

prod:
	@${COMPONENT} build

components: node_modules component.json
	@${COMPONENT} install --dev

clean:
	rm -fr build components dist

node_modules:
	npm install

minify: build
	${MINIFY} build/build.js build/build.min.js

karma: build
	${KARMA} start test/karma.conf.js --no-auto-watch --single-run

lint: node_modules
	${JSHINT} lib/*.js

test: lint build
	${MOCHA} /test/runner.html

standalone:
	@${COMPONENT} build --standalone ripple
	@-rm -r dist
	@-mkdir dist
	@${BFC} build/build.js > dist/ripple.js

ci: test

patch:
	${BUMP} patch

minor:
	${BUMP} minor

release: test
	VERSION=`node -p "require('./component.json').version"` && \
	git changelog --tag $$VERSION && \
	git release $$VERSION

.PHONY: clean test karma patch release prod
