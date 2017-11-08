//==============================================================================
//
//  シーンのテンプレート [SceneSpring.js]
//
//==============================================================================

(function( window, undefined ) {

var Spring = class
{
    constructor()
    {
        this.pos1 = new VEC3();
        this.pos2 = new VEC3();

        this.constant = 1.0; // バネ定数
    }

    calc()
    {
        var distance = VEC3.distance(this.pos1, this.pos2);
    }
};

var Ball = class extends BaseObject
{
    constructor( x, y, z )
    {
        super();

        this.attachComponent( new RigidBodyCircle() );
        this.attachComponent( new Col2dCircle( 10 ) );
        this.attachComponent( new Gfx2dCircle( 10, Gfx2dStyle.FillGreen() ) );

        this.setPos( x, y, z );

        this.rigidbody = this.findComponent( RigidBodyComponent );
    }
};


var Player = class
{
    constructor()
    {
       this.balls = new List();

        for(var i=0; i<10;i++)
        {
            var ball = new Ball( i * 15.0, -50.0, 0.0 );
            this.balls.pushBack( ball );
        }
    }

    update()
    {
    }
};

var Ground = class extends BaseObject
{
    constructor()
    {
        super();
        this.attachComponent( new Col2dRect( 100, 10) );
        this.attachComponent( new Gfx2dRect( 1000, 10, Gfx2dStyle.EdgeBlack() ) );
    }

    calc()
    {
    }
}


//------------------------------------------------------------------------------
//  コンストラクタ
//------------------------------------------------------------------------------
SceneSpring = function() {
    SceneBase.call( this );

    this.player = null;
    this.ground = new Ground()

    return this;
};
SceneSpring.prototype = new SceneBase();
//gScnMngr.entryScene( SceneSpring, 'SceneSpring' );

//------------------------------------------------------------------------------
//  ロード
//------------------------------------------------------------------------------
SceneSpring.prototype.load   = function() {
};

//------------------------------------------------------------------------------
//  初期化
//------------------------------------------------------------------------------
SceneSpring.prototype.init   = function() {

    systemGfxManager.setCamera(this.camera = new Camera() );

    this.player = new Player();
};

//------------------------------------------------------------------------------
//  更新
//------------------------------------------------------------------------------
SceneSpring.prototype.update = function() {

    var ground = this.ground;

    gObjMngr.entryObjectList( this.camera );
    gObjMngr.entryObjectList( this.ground );

    this.player.balls.forEach( function( data ) {
        gObjMngr.entryObjectList( data );
    });

    this.player.balls.forEach( function( data )
    {
        var col_circle = data.findComponent( Col2dCircle );
        var col_rect = ground.findComponent( Col2dRect );

        col_circle.isHitRect( col_rect, function()
        {
            console.log("HIT");
        });
    });
};



//------------------------------------------------------------------------------
//  描画
//------------------------------------------------------------------------------
SceneSpring.prototype.draw   = function() {
};

//------------------------------------------------------------------------------
//  終了
//------------------------------------------------------------------------------
SceneSpring.prototype.exit   = function() {
};

})( window );
