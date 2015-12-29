var tests = {
	'posthtml-md': {
		'basic': {
			message: 'supports basic usage',
			options: {
				from: './test/index.html'
			}
		}
	}
};

var debug = true;
var dir   = './test/';

var fs      = require('fs');
var path    = require('path');
var plugin  = require('./');
var test    = require('tape');

Object.keys(tests).forEach(function (name) {
	var parts = tests[name];

	test(name, function (t) {
		var fixtures = Object.keys(parts);

		t.plan(fixtures.length);

		fixtures.forEach(function (fixture) {
			var message    = parts[fixture].message;
			var options    = parts[fixture].options;

			var baseName   = fixture.split(':')[0];
			var testName   = fixture.split(':').join('.');

			var inputPath  = path.resolve(dir + baseName + '.html');
			var expectPath = path.resolve(dir + testName + '.expect.html');
			var actualPath = path.resolve(dir + testName + '.actual.html');

			var inputHTML  = '';
			var expectHTML = '';

			try {
				inputHTML = fs.readFileSync(inputPath,  'utf8');
			} catch (error) {
				fs.writeFileSync(inputPath, inputHTML);
			}

			try {
				expectHTML = fs.readFileSync(expectPath,  'utf8');
			} catch (error) {
				fs.writeFileSync(expectPath, expectHTML);
			}

			plugin.process(inputHTML, options).then(function (result) {
				var actualHTML = result.html;

				if (debug) {
					fs.writeFileSync(actualPath, actualHTML);
				}

				t.equal(actualHTML, expectHTML, message);
			});
		});
	});
});
