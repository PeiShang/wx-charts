/*
 * charts for WeChat small app v1.0
 *
 * https://github.com/xiaolin3303/wx-charts
 * 2016-11-28
 *
 * Designed and built with all the love of Web
 */
 
"use strict";function assign(t,e){if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var i=Object(t),n=1;n<arguments.length;n++){var a=arguments[n];if(null!=a)for(var o in a)Object.prototype.hasOwnProperty.call(a,o)&&(i[o]=a[o])}return i}function findRange(t,e,i){if(isNaN(t))throw new Error("[wxCharts] unvalid series data!");i=i||10,e=e?e:"upper";for(var n=1;i<1;)i*=10,n*=10;for(t="upper"===e?Math.ceil(t*n):Math.floor(t*n);t%i!==0;)"upper"===e?t++:t--;return t/n}function calRotateTranslate(t,e,i){var n=t,a=i-e,o=n+(i-a-n)/Math.sqrt(2);o*=-1;var r=(i-a)*(Math.sqrt(2)-1)-(i-a-n)/Math.sqrt(2);return{transX:o,transY:r}}function createCurveControlPoints(t,e){var i=.2,n=.2,a=null,o=null,r=null,s=null;if(e<1?(a=t[0].x+(t[1].x-t[0].x)*i,o=t[0].y+(t[1].y-t[0].y)*i):(a=t[e].x+(t[e+1].x-t[e-1].x)*i,o=t[e].y+(t[e+1].y-t[e-1].y)*i),e>t.length-3){var l=t.length-1;r=t[l].x-(t[l].x-t[l-1].x)*n,s=t[l].y-(t[l].y-t[l-1].y)*n}else r=t[e+1].x-(t[e+2].x-t[e].x)*n,s=t[e+1].y-(t[e+2].y-t[e].y)*n;return{ctrA:{x:a,y:o},ctrB:{x:r,y:s}}}function convertCoordinateOrigin(t,e,i){return{x:i.x+t,y:i.y-e}}function avoidCollision(t,e){if(e)for(;util.isCollision(t,e);)t.start.x>0?t.start.y--:t.start.x<0?t.start.y++:t.start.y>0?t.start.y++:t.start.y--;return t}function fillSeriesColor(t,e){var i=0;return t.map(function(t){return t.color||(t.color=e.colors[i],i=(i+1)%e.colors.length),t})}function getDataRange(t,e){var i=0,n=e-t;return i=n>=1e4?1e3:n>=1e3?100:n>=100?10:n>=10?5:n>=1?1:n>=.1?.1:.01,{minRange:findRange(t,"lower",i),maxRange:findRange(e,"upper",i)}}function measureText(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:10;t=String(t);var t=t.split(""),i=0;return t.forEach(function(t){i+=/[a-zA-Z]/.test(t)?7:/[0-9]/.test(t)?5.5:/\./.test(t)?2.7:/-/.test(t)?3.25:/[\u4e00-\u9fa5]/.test(t)?10:/\(|\)/.test(t)?3.73:/\s/.test(t)?2.5:/%/.test(t)?8:10}),i*e/10}function dataCombine(t){return t.reduce(function(t,e){return(t.data?t.data:t).concat(e.data)},[])}function getSeriesDataItem(t,e){var i=[];return t.forEach(function(t){if(null!==t.data[e]&&"undefinded"!=typeof t.data[e]){var n={};n.color=t.color,n.name=t.name,n.data=t.format?t.format(t.data[e]):t.data[e],i.push(n)}}),i}function getToolTipData(t,e,i){var n=t.map(function(t){return{text:t.name+": "+t.data,color:t.color}}),a=[],o={x:0,y:0};return e.forEach(function(t){"undefinded"!=typeof t[i]&&null!==t[i]&&a.push(t[i])}),a.forEach(function(t){o.x=Math.round(t.x),o.y+=t.y}),o.y/=a.length,{textList:n,offset:o}}function findCurrentIndex(t,e,i,n){var a=-1;return isInExactChartArea(t,i,n)&&e.forEach(function(e,i){t.x>e&&(a=i)}),a}function isInExactChartArea(t,e,i){return t.x<e.width-i.padding&&t.x>i.padding+i.yAxisWidth+i.yAxisTitleWidth&&t.y>i.padding&&t.y<e.height-i.legendHeight-i.xAxisHeight-i.padding}function findPieChartCurrentIndex(t,e){var i=-1;return isInExactPieChartArea(t,e.center,e.radius)&&!function(){var n=Math.atan2(e.center.y-t.y,t.x-e.center.x);n<0&&(n+=2*Math.PI),n=2*Math.PI-n,e.series.forEach(function(t,e){n>t._start_&&(i=e)})}(),i}function isInExactPieChartArea(t,e,i){return Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)<=Math.pow(i,2)}function splitPoints(t){var e=[],i=[];return t.forEach(function(t,n){null!==t?i.push(t):(i.length&&e.push(i),i=[])}),i.length&&e.push(i),e}function calLegendData(t,e,i){if(e.legend===!1)return{legendList:[],legendHeight:0};var n=5,a=8,o=15,r=[],s=0,l=[];return t.forEach(function(t){var i=3*n+o+measureText(t.name||"undefinded");s+i>e.width?(r.push(l),s=i,l=[t]):(s+=i,l.push(t))}),l.length&&r.push(l),{legendList:r,legendHeight:r.length*(i.fontSize+a)+n}}function calCategoriesData(t,e,i){var n={angle:0,xAxisHeight:i.xAxisHeight},a=getXAxisPoints(t,e,i),o=a.eachSpacing,r=t.map(function(t){return measureText(t)}),s=Math.max.apply(this,r);return s+2*i.xAxisTextPadding>o&&(n.angle=45*Math.PI/180,n.xAxisHeight=2*i.xAxisTextPadding+s*Math.sin(n.angle)),n}function getPieDataPoints(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,i=0,n=0;return t.forEach(function(t){t.data=null===t.data?0:t.data,i+=t.data}),t.forEach(function(t){t.data=null===t.data?0:t.data,t._proportion_=t.data/i*e}),t.forEach(function(t){t._start_=n,n+=2*t._proportion_*Math.PI}),t}function getPieTextMaxLength(t){t=getPieDataPoints(t);var e=0;return t.forEach(function(t){var i=t.format?t.format(+t._proportion_.toFixed(2)):util.toFixed(100*t._proportion_)+"%";e=Math.max(e,measureText(i))}),e}function fixColumeData(t,e,i,n,a){return t.map(function(t){return null===t?null:(t.width=(e-2*a.columePadding)/i,t.width=Math.min(t.width,25),t.x+=(n+.5-i/2)*t.width,t)})}function getXAxisPoints(t,e,i){var n=i.yAxisWidth+i.yAxisTitleWidth,a=e.width-2*i.padding-n,o=a/t.length,r=[],s=i.padding+n,l=e.width-i.padding;return t.forEach(function(t,e){r.push(s+e*o)}),r.push(l),{xAxisPoints:r,startX:s,endX:l,eachSpacing:o}}function getDataPoints(t,e,i,n,a,o,r){var s=arguments.length>7&&void 0!==arguments[7]?arguments[7]:1,l=[],h=o.height-2*r.padding-r.xAxisHeight-r.legendHeight;return t.forEach(function(t,c){if(null===t)l.push(null);else{var d={};d.x=n[c]+Math.round(a/2);var x=h*(t-e)/(i-e);x*=s,d.y=o.height-r.xAxisHeight-r.legendHeight-Math.round(x)-r.padding,l.push(d)}}),l}function getYAxisTextList(t,e,i){var n=dataCombine(t);n=n.filter(function(t){return null!==t});var a=Math.min.apply(this,n),o=Math.max.apply(this,n);if("number"==typeof e.yAxis.min&&(a=Math.min(e.yAxis.min,a)),"number"==typeof e.yAxis.max&&(o=Math.max(e.yAxis.max,o)),a===o){var r=o||1;a-=r,o+=r}for(var s=getDataRange(a,o),l=s.minRange,h=s.maxRange,c=[],d=(h-l)/i.yAxisSplit,x=0;x<=i.yAxisSplit;x++)c.push(l+d*x);return c.reverse()}function calYAxisData(t,e,i){var n=getYAxisTextList(t,e,i),a=i.yAxisWidth,o=n.map(function(t){return t=util.toFixed(t,2),t=e.yAxis.format?e.yAxis.format(Number(t)):t,a=Math.max(a,measureText(t)+5),t});return e.yAxis.disabled===!0&&(a=0),{rangesFormat:o,ranges:n,yAxisWidth:a}}function drawPointShape(t,e,i,n){n.beginPath(),n.setStrokeStyle("#ffffff"),n.setLineWidth(1),n.setFillStyle(e),"diamond"===i?t.forEach(function(t,e){null!==t&&(n.moveTo(t.x,t.y-4.5),n.lineTo(t.x-4.5,t.y),n.lineTo(t.x,t.y+4.5),n.lineTo(t.x+4.5,t.y),n.lineTo(t.x,t.y-4.5))}):"circle"===i?t.forEach(function(t,e){null!==t&&(n.moveTo(t.x+3.5,t.y),n.arc(t.x,t.y,4,0,2*Math.PI,!1))}):"rect"===i?t.forEach(function(t,e){null!==t&&(n.moveTo(t.x-3.5,t.y-3.5),n.rect(t.x-3.5,t.y-3.5,7,7))}):"triangle"===i&&t.forEach(function(t,e){null!==t&&(n.moveTo(t.x,t.y-4.5),n.lineTo(t.x-4.5,t.y+4.5),n.lineTo(t.x+4.5,t.y+4.5),n.lineTo(t.x,t.y-4.5))}),n.closePath(),n.fill(),n.stroke()}function drawRingTitle(t,e,i){var n=t.title.fontSize||e.titleFontSize,a=t.subtitle.fontSize||e.subtitleFontSize,o=t.title.name||"",r=t.subtitle.name||"",s=t.title.color||e.titleColor,l=t.subtitle.color||e.subtitleColor,h=o?n:0,c=r?a:0,d=5;if(r){var x=measureText(r,a),f=(t.width-x)/2,g=(t.height-e.legendHeight+a)/2;o&&(g-=(h+d)/2),i.beginPath(),i.setFontSize(a),i.setFillStyle(l),i.fillText(r,f,g),i.stroke(),i.closePath()}if(o){var u=measureText(o,n),p=(t.width-u)/2,y=(t.height-e.legendHeight+n)/2;r&&(y+=(c+d)/2),i.beginPath(),i.setFontSize(n),i.setFillStyle(s),i.fillText(o,p,y),i.stroke(),i.closePath()}}function drawPointText(t,e,i,n){var a=e.data;n.beginPath(),n.setFontSize(i.fontSize),n.setFillStyle("#666666"),t.forEach(function(t,i){if(null!==t){var o=e.format?e.format(a[i]):a[i];n.fillText(o,t.x-measureText(o)/2,t.y-2)}}),n.closePath(),n.stroke()}function drawPieText(t,e,i,n,a,o){var r=a+i.pieChartLinePadding,s=(r+i.pieChartTextPadding,[]),l=null,h=t.map(function(t){var e=2*Math.PI-(t._start_+2*Math.PI*t._proportion_/2),i=t.format?t.format(+t._proportion_.toFixed(2)):util.toFixed(100*t._proportion_)+"%",n=t.color;return{arc:e,text:i,color:n}});h.forEach(function(t){var e=Math.cos(t.arc)*r,n=Math.sin(t.arc)*r,o=Math.cos(t.arc)*a,h=Math.sin(t.arc)*a,c=e>=0?e+i.pieChartTextPadding:e-i.pieChartTextPadding,d=n,x=measureText(t.text),f=d;l&&util.isSameXCoordinateArea(l.start,{x:c})&&(f=c>0?Math.min(d,l.start.y):e<0?Math.max(d,l.start.y):d>0?Math.max(d,l.start.y):Math.min(d,l.start.y)),c<0&&(c-=x);var g={lineStart:{x:o,y:h},lineEnd:{x:e,y:n},start:{x:c,y:f},width:x,height:i.fontSize,text:t.text,color:t.color};l=avoidCollision(g,l),s.push(l)}),s.forEach(function(t){var e=convertCoordinateOrigin(t.lineStart.x,t.lineStart.y,o),a=convertCoordinateOrigin(t.lineEnd.x,t.lineEnd.y,o),r=convertCoordinateOrigin(t.start.x,t.start.y,o);n.setLineWidth(1),n.setFontSize(i.fontSize),n.beginPath(),n.setStrokeStyle(t.color),n.setFillStyle(t.color),n.moveTo(e.x,e.y);var s=t.start.x<0?r.x+t.width:r.x,l=t.start.x<0?r.x-5:r.x+5;n.quadraticCurveTo(a.x,a.y,s,r.y),n.moveTo(e.x,e.y),n.stroke(),n.closePath(),n.beginPath(),n.moveTo(r.x+t.width,r.y),n.arc(s,r.y,2,0,2*Math.PI),n.closePath(),n.fill(),n.beginPath(),n.setFillStyle("#666666"),n.fillText(t.text,l,r.y+3),n.closePath(),n.stroke(),n.closePath()})}function drawToolTipSplitLine(t,e,i,n){var a=i.padding,o=e.height-i.padding-i.xAxisHeight-i.legendHeight;n.beginPath(),n.setStrokeStyle("#cccccc"),n.setLineWidth(1),n.moveTo(t,a),n.lineTo(t,o),n.stroke(),n.closePath()}function drawToolTip(t,e,i,n,a){var o=4,r=5,s=8,l=!1;e=assign({x:0,y:0},e),e.y-=8;var h=t.map(function(t){return measureText(t.text)}),c=o+r+4*n.toolTipPadding+Math.max.apply(null,h),d=2*n.toolTipPadding+t.length*n.toolTipLineHeight;e.x+s+c>i.width&&(l=!0),a.beginPath(),a.setFillStyle(i.tooltip.option.background||n.toolTipBackground),a.setGlobalAlpha(n.toolTipOpacity),l?(a.moveTo(e.x,e.y+10),a.lineTo(e.x-s,e.y+10-5),a.lineTo(e.x-s,e.y+10+5),a.moveTo(e.x,e.y+10),a.fillRect(e.x-c-s,e.y,c,d)):(a.moveTo(e.x,e.y+10),a.lineTo(e.x+s,e.y+10-5),a.lineTo(e.x+s,e.y+10+5),a.moveTo(e.x,e.y+10),a.fillRect(e.x+s,e.y,c,d)),a.closePath(),a.fill(),a.setGlobalAlpha(1),t.forEach(function(t,i){a.beginPath(),a.setFillStyle(t.color);var r=e.x+s+2*n.toolTipPadding,h=e.y+(n.toolTipLineHeight-n.fontSize)/2+n.toolTipLineHeight*i+n.toolTipPadding;l&&(r=e.x-c-s+2*n.toolTipPadding),a.fillRect(r,h,o,n.fontSize),a.closePath()}),a.beginPath(),a.setFontSize(n.fontSize),a.setFillStyle("#ffffff"),t.forEach(function(t,i){var h=e.x+s+2*n.toolTipPadding+o+r;l&&(h=e.x-c-s+2*n.toolTipPadding+ +o+r);var d=e.y+(n.toolTipLineHeight-n.fontSize)/2+n.toolTipLineHeight*i+n.toolTipPadding;a.fillText(t.text,h,d+n.fontSize)}),a.stroke(),a.closePath()}function drawYAxisTitle(t,e,i,n){var a=i.xAxisHeight+(e.height-i.xAxisHeight-measureText(t))/2;n.save(),n.beginPath(),n.setFontSize(i.fontSize),n.setFillStyle(e.yAxis.titleFontColor||"#333333"),n.translate(0,e.height),n.rotate(-90*Math.PI/180),n.fillText(t,a,i.padding+.5*i.fontSize),n.stroke(),n.closePath(),n.restore()}function drawColumnDataPoints(t,e,i,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,o=calYAxisData(t,e,i),r=o.ranges,s=getXAxisPoints(e.categories,e,i),l=s.xAxisPoints,h=s.eachSpacing,c=r.pop(),d=r.shift();e.height-i.padding-i.xAxisHeight-i.legendHeight;return t.forEach(function(o,r){var s=o.data,x=getDataPoints(s,c,d,l,h,e,i,a);x=fixColumeData(x,h,t.length,r,i),n.beginPath(),n.setFillStyle(o.color),x.forEach(function(t,a){if(null!==t){var o=t.x-t.width/2+1,r=e.height-t.y-i.padding-i.xAxisHeight-i.legendHeight;n.moveTo(o,t.y),n.rect(o,t.y,t.width-2,r)}}),n.closePath(),n.fill()}),t.forEach(function(o,r){var s=o.data,x=getDataPoints(s,c,d,l,h,e,i,a);x=fixColumeData(x,h,t.length,r,i),e.dataLabel!==!1&&1===a&&drawPointText(x,o,i,n)}),l}function drawAreaDataPoints(t,e,i,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,o=calYAxisData(t,e,i),r=o.ranges,s=getXAxisPoints(e.categories,e,i),l=s.xAxisPoints,h=s.eachSpacing,c=r.pop(),d=r.shift(),x=e.height-i.padding-i.xAxisHeight-i.legendHeight,f=[];return e.tooltip&&e.tooltip.textList&&e.tooltip.textList.length&&1===a&&drawToolTipSplitLine(e.tooltip.offset.x,e,i,n),t.forEach(function(t,o){var r=t.data,s=getDataPoints(r,c,d,l,h,e,i,a);f.push(s);var g=splitPoints(s);if(g.forEach(function(i){if(n.beginPath(),n.setStrokeStyle(t.color),n.setFillStyle(t.color),n.setGlobalAlpha(.6),n.setLineWidth(2),i.length>1){var a=i[0],o=i[i.length-1];n.moveTo(a.x,a.y),"curve"===e.extra.lineStyle?i.forEach(function(t,e){if(e>0){var a=createCurveControlPoints(i,e-1);n.bezierCurveTo(a.ctrA.x,a.ctrA.y,a.ctrB.x,a.ctrB.y,t.x,t.y)}}):i.forEach(function(t,e){e>0&&n.lineTo(t.x,t.y)}),n.lineTo(o.x,x),n.lineTo(a.x,x),n.lineTo(a.x,a.y)}else{var r=i[0];n.moveTo(r.x-h/2,r.y),n.lineTo(r.x+h/2,r.y),n.lineTo(r.x+h/2,x),n.lineTo(r.x-h/2,x),n.moveTo(r.x-h/2,r.y)}n.closePath(),n.fill(),n.setGlobalAlpha(1)}),e.dataPointShape!==!1){var u=i.dataPointShape[o%i.dataPointShape.length];drawPointShape(s,t.color,u,n)}}),e.dataLabel!==!1&&1===a&&t.forEach(function(t,o){var r=t.data,s=getDataPoints(r,c,d,l,h,e,i,a);drawPointText(s,t,i,n)}),e.tooltip&&e.tooltip.textList&&e.tooltip.textList.length&&1===a&&drawToolTip(e.tooltip.textList,e.tooltip.offset,e,i,n),{xAxisPoints:l,calPoints:f}}function drawLineDataPoints(t,e,i,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,o=calYAxisData(t,e,i),r=o.ranges,s=getXAxisPoints(e.categories,e,i),l=s.xAxisPoints,h=s.eachSpacing,c=r.pop(),d=r.shift(),x=[];return e.tooltip&&e.tooltip.textList&&e.tooltip.textList.length&&1===a&&drawToolTipSplitLine(e.tooltip.offset.x,e,i,n),t.forEach(function(t,o){var r=t.data,s=getDataPoints(r,c,d,l,h,e,i,a);x.push(s);var f=splitPoints(s);if(f.forEach(function(i,a){n.beginPath(),n.setStrokeStyle(t.color),n.setLineWidth(2),1===i.length?(n.moveTo(i[0].x,i[0].y),n.arc(i[0].x,i[0].y,1,0,2*Math.PI)):(n.moveTo(i[0].x,i[0].y),"curve"===e.extra.lineStyle?i.forEach(function(t,e){if(e>0){var a=createCurveControlPoints(i,e-1);n.bezierCurveTo(a.ctrA.x,a.ctrA.y,a.ctrB.x,a.ctrB.y,t.x,t.y)}}):i.forEach(function(t,e){e>0&&n.lineTo(t.x,t.y)}),n.moveTo(i[0].x,i[0].y)),n.closePath(),n.stroke()}),e.dataPointShape!==!1){var g=i.dataPointShape[o%i.dataPointShape.length];drawPointShape(s,t.color,g,n)}}),e.dataLabel!==!1&&1===a&&t.forEach(function(t,o){var r=t.data,s=getDataPoints(r,c,d,l,h,e,i,a);drawPointText(s,t,i,n)}),e.tooltip&&e.tooltip.textList&&e.tooltip.textList.length&&1===a&&drawToolTip(e.tooltip.textList,e.tooltip.offset,e,i,n),{xAxisPoints:l,calPoints:x}}function drawXAxis(t,e,i,n){var a=getXAxisPoints(t,e,i),o=a.xAxisPoints,r=a.startX,s=a.endX,l=a.eachSpacing,h=e.height-i.padding-i.xAxisHeight-i.legendHeight,c=h+i.xAxisLineHeight;n.beginPath(),n.setStrokeStyle(e.xAxis.gridColor||"#cccccc"),n.setLineWidth(1),n.moveTo(r,h),n.lineTo(s,h),e.xAxis.disableGrid!==!0&&("calibration"===e.xAxis.type?o.forEach(function(t,e){e>0&&(n.moveTo(t-l/2,h),n.lineTo(t-l/2,h+4))}):o.forEach(function(t,e){n.moveTo(t,h),n.lineTo(t,c)})),n.closePath(),n.stroke();var d=e.width-2*i.padding-i.yAxisWidth-i.yAxisTitleWidth,x=Math.min(t.length,Math.ceil(d/i.fontSize/1.5)),f=Math.ceil(t.length/x);t=t.map(function(t,e){return e%f!==0?"":t}),0===i._xAxisTextAngle_?(n.beginPath(),n.setFontSize(i.fontSize),n.setFillStyle(e.xAxis.fontColor||"#666666"),t.forEach(function(t,e){var a=l/2-measureText(t)/2;n.fillText(t,o[e]+a,h+i.fontSize+5)}),n.closePath(),n.stroke()):t.forEach(function(t,a){n.save(),n.beginPath(),n.setFontSize(i.fontSize),n.setFillStyle(e.xAxis.fontColor||"#666666");var r=measureText(t),s=l/2-r,c=calRotateTranslate(o[a]+l/2,h+i.fontSize/2+5,e.height),d=c.transX,x=c.transY;n.rotate(-1*i._xAxisTextAngle_),n.translate(d,x),n.fillText(t,o[a]+s,h+i.fontSize+5),n.closePath(),n.stroke(),n.restore()})}function drawYAxis(t,e,i,n){if(e.yAxis.disabled!==!0){for(var a=calYAxisData(t,e,i),o=a.rangesFormat,r=i.yAxisWidth+i.yAxisTitleWidth,s=e.height-2*i.padding-i.xAxisHeight-i.legendHeight,l=Math.floor(s/i.yAxisSplit),h=i.padding+r,c=e.width-i.padding,d=(i.padding,e.height-i.padding-i.xAxisHeight-i.legendHeight),x=[],f=0;f<i.yAxisSplit;f++)x.push(i.padding+l*f);n.beginPath(),n.setStrokeStyle(e.yAxis.gridColor||"#cccccc"),n.setLineWidth(1),x.forEach(function(t,e){n.moveTo(h,t),n.lineTo(c,t)}),n.closePath(),n.stroke(),n.beginPath(),n.setFontSize(i.fontSize),n.setFillStyle(e.yAxis.fontColor||"#666666"),o.forEach(function(t,e){var a=x[e]?x[e]:d;n.fillText(t,i.padding+i.yAxisTitleWidth,a+i.fontSize/2)}),n.closePath(),n.stroke(),e.yAxis.title&&drawYAxisTitle(e.yAxis.title,e,i,n)}}function drawLegend(t,e,i,n){if(e.legend){var a=calLegendData(t,e,i),o=a.legendList,r=(a.legendHeight,5),s=8,l=15;o.forEach(function(t,a){var o=0;t.forEach(function(t){t.name=t.name||"undefined",o+=3*r+measureText(t.name)+l});var h=(e.width-o)/2+r,c=e.height-i.padding-i.legendHeight+a*(i.fontSize+s)+r+s;n.setFontSize(i.fontSize),t.forEach(function(t){switch(e.type){case"line":n.beginPath(),n.setLineWidth(1),n.setStrokeStyle(t.color),n.moveTo(h-2,c+5),n.lineTo(h+17,c+5),n.stroke(),n.closePath(),n.beginPath(),n.setLineWidth(1),n.setStrokeStyle("#ffffff"),n.setFillStyle(t.color),n.moveTo(h+7.5,c+5),n.arc(h+7.5,c+5,4,0,2*Math.PI),n.fill(),n.stroke(),n.closePath();break;case"pie":case"ring":n.beginPath(),n.setFillStyle(t.color),n.moveTo(h+7.5,c+5),n.arc(h+7.5,c+5,7,0,2*Math.PI),n.closePath(),n.fill();break;default:n.beginPath(),n.setFillStyle(t.color),n.moveTo(h,c),n.rect(h,c,15,10),n.closePath(),n.fill()}h+=r+l,n.beginPath(),n.setFillStyle("#333333"),n.fillText(t.name,h,c+9),n.closePath(),n.stroke(),h+=measureText(t.name)+2*r})})}}function drawPieDataPoints(t,e,i,n){var a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1;t=getPieDataPoints(t,a);var o={x:e.width/2,y:(e.height-i.legendHeight)/2},r=Math.min(o.x-i.pieChartLinePadding-i.pieChartTextPadding-i._pieTextMaxLength_,o.y-i.pieChartLinePadding-i.pieChartTextPadding);if(r-=e.dataLabel?10:2*i.padding,t.forEach(function(t){n.beginPath(),n.setLineWidth(2),n.setStrokeStyle("#ffffff"),n.setFillStyle(t.color),n.moveTo(o.x,o.y),n.arc(o.x,o.y,r,t._start_,t._start_+2*t._proportion_*Math.PI),n.closePath(),n.fill(),e.disablePieStroke!==!0&&n.stroke()}),"ring"===e.type){var s=.6*r;"number"==typeof e.extra.ringWidth&&e.extra.ringWidth>0&&(s=Math.max(0,r-e.extra.ringWidth)),n.beginPath(),n.setFillStyle("#ffffff"),n.moveTo(o.x,o.y),n.arc(o.x,o.y,s,0,2*Math.PI),n.closePath(),n.fill()}return e.dataLabel!==!1&&1===a&&drawPieText(t,e,i,n,r,o),1===a&&"ring"===e.type&&drawRingTitle(e,i,n),{center:o,radius:r,series:t}}function drawCanvas(t,e){e.draw()}function Animation(t){this.isStop=!1,t.duration="undefined"==typeof t.duration?1e3:t.duration,t.timing=t.timing||"linear";var e=17,i=function(){return"undefined"!=typeof requestAnimationFrame?requestAnimationFrame:"undefined"!=typeof setTimeout?function(t,e){setTimeout(function(){var e=+new Date;t(e)},e)}:function(t){t(null)}},n=i(),a=null,o=function(i){if(null===i||this.isStop===!0)return t.onProcess&&t.onProcess(1),void(t.onAnimationFinish&&t.onAnimationFinish());if(null===a&&(a=i),i-a<t.duration){var r=(i-a)/t.duration,s=Timing[t.timing];r=s(r),t.onProcess&&t.onProcess(r),n(o,e)}else t.onProcess&&t.onProcess(1),t.onAnimationFinish&&t.onAnimationFinish()};o=o.bind(this),n(o,e)}function drawCharts(t,e,i,n){var a=this,o=e.series,r=e.categories;o=fillSeriesColor(o,i);var s=calLegendData(o,e,i),l=s.legendHeight;i.legendHeight=l;var h=calYAxisData(o,e,i),c=h.yAxisWidth;if(i.yAxisWidth=c,r&&r.length){var d=calCategoriesData(r,e,i),x=d.xAxisHeight,f=d.angle;i.xAxisHeight=x,i._xAxisTextAngle_=f}"pie"!==t&&"ring"!==t||(i._pieTextMaxLength_=e.dataLabel===!1?0:getPieTextMaxLength(o));var g=e.animation?1e3:0;switch(this.animationInstance&&this.animationInstance.stop(),t){case"line":this.animationInstance=new Animation({timing:"easeIn",duration:g,onProcess:function(t){drawYAxis(o,e,i,n),drawXAxis(r,e,i,n);var s=drawLineDataPoints(o,e,i,n,t),l=s.xAxisPoints,h=s.calPoints;a.chartData.xAxisPoints=l,a.chartData.calPoints=h,drawLegend(e.series,e,i,n),drawCanvas(e,n)},onAnimationFinish:function(){a.event.trigger("renderComplete")}});break;case"column":this.animationInstance=new Animation({timing:"easeIn",duration:g,onProcess:function(t){drawYAxis(o,e,i,n),drawXAxis(r,e,i,n),a.chartData.xAxisPoints=drawColumnDataPoints(o,e,i,n,t),drawLegend(e.series,e,i,n),drawCanvas(e,n)},onAnimationFinish:function(){a.event.trigger("renderComplete")}});break;case"area":this.animationInstance=new Animation({timing:"easeIn",duration:g,onProcess:function(t){drawYAxis(o,e,i,n),drawXAxis(r,e,i,n);var s=drawAreaDataPoints(o,e,i,n,t),l=s.xAxisPoints,h=s.calPoints;a.chartData.xAxisPoints=l,a.chartData.calPoints=h,drawLegend(e.series,e,i,n),drawCanvas(e,n)},onAnimationFinish:function(){a.event.trigger("renderComplete")}});break;case"ring":case"pie":this.animationInstance=new Animation({timing:"easeInOut",duration:g,onProcess:function(t){a.chartData.pieData=drawPieDataPoints(o,e,i,n,t),drawLegend(e.series,e,i,n),drawCanvas(e,n)},onAnimationFinish:function(){a.event.trigger("renderComplete")}})}}function Event(){this.events={}}var config={yAxisWidth:15,yAxisSplit:5,xAxisHeight:15,xAxisLineHeight:15,legendHeight:15,yAxisTitleWidth:15,padding:12,columePadding:3,fontSize:10,dataPointShape:["diamond","circle","triangle","rect"],colors:["#7cb5ec","#f7a35c","#434348","#90ed7d","#f15c80","#8085e9"],pieChartLinePadding:25,pieChartTextPadding:15,xAxisTextPadding:3,titleColor:"#333333",titleFontSize:20,subtitleColor:"#999999",subtitleFontSize:15,toolTipPadding:3,toolTipBackground:"#000000",toolTipOpacity:.7,toolTipLineHeight:14},util={toFixed:function(t,e){return e=e||2,this.isFloat(t)&&(t=t.toFixed(e)),t},isFloat:function(t){return t%1!==0},isSameSign:function(t,e){return Math.abs(t)===t&&Math.abs(e)===e||Math.abs(t)!==t&&Math.abs(e)!==e},isSameXCoordinateArea:function(t,e){return this.isSameSign(t.x,e.x)},isCollision:function(t,e){t.end={},t.end.x=t.start.x+t.width,t.end.y=t.start.y-t.height,e.end={},e.end.x=e.start.x+e.width,e.end.y=e.start.y-e.height;var i=e.start.x>t.end.x||e.end.x<t.start.x||e.end.y>t.start.y||e.start.y<t.end.y;return!i}},Timing={easeIn:function(t){return Math.pow(t,3)},easeOut:function(t){return Math.pow(t-1,3)+1},easeInOut:function(t){return(t/=.5)<1?.5*Math.pow(t,3):.5*(Math.pow(t-2,3)+2)},linear:function(t){return t}};Animation.prototype.stop=function(){this.isStop=!0},Event.prototype.addEventListener=function(t,e){this.events[t]=this.events[t]||[],this.events[t].push(e)},Event.prototype.trigger=function(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];var n=e[0],a=e.slice(1);this.events[n]&&this.events[n].forEach(function(t){try{t.apply(null,a)}catch(t){console.error(t)}})};var Charts=function(t){t.title=t.title||{},t.subtitle=t.subtitle||{},t.yAxis=t.yAxis||{},t.xAxis=t.xAxis||{},t.extra=t.extra||{},t.legend=t.legend!==!1,t.animation=t.animation!==!1;var e=assign({},config);e.yAxisTitleWidth=t.yAxis.disabled!==!0&&t.yAxis.title?e.yAxisTitleWidth:0,e.pieChartLinePadding=t.dataLabel===!1?0:e.pieChartLinePadding,e.pieChartTextPadding=t.dataLabel===!1?0:e.pieChartTextPadding,this.opts=t,this.config=e,this.context=wx.createCanvasContext(t.canvasId),this.chartData={},this.event=new Event,drawCharts.call(this,t.type,t,e,this.context)};Charts.prototype.updateData=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.opts.series=t.series||this.opts.series,this.opts.categories=t.categories||this.opts.categories,this.opts.title=assign({},this.opts.title,t.title||{}),this.opts.subtitle=assign({},this.opts.subtitle,t.subtitle||{}),drawCharts.call(this,this.opts.type,this.opts,this.config,this.context)},Charts.prototype.stopAnimation=function(){this.animationInstance&&this.animationInstance.stop()},Charts.prototype.addEventListener=function(t,e){this.event.addEventListener(t,e)},Charts.prototype.getCurrentDataIndex=function(t){if(t.touches&&t.touches.length){var e=t.touches[0],i=e.x,n=e.y;return"pie"===this.opts.type||"ring"===this.opts.type?findPieChartCurrentIndex({x:i,y:n},this.chartData.pieData):findCurrentIndex({x:i,y:n},this.chartData.xAxisPoints,this.opts,this.config)}return-1},Charts.prototype.showToolTip=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if("line"===this.opts.type||"area"===this.opts.type){var i=this.getCurrentDataIndex(t),n=assign({},this.opts,{animation:!1});if(i>-1){var a=getSeriesDataItem(this.opts.series,i);if(0===a.length)drawCharts.call(this,n.type,n,this.config,this.context);else{var o=getToolTipData(a,this.chartData.calPoints,i),r=o.textList,s=o.offset;n.tooltip={textList:r,offset:s,option:e},drawCharts.call(this,n.type,n,this.config,this.context)}}else drawCharts.call(this,n.type,n,this.config,this.context)}},module.exports=Charts;
