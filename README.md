# Markdown

<a href="https://github.com/posthtml/posthtml"><img src="http://posthtml.github.io/posthtml/logo.svg" alt="PostHTML Logo" width="80" height="80" align="right"></a>

[![NPM Version][npm-img]][npm] [![Build Status][ci-img]][ci]

[Markdown] allows you to easily use context-sensitive markdown within HTML.

```html
<!-- BEFORE -->
<h1 md>
	PostCSS **Markdown**
</h1>
<div md>
	It knows

	*when* to work.
</div>
<p md>
	It knows

	*how* to work.
</p>
<p>
	It knows

	*what* to ignore.
</p>
<md>
	It just [works](https://github.com/jonathantneal/posthtml-md).
</md>

<!-- AFTER -->
<h1>
	PostCSS <strong>Markdown</strong>
</h1>
<div>
	<p>It knows</p>
	<p><em>when</em> to work.</p>
</div>
<p>
	It knows <em>how</em> to work.
</p>
<p>
	It knows

	*what* to ignore.
</p>

	<p>It just <a href="https://github.com/jonathantneal/posthtml-md">works</a>.</p>
```

[Markdown] knows when to write inline or block-level content.

## Usage

Add [Markdown] to your build tool:

```bash
npm install posthtml-md --save-dev
```

#### Node

```js
require('posthtml-md').process(YOUR_HTML, { /* options */ });
```

#### PostHTML

Add [PostHTML] to your build tool:

```bash
npm install posthtml --save-dev
```

Load [Markdown] as a PostHTML plugin:

```js
posthtml([
	require('posthtml-md')({ /* options */ })
]).process(YOUR_HTML, /* options */);
```

#### Gulp

Add [Gulp PostHTML] to your build tool:

```bash
npm install gulp-posthtml --save-dev
```

Enable [Markdown] within your Gulpfile:

```js
var posthtml = require('gulp-posthtml');

gulp.task('html', function () {
	return gulp.src('./src/*.html').pipe(
		posthtml([
			require('posthtml-md')({ /* options */ })
		])
	).pipe(
		gulp.dest('.')
	);
});
```

#### Grunt

Add [Grunt PostHTML] to your build tool:

```bash
npm install grunt-posthtml --save-dev
```

Enable [Markdown] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-posthtml');

grunt.initConfig({
	posthtml: {
		options: {
			use: [
				require('posthtml-md')({ /* options */ })
			]
		},
		dist: {
			src: '*.html'
		}
	}
});
```

[ci]:      https://travis-ci.org/jonathantneal/posthtml-md
[ci-img]:  https://img.shields.io/travis/jonathantneal/posthtml-md.svg
[npm]:     https://www.npmjs.com/package/posthtml-md
[npm-img]: https://img.shields.io/npm/v/posthtml-md.svg

[Gulp PostHTML]:  https://github.com/posthtml/gulp-posthtml
[Grunt PostHTML]: https://github.com/TCotton/grunt-posthtml
[PostHTML]:       https://github.com/posthtml/posthtml

[Markdown]: https://github.com/jonathantneal/posthtml-md
