// 获取行高
function getLine(ele){
	var styles = window.getComputedStyle(ele);
	var rect = ele.getBoundingClientRect();
	var height = rect.height;
	var {
		lineHeight,
		paddingTop,
		paddingBottom,
		fontSize
	} = styles;
	var line = (height - parseInt(paddingTop, 10) - parseInt(paddingBottom, 10)) / parseInt(lineHeight, 10) | 0;
	let textHeightRatio = parseInt(fontSize, 10) / parseInt(lineHeight, 10)
	console.log(line)	
	console.log(textHeightRatio)	
	return {
		styles,
		line,
		textHeightRatio
	};
}

function gradient(line, textHeightRatio, color){
	var first = (1 - textHeightRatio)/2/line;
	return `linear-gradient(${
		[...Array(line)].map((_, key) => {
			return `transparent ${(first = first+ (1-textHeightRatio)*key/line) * 100}%,
			${color} 0%,
			${color} ${(first = first + textHeightRatio/line) * 100}%,
			transparent 0%
			`
		})
	})`;
}

function textBlockFormat(line, textHeightRatio, styles, color){
	var me = {
		backgroundImage: gradient(line, textHeightRatio, color),
		backgroundOrigin: 'content-box',
		backgroundSize: `100% ${styles.lineHeight}`,
		backgroundClip: 'content-box',
		backgroundColor: 'transparent',
		color: 'transparent',
		backgroundRepeat: 'repeat-y'
	};
	console.log(me);
	Object.assign(styles, me);
}

var caculate = getLine(document.querySelector("p"))
textBlockFormat(caculate.line, caculate.textHeightRatio, caculate.styles, "#dedede");