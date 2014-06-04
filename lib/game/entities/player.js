ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
    
    size: {x:16, y:16},
    maxVel: { x: 250, y: 500 },
    flip: false,
    accel: {x:300, y:500},
    accelGround: 300,
    accelAir: 200,
    jump: 250,
    jumpCounter: 0,
    in_the_air: false,
    friction: { x: 600, y: 0 },
    next_idle : 'idle',
    activeWeapon: "EntityBullet",
    startPosition: null,
    direction: null,
    friction: {x: 600, y: 0},

    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.PASSIVE,
    
    animSheet: new ig.AnimationSheet( 'media/player_square.png', 16, 16 ),
    
    init: function( x, y, settings ) {

        this.parent( x, y, settings );
        this.startPosition = {x:x,y:y};

        this.addAnim( 'idle', 1, [0] );
        this.addAnim( 'jump', 1, [0] );
        this.addAnim( 'fall', 1, [0] );
        this.addAnim( 'run', 1, [0] );
    },


    update: function() {

            // move left or right
            var accel = this.standing ? this.accelGround : this.accelAir;

            if( ig.input.state('left') ) {
                this.accel.x = -accel;
                //this.flip = true;
            }else if( ig.input.state('right') ) {
                this.accel.x = accel;
                this.flip = false;
            }else{
                this.accel.x = 0;
                this.vel.x = 0;
            }


            if( this.standing && ig.input.pressed('jump') ) {
                this.jumpCounter++;
                if (this.vel.y == 0){
                    this.vel.y = -400;
                    this.falling = false;
                }
            }else{
                    if(!this.standing && !ig.input.state('jump') && !this.falling) {
                        this.vel.y = Math.floor(this.vel.y/3);
                        this.falling = true;
                    }
                }

            if(ig.input.pressed('shoot') && this.jumpCounter == 1){
                var mx = (ig.input.mouse.x + ig.game.screen.x); //Figures out the x coord of the mouse in the entire world
                var my = (ig.input.mouse.y + ig.game.screen.y); //Figures out the y coord of the mouse in the entire world

                var r = Math.atan2(my-this.pos.y, mx-this.pos.x); //Gives angle in radians from player's location to the mouse location, assuming directly right is 0
                //alert(r);
                if(r < 2.50 && r > 0.5){
                this.vel.y = -400;
                this.jumpCounter = 0;
                }
              }


            if(this.vel.y == 0){
                this.jumpCounter = 0;
            }

            // set the current animation, based on the player's speed
            if( this.vel.y < 0 ) {
                this.currentAnim = this.anims.jump;
            }else if( this.vel.y > 0 ) {
                this.currentAnim = this.anims.fall;
            }else if( this.vel.x != 0 ) {
                this.currentAnim = this.anims.run;
            }else{
                this.currentAnim = this.anims.idle;
            }


        if( ig.input.pressed('shoot') ) { //Basic shoot command
             var mx = (ig.input.mouse.x + ig.game.screen.x); //Figures out the x coord of the mouse in the entire world
             var my = (ig.input.mouse.y + ig.game.screen.y); //Figures out the y coord of the mouse in the entire world

             var r = Math.atan2(my-this.pos.y, mx-this.pos.x); //Gives angle in radians from player's location to the mouse location, assuming directly right is 0

             ig.game.spawnEntity(this.activeWeapon, this.pos.x+5, this.pos.y+5, {angle:r}); //Nothing to special here, just make sure you pass the angle we calculated in
            }

            // move!
            this.parent();
    },

    kill: function(){
        this.parent();
        ig.game.respawnPosition = this.startPosition;
        ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {callBack:this.onDeath} );
    },
     onDeath: function(){
        ig.game.spawnEntity( EntityPlayer, ig.game.respawnPosition.x, ig.game.respawnPosition.y);
    }

});

EntityBullet = ig.Entity.extend({
    size: {x: 6, y: 6},
    animSheet: new ig.AnimationSheet( 'media/bullet_square.png', 6, 6 ),
    maxVel: {x: 600, y: 600},
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        this.vel.x =  Math.cos(this.angle) * 600;
        this.vel.y = Math.sin(this.angle) * 600;
        this.addAnim( 'idle', 1, [0] );
    },
    check: function( other ) {
        other.receiveDamage( 3, this );
        this.kill();
    },
    handleMovementTrace: function( res ) {
    this.parent( res );
    if( res.collision.x || res.collision.y ){
        this.kill();
    }
    },

});

EntityKick = ig.Entity.extend({
    size: {x: 25, y: 25},
    animSheet: new ig.AnimationSheet( 'media/kick_wave.png', 28, 28 ),
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,
    timer : null,
    direction_kick: null,

    init: function( x, y, settings ) {
        this.parent( x , y, settings );
        this.addAnim( 'right', 0.08, [0,1,2] );
        this.addAnim( 'left', 0.08, [3,4,5] );
        this.addAnim( 'back', 0.08, [6,7,8] );
        this.addAnim( 'front', 0.08, [9,10,11] );
        
        direction_kick = settings.direction;
        this.timer = new ig.Timer();
        this.timer.set(0.3);
    },
    check: function( other ) {
        other.receiveDamage( 3, this );
        //this.kill();
    },
    update: function() {
        this.parent();
        if(direction_kick == 'right'){
            this.currentAnim = this.anims.right;
        }else if(direction_kick == 'left'){
            this.currentAnim = this.anims.left;
        }else if(direction_kick == 'front'){
            this.currentAnim = this.anims.front;
        }else if(direction_kick == 'back'){
            this.currentAnim = this.anims.back;
        }

        if(this.timer.delta() > 0){
        this.kill();
    }
    }

});
    

EntityDeathExplosion = ig.Entity.extend({
    lifetime: 1,
    callBack: null,
    particles: 25,
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
            for(var i = 0; i < this.particles; i++)
                ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
            this.idleTimer = new ig.Timer();
        },
        update: function() {
            if( this.idleTimer.delta() > this.lifetime ) {
                this.kill();
                if(this.callBack)
                    this.callBack();
                return;
            }
        }
});

EntityDeathExplosionParticle = ig.Entity.extend({
    size: {x: 2, y: 2},
    maxVel: {x: 160, y: 200},
    lifetime: 2,
    fadetime: 1,
    bounciness: 0,
    vel: {x: 100, y: 30},
    friction: {x:100, y: 0},
    collides: ig.Entity.COLLIDES.LITE,
    colorOffset: 0,
    totalColors: 7,
    animSheet: new ig.AnimationSheet( 'media/blood.png', 2, 2 ),
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors+1));
        this.addAnim( 'idle', 0.2, [frameID] );
        this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
        this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
        this.idleTimer = new ig.Timer();
    },
    update: function() {
        if( this.idleTimer.delta() > this.lifetime ) {
            this.kill();
            return;
        }
        this.currentAnim.alpha = this.idleTimer.delta().map(
            this.lifetime - this.fadetime, this.lifetime,
            1, 0
        );
        this.parent();
    }
});

});