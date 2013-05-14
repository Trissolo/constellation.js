// Constellation.js 0.2.0
// (c) 2011-2013 Greg MacWilliam
// Freely distributed under the MIT license
// Docs: https://github.com/gmac/constellation.js
(function(t,n){var i=n(Math.sqrt,Math.min,Math.max,Math.abs);"undefined"!=typeof exports?module.exports=i:"function"==typeof define&&define.amd?define(i):t.Const=i})(this,function(t,n,i,e){function o(t){return t instanceof Array}function s(t){return"function"==typeof t}function r(t){return Array.prototype.slice.call(t)}var h={},u=h.utils={size:function(t){if(o(t))return t.length;var n=0;for(var i in t)t.hasOwnProperty(i)&&n++;return n},contains:function(t,n){if(o(t)){if(s(Array.prototype.indexOf))return t.indexOf(n)>=0;for(var i=t.length,e=0;i>e;)if(t[e++]===n)return!0}return t&&t.hasOwnProperty(n)},each:function(t,n,i){var e=0;if(o(t))for(var s=t.length;s>e;)n.call(i,t[e],e++);else for(e in t)t.hasOwnProperty(e)&&n.call(i,t[e],e);return t},map:function(t,n,i){var e=0;if(o(t))for(var s=t.length;s>e;)t[e]=n.call(i,t[e],e++);else for(e in t)t.hasOwnProperty(e)&&(t[e]=n.call(i,t[e],e));return t},all:function(t,n,i){for(var e=t.length,o=0;e>o;)if(!n.call(i,t[o],o++))return!1;return!0},toArray:function(t){var n=[];for(var i in t)t.hasOwnProperty(i)&&n.push(t[i]);return n}},a=h.Point=function(t,n){this.x=t||0,this.y=n||0},d=h.Rect=function(t,n,i,e){this.x=t||0,this.y=n||0,this.width=i||0,this.height=e||0};h.distance=function(n,i){var e=i.x-n.x,o=i.y-n.y;return t(e*e+o*o)},h.ccw=function(t,n,i,e){return e?(i.y-t.y)*(n.x-t.x)>(n.y-t.y)*(i.x-t.x):(i.y-t.y)*(n.x-t.x)>=(n.y-t.y)*(i.x-t.x)},h.intersect=function(t,n,i,e){return h.ccw(t,i,e)!==h.ccw(n,i,e)&&h.ccw(t,n,i)!==h.ccw(t,n,e)},h.degreesToRadians=function(t){return t*Math.PI/180},h.radiansToDegrees=function(t){return 180*t/Math.PI},h.angleRadians=function(t,n){return Math.atan2(n.y-t.y,n.x-t.x)},h.angleDegrees=function(t,n){var i=h.radiansToDegrees(h.angleRadians(t,n));return 0>i?i+360:i},h.angleSector=function(t,n,i){var e=2*Math.PI;return n=n||8,i=i||e/(2*n),0>t&&(t=e+t),t+=i,t>e&&(t-=e),Math.floor(t/(e/n))},h.getRectForPointRing=function(t){var e=t[0],o=e.x,s=e.x,r=e.y,h=e.y;return u.each(t,function(t){o=n(o,t.x),s=i(s,t.x),r=n(r,t.y),h=i(h,t.y)}),new d(o,r,s-o,h-r)},h.hitTestRect=function(t,e){var o=n(e.x,e.x+e.width),s=i(e.x,e.x+e.width),r=n(e.y,e.y+e.height),h=i(e.y,e.y+e.height);return t.x>=o&&t.y>=r&&s>=t.x&&h>=t.y},h.hitTestPointRing=function(t,i){for(var e,o,s=i.length,r=new a(0,t.y),h=0,u=0;s>u;)e=i[u],o=i[(u+1)%s],r.x=n(r.x,n(e.x,o.x)-1),h+=this.intersect(r,t,e,o)?1:0,u++;return h%2>0},h.snapPointToLineSegment=function(t,n,i){var e=t.x-n.x,o=t.y-n.y,s=i.x-n.x,r=i.y-n.y,h=s*s+r*r,u=e*s+o*r,d=u/h;return 0>d?new a(n.x,n.y):d>1?new a(i.x,i.y):new a(n.x+s*d,n.y+r*d)},h.getNearestPointToPoint=function(t,n){var i,o,s=null,r=0/0,u=n.length-1;for(n.sort(function(n,i){return n=e(t.x-n.x),i=e(t.x-i.x),i-n});u>=0&&(i=n[u--],r>e(t.x-i.x)||isNaN(r));)o=h.distance(t,i),(r>o||isNaN(r))&&(s=i,r=o);return s};var c=h.Node=function(t,n,i,e,o){this.id=t,this.x=n||0,this.y=i||0,this.to=o||{},this.data=e||null},f=h.Polygon=function(t,n,i){this.id=t,this.nodes=n.slice(),this.data=i||null},l=h.Path=function(t,n,i){this.nodes=t||[],this.weight=n||0,this.estimate=i||0};l.prototype={copy:function(t,n){return new l(this.nodes.slice(),t||this.weight,n||this.estimate)},last:function(){return this.nodes[this.nodes.length-1]},contains:function(t){return u.contains(t)},prioratize:function(t,n){return n.estimate-t.estimate},dispose:function(){this.nodes.length=0,this.nodes=null}};var y=h.Grid=function(t){this.reset(t)};return y.prototype={nodes:{},polys:{},_i:0,toJSON:function(){return{nodes:this.nodes,polys:this.polys,i:this._i}},reset:function(t){this.nodes={},this.polys={},this._i=0,t&&(t.i&&(this._i=t.i),u.each(t.nodes||{},function(t){this.nodes[t.id]=t},this),u.each(t.polys||{},function(t){this.polys[t.id]=t},this))},addNode:function(t,n,i){"object"==typeof t&&(i=t,t=0);var e=new c(i&&i.id||"n"+this._i++,t,n,i);return this.nodes[e.id]=e,e},getNodeById:function(t){return this.nodes.hasOwnProperty(t)?this.nodes[t]:null},getNodes:function(t,n){return(!o(t)||n)&&(t=r(arguments)),u.map(t.slice(),function(t){return this.getNodeById(t)},this)},getNumNodes:function(){return u.size(this.nodes)},hasNodes:function(t,n){return(!o(t)||n)&&(t=r(arguments)),u.all(t,function(t){return this.nodes.hasOwnProperty(t)},this)},joinNodes:function(t,n){(!o(t)||n)&&(t=r(arguments));var i=!1;return t.length>1&&this.hasNodes(t)&&u.each(t,function(n){for(var e=this.nodes[n],o=t.length,s=0;o>s;)n=t[s++],n!==e.id&&(e.to[n]=1,i=!0)},this),i},splitNodes:function(t,n){if((!o(t)||n)&&(t=r(arguments)),2>t.length)return this.detachNodes(t);var i=!1;return u.each(t,function(n){var e=this.nodes[n];if(e&&e.to)for(n in e.to)u.contains(t,n)&&(delete e.to[n],i=!0)},this),i},detachNodes:function(t,n){(!o(t)||n)&&(t=r(arguments));var i=!1;return u.each(t,function(t){var n,e,o=this.nodes[t];if(o&&o.to){for(e in o.to)delete o.to[e],n=this.nodes[e],n&&n.to&&delete n.to[t];i=!0}},this),i},removeNodes:function(t,n){(!o(t)||n)&&(t=r(arguments));var i=this.detachNodes(t);return u.each(t,function(t){var n,e;if(this.nodes.hasOwnProperty(t)){delete this.nodes[t];for(e in this.polys)n=this.polys[e],n&&u.contains(n.nodes,t)&&delete this.polys[e];i=!0}},this),i},addPolygon:function(t,n){if(t.length>=3&&this.hasNodes(t)){var i=new f("p"+this._i++,t,n);return this.polys[i.id]=i,i}return null},getPolygonById:function(t){return this.polys.hasOwnProperty(t)?this.polys[t]:null},getPolygons:function(t,n){return(!o(t)||n)&&(t=r(arguments)),u.map(t.slice(),function(t){return this.getPolygonById(t)},this)},getNodesForPolygon:function(t){return this.polys.hasOwnProperty(t)?u.map(this.polys[t].nodes.slice(),function(t){return this.nodes[t]},this):null},getNumPolygons:function(){return u.size(this.polys)},removePolygons:function(t,n){(!o(t)||n)&&(t=r(arguments));var i=!1;return u.each(t,function(t){this.polys.hasOwnProperty(t)&&(delete this.polys[t],i=!0)},this),i},findPath:function(t,n,i,e){var o,r,u,a,d,c,f,y=[],g={},p=this.getNodeById(t),P=this.getNodeById(n),v=0;for(s(i)||(i=h.distance),s(e)||(e=h.distance),y.push(new l([p],i(p,p)));y.length>0;){r=y.pop(),p=r.last();for(f in p.to)p.to.hasOwnProperty(f)&&(u=this.nodes[f],u&&!r.contains(u)&&(d=r.weight+i(p,u),(g[u.id]||d)>=d&&(g[u.id]=d,c=d+e(u,P),(!o||o.weight>c)&&(a=r.copy(d,c),a.nodes.push(u),u.id===P.id?(o&&o.dispose(),o=a):y.push(a),a=null))),u=null);r.dispose(),r=p=null,y.sort(l.prototype.prioratize),v++}return y=g=P=null,{valid:!!o,weight:o?o.weight:0,cycles:v,nodes:o?o.nodes:[]}},findPathWithFewestNodes:function(t,n){var i=function(){return 1};return this.findPath(t,n,i,i)},snapPointToGrid:function(t){var n=null,i=0/0,e=[],o={};return u.each(this.nodes,function(s,r){if(t.id!==r)for(var u in s.to)if(s.to.hasOwnProperty(u)&&!o.hasOwnProperty(u+" "+s.id)){var a=this.nodes[u],d=h.snapPointToLineSegment(t,s,a),c=h.distance(t,d);o[s.id+" "+a.id]=!0,(!n||i>c)&&(n=d,i=c,e[0]=s.id,e[1]=a.id)}},this),{point:n,offset:i,segment:e}},snapPoint:function(t){var n=this.snapPointToGrid(t);return n.point||t},getNearestNodeToNode:function(t){var n=[],i=this.getNodeById(t);return i?(u.each(this.nodes,function(t){t.id!==i.id&&n.push(t)},this),h.getNearestPointToPoint(i,n)):null},getNearestNodeToPoint:function(t){return h.getNearestPointToPoint(t,u.toArray(this.nodes))},hitTestPointInPolygons:function(t){for(var n in this.polys)if(this.polys.hasOwnProperty(n)&&h.hitTestPointRing(t,this.getNodesForPolygon(n)))return!0;return!1},getPolygonHitsForPoint:function(t){var n=[];return u.each(this.polys,function(i,e){h.hitTestPointRing(t,this.getNodesForPolygon(e))&&n.push(i.id)},this),n},getNodesInPolygon:function(t){var n=[],i=this.getPolygonById(t),e=this.getNodesForPolygon(t),o=h.getRectForPointRing(e);return i&&u.each(this.nodes,function(t){(u.contains(i.nodes,t.id)||h.hitTestRect(t,o)&&h.hitTestPointRing(t,e))&&n.push(t.id)},this),n},getNodesInRect:function(t){var n=[];return u.each(this.nodes,function(i){h.hitTestRect(i,t)&&n.push(i.id)},this),n},bridgePoints:function(t,n,i){function e(t,n){var i,e=this.addNode(t.x,t.y);if(n.length)for(i in n){var o=this.getPolygonById(n[i]).nodes;for(var s in o)this.joinNodes(e.id,o[s])}else{var r=this.snapPointToGrid(t);if(r.point){e.x=r.point.x,e.y=r.point.y;for(i in r.segment)this.joinNodes(e.id,r.segment[i])}}return e.id}var o=this.getPolygonHitsForPoint(t),s=this.getPolygonHitsForPoint(n);if(o.length&&s.length){for(var r=[],h=o.length-1;h>=0;)u.contains(s,o[h])&&r.push(o[h]),h--;if(r.length)return[t,i?this.snapPoint(n):n]}var a=e.call(this,t,o),d=e.call(this,n,s),c=this.findPath(a,d);return this.removeNodes(a,d),c.valid?(c=c.nodes,c.unshift(t),c.push(n),c):[]}},h});