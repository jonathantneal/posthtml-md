var marked   = require('marked');
var posthtml = require('posthtml');
var parser   = posthtml();

function walk(nodeList, isMarkdown, isInlineContainer) {
	var conditionallyTrimInnerSpace = /(\S)\s+(\S)/g;
	var trimNodeSaveTrailingSpaces 	= /^(\n*)|(\s*)$/g;
	var minimumNumberOfIndents 		= /^[ \t]+(?=\S)/gm;
	var stripParagraph				= /^<p>([\W\w]*)<\/p>$/;
	var markdownElement				= /^(markdown|md)$/i;
	var strictBlocking				= /^(abbr|acronym|b|bdo|big|button|cite|dfn|em|h1|h2|h3|h4|h5|h6|i|input|kbd|p|q|samp|select|small|span|strong|sub|sup|textarea|time|var)$/i;
	var replaceMarkdownElement		= /^(markdown|md|pre)$/i;

	nodeList.forEach(function (node, index) {
		if (typeof node === 'string') {
			if (isMarkdown) {
				// preserve spacing
				var startSpace = '';
				var trailSpace = '';

				// conditionally trim inner space
				if (isInlineContainer) {
					node = node.replace(conditionallyTrimInnerSpace, '$1 $2');
				}

				// trim node and save trailing spaces
				node = node.replace(trimNodeSaveTrailingSpaces, function ($0, $1, $2) {
					startSpace = $1 || startSpace;
					trailSpace = $2 || trailSpace;

					return '';
				});

				// get the minimum number of indents in the string
				var indents = node.match(minimumNumberOfIndents);

				var indentsLength = indents ? Math.min.apply(Math, indents.map(function (indent) {
					return indent.length;
				})) : 0;

				// remove the minimum number of indents in the string
				node = node.replace(new RegExp('^[ \\t]{' + indentsLength + '}', 'gm'), '');

				// convert to markdown
				node = marked(node).trim();

				// conditionally strip paragraph
				if (isInlineContainer) {
					node = node.replace(stripParagraph, '$1');
				}

				// restore the minimum number of indents in the string
				node = startSpace + node.replace(/^/gm, Array(indentsLength + 1).join('\t')) + trailSpace;

				nodeList[index] = node;
			}
		} else {
			// detect markdown element
			if (markdownElement.test(node.tag)) {
				isMarkdown = true;
			}

			// detect markdown attribute
			if (node.attrs && 'md' in node.attrs) {
				delete node.attrs.md;

				isMarkdown = true;
			}

			// detect strict blocking
			if (node.tag && strictBlocking.test(node.tag)) {
				isInlineContainer = true;
			}

			// conditionally parse content
			if (node.content) {
				walk(node.content, isMarkdown, isInlineContainer);
			}

			// replace markdown element with contents
			if (isMarkdown && replaceMarkdownElement.test(node.tag)) {
				nodeList.splice.apply(nodeList, [index, 1].concat(node.content));
			}

			// reset markdown and strict blocking detection
			isMarkdown  = false;
			isInlineContainer = false;
		}
	});
}

module.exports = function () {
	return function Markdown(tree) {
		walk(tree);
	};
};

module.exports.process = function (contents, options) {
	return parser.use(module.exports(options)).process(contents);
};
