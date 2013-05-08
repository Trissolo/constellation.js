define([
	'../../constellation',
	'../../src/js/lib/underscore'
],
function( Const, _ ) {

	describe("Constellation Grid", function() {
		
		// Environment config...
		var gridModel = new Const.Grid();
		var n0 = 'n0';
		var n1 = 'n1';
		var n2 = 'n2';
			
		function numConnections( id ) {
			return _.size( gridModel.getNodeById( id ).to );
		}

		function getConnection( a, b ) {
			return gridModel.getNodeById( a ).to[ b ];
		}
		
		// Setup
		beforeEach(function() {
			gridModel.reset();
		});
		
		// Teardown
		afterEach(function() {
			// do nothing.
		});
		
		it("addNode: should add a new node with specified X and Y coordinates, and return it.", function() {
			var x = 55;
			var y = 71;
			var id = gridModel.addNode(x, y).id;
			
			// Check that an ID was returned.
			expect( id ).toBeTruthy();
			
			// Check that a node was added.
			expect( gridModel.getNumNodes() ).toBe(1);
			
			// Check that its coordinates are set.
			expect( gridModel.getNodeById(id).x ).toBe(x);
			expect( gridModel.getNodeById(id).y ).toBe(y);
		});
		
		it("addNode: should add a new node without specified coordinates, which defaults to point [0,0].", function() {
			var id = gridModel.addNode().id;
			
			// One node should have been added.
			expect( gridModel.getNumNodes() ).toBe(1);
			
			// Its X and Y coordinates should default to zero.
			expect( gridModel.getNodeById(id).x ).toBe(0);
			expect( gridModel.getNodeById(id).y ).toBe(0);
		});
		
		it("getNodeById: should get a single node by id reference.", function() {
			var node = gridModel.addNode();
			var fetch = gridModel.getNodeById(node.id);
			expect(fetch).toBe(node);
		});
		
		it("getNodesForIds: should get an array of nodes for each provided id argument.", function() {
			var a = gridModel.addNode();
			var b = gridModel.addNode();
			var fetch = gridModel.getNodes(a.id, b.id);
				
			expect(fetch[0]).toBe(a);
			expect(fetch[1]).toBe(b);
		});
		
		it("getNodesForIds: should get an array of nodes for an array of id references.", function() {
			var a = gridModel.addNode();
			var b = gridModel.addNode();
			var fetch = gridModel.getNodes([a.id, b.id]);
				
			expect(fetch[0]).toBe(a);
			expect(fetch[1]).toBe(b);
		});
		
		it("hasNodes: should validate that multiple node id arguments are defined.", function() {
			var a = gridModel.addNode();
			var b = gridModel.addNode();
			var found = gridModel.hasNodes(a.id, b.id);
			expect(found).toBeTruthy();
		});
		
		it("hasNodes: should validate that an array of node ids are defined.", function() {
			var a = gridModel.addNode();
			var b = gridModel.addNode();
			var found = gridModel.hasNodes([a.id, b.id]);
			expect(found).toBeTruthy();
		});
		
		it("joinNodes: should join multiple node ids, provided as arguments.", function() {
			var a = gridModel.addNode(0, 0).id;
			var b = gridModel.addNode(100, 100).id;
			
			gridModel.joinNodes(a, b);
			
			// Each node should have one connection.
			expect( numConnections(a) ).toBe(1);
			expect( numConnections(b) ).toBe(1);
			
			// Each node should have a reference to one another.
			expect( getConnection(a, b) ).toBeTruthy();
			expect( getConnection(b, a) ).toBeTruthy();
		});
		
		it("joinNodes: should join multiple node ids, provided as an array.", function() {
			var a = gridModel.addNode(0, 0).id;
			var b = gridModel.addNode(100, 100).id;
			
			gridModel.joinNodes([a, b]);
			
			// Each node should have one connection.
			expect( numConnections(a) ).toBe(1);
			expect( numConnections(b) ).toBe(1);
			
			// Each node should have a reference to one another.
			expect( getConnection(a, b) ).toBeTruthy();
			expect( getConnection(b, a) ).toBeTruthy();
		});
		
		it("joinNodes: should join multiple node ids, creating connections between all references.", function() {
			var a = gridModel.addNode(0, 0).id;
			var b = gridModel.addNode(100, 100).id;
			var c = gridModel.addNode(100, 200).id;
				
			gridModel.joinNodes(a, b, c);
			
			// Each node should now have two connections:
			_.each(gridModel.nodes, function(node) {
				expect(numConnections(node.id)).toBe(2);
			});
		});
		
		it("joinNodes: should defer action when joining less than two nodes.", function() {
			var id = gridModel.addNode().id;
			
			gridModel.joinNodes(id); // << takes no action.
			gridModel.joinNodes([id]); // << takes no action.
			
			// Expect no connections to have been made.
			expect( numConnections(id) ).toBe(0);
		});
		
		it("joinNodes: should defer action when joining a group with invalid node references.", function() {
			var valid = gridModel.addNode().id;
			gridModel.joinNodes(valid, 'invalid'); // << takes no action.
			gridModel.joinNodes([valid, 'invalid']); // << takes no action.
			
			expect( numConnections(valid) ).toBe(0);
		});
		
		it("splitNodes: should split multiple connected node ids, provided as arguments.", function() {
			var a = gridModel.addNode(0, 0).id;
			var b = gridModel.addNode(100, 100).id;
			var c = gridModel.addNode(100, 200).id;
			gridModel.joinNodes(a, b, c);
			
			// Exclude last node, then split the other two.
			gridModel.splitNodes(a, b);
			
			// First two nodes should now have one connection, third node should still have two.
			expect( numConnections(a) ).toBe(1);
			expect( numConnections(b) ).toBe(1);
			expect( numConnections(c) ).toBe(2);
			
			// Remaining connection on the first two nodes should be to the third.
			expect( getConnection(a, c) ).toBeTruthy();
			expect( getConnection(a, c) ).toBeTruthy();
		});
		
		it("splitNodes: should split multiple connected node ids, provided as an array.", function() {
			var a = gridModel.addNode(0, 0).id;
			var b = gridModel.addNode(100, 100).id;
			var c = gridModel.addNode(100, 200).id;
			gridModel.joinNodes([a, b, c]);
			
			// Exclude last node, then split the other two.
			gridModel.splitNodes([a, b]);
			
			// First two nodes should now have one connection, third node should still have two.
			expect( numConnections(a) ).toBe(1);
			expect( numConnections(b) ).toBe(1);
			expect( numConnections(c) ).toBe(2);
			
			// Remaining connection on the first two nodes should be to the third.
			expect( getConnection(a, c) ).toBeTruthy();
			expect( getConnection(a, c) ).toBeTruthy();
		});
		
		it("splitNodes: should defer action when splitting unconnected nodes.", function() {
			var a = gridModel.addNode(0, 0).id;
			var b = gridModel.addNode(100, 100).id;
			var c = gridModel.addNode(100, 200).id;
			
			// Join two nodes.
			gridModel.joinNodes(a, b);
				
			function testNumConnections() {
				expect( numConnections(a) ).toBe(1);
				expect( numConnections(b) ).toBe(1);
				expect( numConnections(c) ).toBe(0);
			}
				
			testNumConnections();
			gridModel.splitNodes(a, c); // << takes no action.
			testNumConnections();
		});
		
		it("splitNodes: should completely detach a single node from all connections while splitting.", function() {
			var a = gridModel.addNode(0, 0).id;
			var b = gridModel.addNode(100, 100).id; 
			var c = gridModel.addNode(100, 200).id;
			gridModel.joinNodes(a, b, c);
			gridModel.splitNodes(a);
			
			expect( numConnections(a) ).toBe(0);
			expect( numConnections(b) ).toBe(1);
			expect( numConnections(c) ).toBe(1);
		});
		
		it("detachNodes: should detach all connections from a group of node ids, provided as arguments.", function() {
			var a = gridModel.addNode(0, 0).id;
			var b = gridModel.addNode(100, 100).id;
			var c = gridModel.addNode(100, 200).id;
			var d = gridModel.addNode(100, 200).id;
			gridModel.joinNodes(a, b, c, d);
			gridModel.detachNodes(a, b);
			
			expect( numConnections(a) ).toBe(0);
			expect( numConnections(b) ).toBe(0);
			expect( numConnections(c) ).toBe(1);
			expect( numConnections(d) ).toBe(1);
		});
		
		it("detachNodes: should detach all connections from a group of node ids, provided as an array.", function() {
			var a = gridModel.addNode().id;
			var b = gridModel.addNode().id;
			var c = gridModel.addNode().id;
			var d = gridModel.addNode().id;
			gridModel.joinNodes([a, b, c, d]);
			gridModel.detachNodes([a, b]);
			
			expect( numConnections(a) ).toBe(0);
			expect( numConnections(b) ).toBe(0);
			expect( numConnections(c) ).toBe(1);
			expect( numConnections(d) ).toBe(1);
		});
		
		it("removeNodes: should remove a group of node ids, provided as arguments.", function() {
			var a = gridModel.addNode().id;
			var b = gridModel.addNode().id;
			var c = gridModel.addNode().id;
			
			// Expect two nodes in the model.
			expect( gridModel.getNumNodes() ).toBe(3);
			
			// Remove node A, and a second invalid reference.
			gridModel.removeNodes(a, b);
			
			// Expect A to have been removed, and the invalid reference to have been ignored.
			expect( gridModel.getNumNodes() ).toBe(1);
			expect( gridModel.nodes[c] ).toBeTruthy();
		});
		
		it("removeNodes: should remove a group of node ids, provided as an array.", function() {
			var a = gridModel.addNode().id;
			var b = gridModel.addNode().id;
			var c = gridModel.addNode().id;
			
			// Expect two nodes in the model.
			expect( gridModel.getNumNodes() ).toBe(3);
			
			// Remove node A, and a second invalid reference.
			gridModel.removeNodes([a, b]);
			
			// Expect A to have been removed, and the invalid reference to have been ignored.
			expect( gridModel.getNumNodes() ).toBe(1);
			expect( gridModel.nodes[c] ).toBeTruthy();
		});
		
		it("removeNodes: should detach connections while removing nodes.", function() {
			var a = gridModel.addNode().id;
			var b = gridModel.addNode().id;
			var c = gridModel.addNode().id;
			var d = gridModel.addNode().id;
			
			// Expect four nodes in the model.
			expect( gridModel.getNumNodes() ).toBe(4);
			
			// Join all nodes, then confirm they each have three connections.
			gridModel.joinNodes(a, b, c, d);
			
			// Remove nodes A and B.
			gridModel.removeNodes(a, b);
			
			// Confirm that there are now two nodes, each now with only one connection.
			expect( gridModel.getNumNodes() ).toBe(2);
			expect( numConnections(c) ).toBe(1);
			expect( numConnections(d) ).toBe(1);
			
			// Confirm that C and D are still connected to one another.
			expect( getConnection(c, d) ).toBeTruthy();
			expect( getConnection(d, c) ).toBeTruthy();
		});
		
		it("removeNodes: should defer action when removing an invalid node reference.", function() {
			var a = gridModel.addNode().id;
			var b = gridModel.addNode().id;
			
			// Expect two nodes in the model.
			expect( gridModel.getNumNodes() ).toBe(2);
			
			// Remove node A, and a second invalid reference.
			gridModel.removeNodes(a, 'invalid');
			
			// Expect A to have been removed, and the invalid reference to have been ignored.
			expect( gridModel.getNumNodes() ).toBe(1);
		});
		
		it("removeNodes: should remove all dependent polygons while removing a node.", function() {
			var a = gridModel.addNode().id;
			var b = gridModel.addNode().id;
			var c = gridModel.addNode().id;
			var p = gridModel.addPolygon([a, b, c]);
			
			// Expect a polygon to have been created:
			expect( gridModel.getNumPolygons() ).toBe(1);
			
			// Remove nodes from polygon:
			gridModel.removeNodes(a, b);
			
			// Expect polygon to have been removed:
			expect( gridModel.getNumPolygons() ).toBe(0);
		});
		
		it("addPolygon: should create a polygon from a group of nodes, and return it.", function() {
			var a = gridModel.addNode().id;
			var b = gridModel.addNode().id;
			var c = gridModel.addNode().id;
			var p = gridModel.addPolygon([a, b, c]);

			expect( gridModel.getNumPolygons() ).toBe(1);
			expect( p.nodes.length ).toBe(3);
		});
		
		it("addPolygon: should defer action when creating a polygon with less than three nodes.", function() {
			var a = gridModel.addNode().id;
			var b = gridModel.addNode().id;
			var p = gridModel.addPolygon([a, b]); // << takes no action.

			expect( p ).toBeFalsy();
			expect( gridModel.getNumPolygons() ).toBe(0);
		});
		
		it("addPolygon: should defer action when creating a polygon with an invalid node reference.", function() {
			var a = gridModel.addNode().id;
			var b = gridModel.addNode().id;
			var p = gridModel.addPolygon( [a, b, 'sfoo'] ); // << takes no action.

			expect( p ).toBeFalsy();
			expect( gridModel.getNumPolygons() ).toBe(0);
		});
		
		it("getPolygonById: should get a single polygon by id reference.", function() {
			var a = gridModel.addNode().id;
			var b = gridModel.addNode().id;
			var c = gridModel.addNode().id;
			var p = gridModel.addPolygon( [a, b, c] );
			
			expect( gridModel.getPolygonById(p.id) ).toBe( p );
		});
		
		it("getNodesForPolygon: should get an array of nodes for a polygon reference.", function() {
			var a = gridModel.addNode();
			var b = gridModel.addNode();
			var c = gridModel.addNode();
			var p = gridModel.addPolygon( [a.id, b.id, c.id] ).id;
			var nodes = gridModel.getNodesForPolygon(p);
				
			expect( nodes[0] ).toBe( a );
			expect( nodes[1] ).toBe( b );
			expect( nodes[2] ).toBe( c );
		});
		
		it("removePolygons: should remove multiple polygon ids, provided as arguments.", function() {
			var a = gridModel.addNode().id;
			var b = gridModel.addNode().id;
			var c = gridModel.addNode().id;
			var p1 = gridModel.addPolygon([a, b, c]).id;
			var p2 = gridModel.addPolygon([a, b, c]).id;
			
			
			expect( gridModel.getNumPolygons() ).toBe(2);
			gridModel.removePolygons( p1, p2 );
			expect( gridModel.getNumPolygons() ).toBe(0);
		});
		
		it("removePolygons: should remove multiple valid polygon ids, provided as an array.", function() {
			var a = gridModel.addNode().id;
			var b = gridModel.addNode().id;
			var c = gridModel.addNode().id;
			var p1 = gridModel.addPolygon([a, b, c]).id;
			var p2 = gridModel.addPolygon([a, b, c]).id;
			
			
			expect( gridModel.getNumPolygons() ).toBe(2);
			gridModel.removePolygons([p1, p2]);
			expect( gridModel.getNumPolygons() ).toBe(0);
		});
		
		it("removePolygons: should defer action when removing an invalid polygon reference.", function() {
			var a = gridModel.addNode().id;
			var b = gridModel.addNode().id;
			var c = gridModel.addNode().id;
			var p1 = gridModel.addPolygon([a, b, c]).id;
			var p2 = gridModel.addPolygon([a, b, c]).id;
				
			expect( gridModel.getNumPolygons() ).toBe(2);
			gridModel.removePolygons(p1, 'invalid');
			expect( gridModel.getNumPolygons() ).toBe(1);
		});
		
		it("findPath: should find a path between two joined nodes.", function() {
			var a = gridModel.addNode(0, 0);
			var b = gridModel.addNode(0, 100);
			gridModel.joinNodes(a.id, b.id);
			
			var result = gridModel.findPath(a.id, b.id);
			
			expect( result.valid ).toBeTruthy();
			expect( result.nodes[0] ).toBe( a );
			expect( result.nodes[1] ).toBe( b );
		});
		
		it("findPath: should find a path between two nodes across a network of joined nodes.", function() {
			var a = gridModel.addNode(0, 0);
			var b = gridModel.addNode(0, 100);
			var c = gridModel.addNode(0, 200);
				
			gridModel.joinNodes(a.id, b.id);
			gridModel.joinNodes(b.id, c.id);
			var result = gridModel.findPath(a.id, c.id);
			
			expect( result.valid ).toBeTruthy();
			expect( result.nodes[0] ).toBe( a );
			expect( result.nodes[1] ).toBe( b );
			expect( result.nodes[2] ).toBe( c );
		});
		
		it("findPath: should fail to find a path between two nodes in unconnected grid fragments.", function() {
			var a = gridModel.addNode(0, 0);
			var b = gridModel.addNode(0, 100);
			var c = gridModel.addNode(0, 200);
			gridModel.joinNodes(a.id, b.id);
			
			var result = gridModel.findPath(a.id, c.id);
			
			expect( result.valid ).toBeFalsy();
			expect( result.nodes.length ).toBe( 0 );
		});
		
		it("findPath: should find the shortest path between two nodes by default, regardless of connection count.", function() {
			var a = gridModel.addNode(0, 0).id;
			var b = gridModel.addNode(25, 0).id;
			var c = gridModel.addNode(75, 0).id;
			var d = gridModel.addNode(100, 0).id;
			var e = gridModel.addNode(50, 100).id;
				
			gridModel.joinNodes(a, b);
			gridModel.joinNodes(b, c);
			gridModel.joinNodes(c, d);
			gridModel.joinNodes(a, e);
			gridModel.joinNodes(e, d);
			
			var result = gridModel.findPath(a, d);

			expect( result.valid ).toBeTruthy();
			expect( result.weight ).toBe( 100 );
			expect( result.nodes.length ).toBe( 4 );
		});
		
		it("findPath: should allow custom grid searches using weighting, estimating, and prioratizing functions.", function() {
			var a = gridModel.addNode(0, 0, {weight: 2}).id;
			var b = gridModel.addNode(25, 0, {weight: 3}).id;
			var c = gridModel.addNode(75, 0, {weight: 3}).id;
			var d = gridModel.addNode(100, 0, {weight: 2}).id;
			var e = gridModel.addNode(50, 100, {weight: 2}).id;
				
			gridModel.joinNodes(a, b);
			gridModel.joinNodes(b, c);
			gridModel.joinNodes(c, d);
			gridModel.joinNodes(a, e);
			gridModel.joinNodes(e, d);
			
			var result = gridModel.findPath(a, d, function( lastNode, currentNode ) {
				return currentNode.data.weight;
			}, function( currentNode, goalNode ) {
				return goalNode.data.weight;
			});

			expect( result.valid ).toBeTruthy();
			expect( result.weight ).toBe( 6 );
			expect( result.nodes.length ).toBe( 3 );
		});
		
		it("findPathWithFewestNodes: should find a path between two points with the fewest possible nodes connections.", function() {
			var a = gridModel.addNode(0, 0).id;
			var b = gridModel.addNode(25, 0).id;
			var c = gridModel.addNode(75, 0).id;
			var d = gridModel.addNode(100, 0).id;
			var e = gridModel.addNode(50, 100).id;
				
			gridModel.joinNodes(a, b);
			gridModel.joinNodes(b, c);
			gridModel.joinNodes(c, d);
			gridModel.joinNodes(a, e);
			gridModel.joinNodes(e, d);
			
			var result = gridModel.findPathWithFewestNodes(a, d);
			
			expect( result.valid ).toBeTruthy();
			expect( result.weight ).toBe( 3 );
			expect( result.nodes.length ).toBe( 3 );
		});
		
		it("snapPointToGrid: should return a point snapped to the nearest grid line segment.", function() {
			var a = gridModel.addNode(0, 0).id;
			var b = gridModel.addNode(100, 0).id;
			gridModel.joinNodes(a, b);

			var snapped = gridModel.snapPointToGrid( {x:50, y:20} );
			
			expect( snapped.x ).toBe( 50 );
			expect( snapped.y ).toBe( 0 );
		});
		
		it("snapPointToGrid: should defer action when snapping a point to a grid with no nodes.", function() {
			var a = {x:50, y:20};
			var b = gridModel.snapPointToGrid(a);
			
			expect( b.x ).toBe( a.x );
			expect( b.y ).toBe( a.y );
		});
		
		it("snapPointToGrid: should defer action when snapping a point to a grid with no node connections.", function() {
			gridModel.addNode();
			gridModel.addNode();
			
			var a = {x:50, y:20};
			var b = gridModel.snapPointToGrid(a);
			
			expect( b.x ).toBe( a.x );
			expect( b.y ).toBe( a.y );
		});
		
		it("getNearestNodeToNode: should find the nearest node to the specified origin node.", function() {
			var a = gridModel.addNode(0, 0);
			var b = gridModel.addNode(100, 100);
			var c = gridModel.addNode(10, 10);
			var n = gridModel.getNearestNodeToNode( c.id );
			
			expect( n ).toBe( a );
		});
		
		it("getNearestNodeToNode: should return null when an invalid origin node is referenced.", function() {
			var a = gridModel.addNode(0, 0);
			var b = gridModel.addNode(100, 100);
			var n = gridModel.getNearestNodeToNode( 'invalid' );
			
			expect( n ).toBe( null );
		});
		
		it("getNearestNodeToNode: should return null when there are no other nodes besides the origin.", function() {
			var a = gridModel.addNode(0, 0);
			var n = gridModel.getNearestNodeToNode( a.id );
			
			expect( n ).toBe( null );
		});
		
		it("getNearestNodeToPoint: should find the nearest node to the provided point.", function() {
			var a = gridModel.addNode(0, 0);
			var b = gridModel.addNode(100, 0);
			var n = gridModel.getNearestNodeToPoint( {x:10, y:0} );
			
			expect( n ).toBe( a );
		});
		
		it("hitTestPointInPolygons: should return true if the specified point falls within any polygon, otherwise false.", function() {
			var a = gridModel.addNode(0, 0).id;
			var b = gridModel.addNode(100, 0).id; 
			var c = gridModel.addNode(0, 100).id;
			var d = gridModel.addNode(100, 100).id;
			var p1 = gridModel.addPolygon([a, b, c]);
			var p2 = gridModel.addPolygon([b, c, d]);
			
			expect( gridModel.hitTestPointInPolygons({x:10, y:10}) ).toBe( true );
			expect( gridModel.hitTestPointInPolygons({x:90, y:90}) ).toBe( true );
			expect( gridModel.hitTestPointInPolygons({x:200, y:200}) ).toBe( false );
		});
		
		it("hitTestPointInPolygons: should return false when there are no polygons in the grid.", function() {
			expect( gridModel.hitTestPointInPolygons({x:10, y:10}) ).toBe( false );
		});
		
		it("getPolygonHitsForPoint: should return an array of all polygon ids hit by a point.", function() {
			var a = gridModel.addNode(0, 0).id;
			var b = gridModel.addNode(100, 0).id;
			var c = gridModel.addNode(0, 100).id;
			var d = gridModel.addNode(100, 100).id;
			var p1 = gridModel.addPolygon( [a, b, c] );
			var p2 = gridModel.addPolygon( [a, c, d] );
			var hit1 = gridModel.getPolygonHitsForPoint({x:5, y:50});
			var hit2 = gridModel.getPolygonHitsForPoint({x:50, y:5});
			var hit3 = gridModel.getPolygonHitsForPoint({x:95, y:50});
				
			expect( hit1.length ).toBe( 2 );
			expect( hit2.length ).toBe( 1 );
			expect( hit3.length ).toBe( 0 );
		});
		
		it("getNodesInPolygon: should return an array of all node ids contained within a polygon.", function() {
			var a = gridModel.addNode(0, 0).id;
			var b = gridModel.addNode(100, 0).id;
			var c = gridModel.addNode(0, 100).id;
			var d = gridModel.addNode(50, 25).id; // Inside figure ABC
			var e = gridModel.addNode(200, 200).id; // Outside figure ABC
			
			// Create figure ABC and get node hits:
			var p = gridModel.addPolygon( [a, b, c] ).id;
			var hits = gridModel.getNodesInPolygon( p );
			
			// Should get all nodes composing ABC, and contained point D.
			expect( hits.length ).toBe( 4 );
			expect( hits.sort().join() ).toBe( [a, b, c, d].sort().join() );
		});
		
		it("getNodesInRect: should return an array of all node ids contained within a rectangle.", function() {
			var a = gridModel.addNode(0, 0).id;
			var b = gridModel.addNode(50, 50).id;
			var c = gridModel.addNode(100, 100).id;
			var hits = gridModel.getNodesInRect( new Const.Rect(75, 75, -100, -100) );
				
			expect( hits.length ).toBe( 2 );
			expect( hits.sort().join() ).toBe( [a, b].sort().join() );
		});
	});
});