ig.module(
	'game.entities.monster'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityMonster = ig.Entity.extend({

    animSheet: new ig.AnimationSheet( 'media/ennemy_square.png', 16, 16 ),
    size: {x: 16, y:16},
    maxVel: {x: 100, y: 100},
    flip: false,
    friction: {x: 150, y: 0},
    speed: 14,

    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function( x, y, settings ) {
    	this.parent( x, y, settings );
/*    	this.addAnim('walk_front', .2, [0,1,2]);
        this.addAnim('walk_left', .2, [3,4,5]);
        this.addAnim('walk_right', .2, [6,7,8]);*/
        this.addAnim('walk_front', .2, [0]);
        this.addAnim('walk_left', .2, [0]);
        this.addAnim('walk_right', .2, [0]);
    },

    update: function() {

    	var xdir = this.flip ? -1 : 1;
    	this.vel.x = this.speed * xdir;
        
        if( this.vel.y > 0) {
                this.currentAnim = this.anims.walk_front;
        }else if( this.vel.y < 0 ) {
                this.currentAnim = this.anims.walk_front;
        }else if( this.vel.x < 0 ){
                this.currentAnim = this.anims.walk_left;
        }else if( this.vel.x > 0 ){
                this.currentAnim = this.anims.walk_right;
        }
        else{
            this.currentAnim = this.anims.walk_front;
        }

    	this.parent();
    },

    handleMovementTrace: function( res ) {
    	this.parent( res );
    	// collision with a wall? return!
    	if( res.collision.x ) {
    		this.flip = !this.flip;
    	}
    },

    check: function( other ) {
    	other.receiveDamage( 10, this );
    },

    receiveDamage: function(value){
        this.parent(value);
        if(this.health > 0)
    		ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {particles: 2, colorOffset: 0});
    },

    kill: function(){
        this.parent();
        ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {colorOffset: 0});
    }

});
});
