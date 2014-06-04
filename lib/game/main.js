ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'impact.debug.debug',
	'game.levels.main'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	level: {},
	rows: 96,
	cols: 128,
	gravity: 300,
	
	
	init: function() {
		ig.input.bind( ig.KEY.UP_ARROW, 'jump' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );

		ig.input.bind( ig.KEY.C, 'kick' );
		ig.input.bind( ig.KEY.MOUSE1, 'shoot' );

		//-------------------------------------------------------//
		//-----------------------CREER NIVEAU--------------------//
		//-------------------------------------------------------//

		var myArray = new Array();


		for( var i=0; i <this.rows ; i++ ) {
			myArray.push( [] );
		}

		for (var i = 0; i < this.rows; i++)
		{
			for (var j =  myArray[i].length; j < this.cols; j++)
			{
			    row = Math.random() > 0.45 ? 0 : 1;
			    //myArray[i].push(row);
			    myArray[i][j] = row;
			}
		}

		level = myArray;

		//-------------------------------------------------------//
		//--------------------"SMOOTHING"------------------------//
		//-------------------------------------------------------//

		var tiles2 = new Array();
		var tiles_col = new Array();

		for( var i=0; i < this.rows ; i++ ) {
			tiles2.push( [] );
			tiles_col.push( [] );
		}

		var times = 2;

		for (var time = 0; time < times; time++) {

			for (var x = 0; x < this.rows; x++) {

				for (var y = 0; y < this.cols; y++) {

					var floors = 0;
					var walls = 0;

						for (var ox = -1; ox < 2; ox++) {

							for (var oy = -1; oy < 2; oy++) {

								if (x + ox < 0 || x + ox >= this.rows || y + oy < 0 || y + oy >= this.cols){
									continue;
								}

								if (level[x + ox][y + oy] == 0 ){
									floors++;
								}else{
									walls++;
								}
							}
						}
					wall_type = Math.random() > 0.50 ? 2 : 3;
					tiles2[x][y] = floors >= walls ? 0 : wall_type;
					tiles_col[x][y] = floors >= walls ? 0 :1;
				}
			}

			level = tiles2;
			level_col = tiles_col;
		}

		//-------------------------------------------------------//
		//------------------CHARGER NIVEAU-----------------------//
		//-------------------------------------------------------//


		this.map = level;
		this.map_col = level_col;

		this.collisionMap = new ig.CollisionMap(32, this.map_col );
		this.backgroundMaps.push( new ig.BackgroundMap(32, this.map, 'media/tiles_green_32.png' ) );
		
		/*this.player = this.spawnEntity( EntityPlayer, ig.system.width/2, ig.system.height/2 );*/
		this.player = this.spawnEntity( EntityPlayer, 1, 1 );

		this.spawnEntity( EntityMonster, 80, 80 );
		this.spawnEntity( EntityMonster, 100, 100 );
		this.spawnEntity( EntityMonster, 578, 200 );

	},

	smooth: function(){



	},
	
	update: function() {
		// screen follows the player
		var player = this.getEntitiesByType( EntityPlayer )[0];
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
		// Update all entities and BackgroundMaps
		this.parent();
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
	}
});


ig.main( '#canvas', MyGame, 60, 1000, 500, 1 );

});
