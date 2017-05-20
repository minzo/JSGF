//==============================================================================
//
//  ゲーム本編 [SceneGameMain.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  コンストラクタ
//------------------------------------------------------------------------------
SceneGameMain = function() {

    SceneBase.call( this );

    this.camera = null;

    return this;
};
SceneGameMain.prototype = new SceneBase();
//gScnMngr.entryScene( SceneGameMain, 'SceneGameMain' );

//------------------------------------------------------------------------------
//  ロード
//------------------------------------------------------------------------------
SceneGameMain.prototype.load   = function() {
    gFileMngr.loadImage( 'resource/webapp/home-icon.png' );
};

//------------------------------------------------------------------------------
//  初期化
//------------------------------------------------------------------------------
SceneGameMain.prototype.init   = function() {

    Col2dComponent.isVisibleCollision = true;

    this.camera = new Camera();

    systemGfxManager.setCamera( this.camera );

    this.object = new BaseObject();
    this.object.attachComponent( new Gfx2dCircle(20, Gfx2dStyle.FillGreen()) );
    this.object.attachComponent( new Col2dCircle(20) );
    this.object.attachComponent( new TouchCircle(10) );
    this.object.setPos( 0, 0, 0 );

    this.child = new BaseObject();
    this.child.attachComponent( new Gfx2dRect(20, 20, Gfx2dStyle.FillGreen() ));
    this.child.attachComponent( new Col2dCircle( 20 ));
    this.child.setPos( 130, 0, 0 );
    this.child.setParent( this.object );

    this.rect1 = new BaseObject();
    this.rect1.attachComponent( new Gfx2dRect(10, 10, Gfx2dStyle.FillGreen() ));
    this.rect1.attachComponent( new TouchRect(10, 10));
    this.rect1.setPos( 30, 30, 0 );
    this.rect1.setParent( this.child );

    this.rect2 = new BaseObject();
    this.rect2.attachComponent( new Gfx2dImage(30, 30, 'home-icon' ));
    this.rect2.setPos( -30, -30, 0 )
    this.rect2.setParent( this.child );

    this.count = 0;
};

//------------------------------------------------------------------------------
//  更新
//------------------------------------------------------------------------------
SceneGameMain.prototype.update = function() {

    var sin = Math.sin(this.object.transform.rotate.y) + 1.5;

    var touch = gHID.getOldestTouch();

    this.object.setScale( sin, sin, sin );
    this.child.transform.rotate.z += 0.01;

    var size = systemGfxManager.getCanvasSize();

    if(touch != null && touch.isHld())
    {
        var vec = this.camera.getPos().add( touch.spd.toVEC3() );
        this.camera.setPos( vec.x, vec.y, vec.z );
    }

    gObjMngr.entryObjectList( this.camera );
    gObjMngr.entryObjectList( this.object );
    gObjMngr.entryObjectList( this.child );
    gObjMngr.entryObjectList( this.rect1 );
    gObjMngr.entryObjectList( this.rect2 );
};

//------------------------------------------------------------------------------
//  描画
//------------------------------------------------------------------------------
SceneGameMain.prototype.draw   = function() {
};

//------------------------------------------------------------------------------
//  終了
//------------------------------------------------------------------------------
SceneGameMain.prototype.exit   = function() {
};

})( window );
