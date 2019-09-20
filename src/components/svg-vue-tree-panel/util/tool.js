var pattern = new RegExp("[\u4E00-\u9FA5]+");
var pattern2 = new RegExp("[A-Za-z]+");

let isZH = function(value) {
  return pattern.test(value);
}

let isEN = function(value) {
  return pattern2.test(value);
}
/******************************
text:文本内容；
fontsize:文字大小;
width:每行宽度;
rowcount:行数
******************************/
let get_text_wrap = function(text, fontsize, rowwidth, rowcount) {
  if (!text || text.length <= 0) {
    return [{
      width: 0,
      value: []
    }]
  }
  let lettercount = text.length;
  var row_width = rowwidth;
  var row_count = rowcount;
  var data = [];
  var current_row_width = 0;
  var current_row_index = 0;
  var current_index = 0;
  var ZH_W = fontsize;
  var EL_W = fontsize / 2;
	
  while (current_row_index < row_count && current_index < lettercount) {
    var letter = text[current_index];
    var width = isZH(letter) ? ZH_W : EL_W;
    if (current_row_width + width > row_width) {
      data[current_row_index].width = row_width;
      current_row_index++;
      current_row_width = 0;
    }

    current_row_width += width;

    if (!data[current_row_index]) {
      data[current_row_index] = {
        width: 0,
        value: []
      };
    }
    data[current_row_index].width = current_row_width;
    data[current_row_index].value.push(letter);
    current_index++;
  }
  return data;
}

var tool = {
  isZH: isZH,
  isEN: isEN,
  get_text_wrap: get_text_wrap
}


export default tool;
