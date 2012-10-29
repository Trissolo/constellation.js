define(["lib/backbone","lib/constellation","mod/grid-model","mod/grid-selection-model"],function(e,t,n,r){var i=e.Model.extend({ALERT:"alert",nodeOpsEnabled:function(){return r.type===n.types.NODE},joinNodes:function(){this.nodeOpsEnabled()?n.joinNodes(r.items):this.alert("Please select two or more nodes.")},splitNodes:function(){this.nodeOpsEnabled()?n.splitNodes(r.items):this.alert("Please select two or more nodes.")},makePolygon:function(){this.nodeOpsEnabled()?n.addPolygon(r.items):this.alert("Please select two or more nodes.")},deleteGeometry:function(){this.nodeOpsEnabled()?n.removeNodes(r.items):n.removePolygons(r.items),r.deselectAll()},runPathfinder:function(){if(this.nodeOpsEnabled()&&r.selectionSize()===2){var e=n.findPath(r.items[0],r.items[1]);console.log(e)}else this.alert("Please select exactly two nodes.")},snapNodeToGrid:function(){if(this.nodeOpsEnabled()&&r.selectionSize()===1){var e=n.getNodeById(r.items[0]),t=n.snapPointToGrid(e);e.x=t.x,e.y=t.y,n.update()}else this.alert("Please select exactly one node.")},selectNearestGridNode:function(){if(this.nodeOpsEnabled()&&r.selectionSize()===1){var e=n.getNearestNodeToNode(r.items[0]);r.select(e.id)}else this.alert("Please select exactly one node.")},hitTestNodeInPolygons:function(){if(this.nodeOpsEnabled()&&r.selectionSize()===1){var e=n.getNodeById(r.items[0]),t=n.getPolygonHitsForPoint(e);t.length&&r.setSelection(t)}else this.alert("Please select exactly one node.")},alert:function(e){this.trigger(this.ALERT,e)}});return new i})