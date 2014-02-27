
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

all: build standalone

test: build
	mocha-phantomjs test/index.html

.PHONY: clean test
