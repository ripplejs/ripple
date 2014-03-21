
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components dist

minify:
	minify build/build.js build/build.min.js

standalone:
	@component build --standalone ripple --name standalone
	-rm -r dist
	mkdir dist
	cp build/standalone.js dist/ripple.js && rm build/standalone.js
	@minify dist/ripple.js dist/ripple.min.js

karma: build
	./node_modules/karma/bin/karma start

test: build
	node node_modules/.bin/mocha-phantomjs /test/runner.html

patch: build standalone
	bump patch

release: build standalone
	bump minor

.PHONY: clean test karma patch release standalone
