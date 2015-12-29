var marked   = require('marked');
var posthtml = require('posthtml');
var parser   = posthtml();

function walk(nodeList, isMarkdown, isInlineContainer) {
	nodeList.forEach(function (node, index) {
		if (typeof node === 'string') {
			if (isMarkdown) {
				var start = '';
				var end = '';

				// conditionally trim inner space
				if (isInlineContainer) {
					node = node.replace(/(\S)\s+(\S)/g, '$1 $2');
				}

				// trim node and save trailing spaces
				node = node.replace(/^(\n*)|(\s*)$/g, function ($0, $1, $2) {
					start = $1 || start;
					end   = $2 || end;

					return '';
				});

				// get the minimum number of indents in the string
				var indents = node.match(/^[ \t]+(?=\S)/gm);

				var indentsLength = indents ? Math.min.apply(Math, indents.map(function (indent) {
					return indent.length;
				})) : 0;

				// remove the minimum number of indents in the string
				node = node.replace(new RegExp('^[ \\t]{' + indentsLength + '}', 'gm'), '');

				// convert to markdown
				node = marked(node).trim();

				// conditionally strip paragraph
				if (isInlineContainer) {
					node = node.replace(/^<p>([\W\w]*)<\/p>$/, '$1');
				}

				// restore the minimum number of indents in the string
				node = start + node.replace(/^/gm, Array(indentsLength + 1).join('\t')) + end;

				nodeList[index] = node;
			}
		} else {
			// detect markdown attribute
			if (node.attrs && 'md' in node.attrs) {
				delete node.attrs.md;

				isMarkdown = true;
			}

			// detect strict blocking
			if (node.tag && /^(abbr|acronym|b|bdo|big|button|cite|dfn|em|h1|h2|h3|h4|h5|h6|i|input|kbd|p|q|samp|select|small|span|strong|sub|sup|textarea|time|var)$/i.test(node.tag)) {
				isInlineContainer = true;
			}

			// conditionally parse content
			if (node.content) {
				walk(node.content, isMarkdown, isInlineContainer);
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
