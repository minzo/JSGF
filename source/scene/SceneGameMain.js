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
    var self = this instanceof SceneGameMain
             ? this
             : Object.create( SceneGameMain.prototype );
    SceneBase.call( self );

    self.camera = null;
    self.player = null;

    return self;
};
SceneGameMain.prototype = new SceneBase();
//gScnMngr.entryScene( SceneGameMain, 'SceneGameMain' );

//------------------------------------------------------------------------------
//  ロード
//------------------------------------------------------------------------------
SceneGameMain.prototype.load   = function() {
};

//------------------------------------------------------------------------------
//  初期化
//------------------------------------------------------------------------------
SceneGameMain.prototype.init   = function() {
    this.camera = new GfxCamera();
    this.player = new Player( 320, 100 );
    this.block  = new Block( 320, 500, 100, 100 );

    this.player.objectList = [ this.block ];
};

//------------------------------------------------------------------------------
//  更新
//------------------------------------------------------------------------------
SceneGameMain.prototype.update = function() {
    this.player.update();
    this.block.update();
};

//------------------------------------------------------------------------------
//  描画
//------------------------------------------------------------------------------
SceneGameMain.prototype.draw   = function() {
    this.player.draw();
    this.block.draw();
};

//------------------------------------------------------------------------------
//  終了
//------------------------------------------------------------------------------
SceneGameMain.prototype.exit   = function() {
};

})( window );
