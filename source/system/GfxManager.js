//==============================================================================
//
//  グラフィクスマネージャ [GfxManager.js]
//
//==============================================================================

(function( window, undefined ) {

var gl = null;
var context = null;

//------------------------------------------------------------------------------
//  コンストラクタ
//
//  @param[in] mode   描画モード(2d|3d)
//  @param[in] width  生成する canvas の幅
//  @param[in] height 生成する canvas の高さ
//------------------------------------------------------------------------------
GfxManager = function( mode ,width, height ) {

    //  描画リストの生成
    this.drawList = new Array();

    //  Canvas の生成
    this.canvas = document.createElement( 'canvas' );
  	this.canvas.width  = width;
  	this.canvas.height = height;
  	document.body.appendChild( this.canvas );

    //  context の取得
    this.gl = this.context = this.canvas.getContext( mode );
    context = this.context;
    gl      = this.gl;

    if(mode == GfxManager.Mode2d)
    {
        this.context.miClearScreen = function() {
            gl.clearRect( 0, 0, width, height );
        };
    }
    else
    {
        this.context.miClearScreen = function() {
            gl.enable( gl.DEPTH_TEST );
            gl.depthFunc( gl.LEQUAL );
            gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
            gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
            gl.viewport( 0, 0, width, height );
        };
    }

    this.context.setTransform  = this.context.setTransform || function() {};

    //  幅と高さ
    this.width = width;
    this.height= height;

    //  GfxObject が用いるグラフィクスマネージャ用変数に設定
    systemGfxManager = this;

    this.camera = new Camera();

    return this;
};

GfxManager.Mode2d = '2d';
GfxManager.Mode3d = 'webgl';

//------------------------------------------------------------------------------
//  Canvasの大きさを取得
//------------------------------------------------------------------------------
GfxManager.prototype.getCanvasSize = function() {
    return new VEC2( this.width, this.height );
};

GfxManager.prototype.getScreenSize = function() {
    window.scrollTo(0,0);
    return new VEC2( window.innerWidth, window.innerHeight );
};

//------------------------------------------------------------------------------
//  カメラを設定
//------------------------------------------------------------------------------
GfxManager.prototype.setCamera = function( camera ) {
    this.camera = camera;
};

//------------------------------------------------------------------------------
//  更新 / 描画
//------------------------------------------------------------------------------
GfxManager.prototype.update = function() {

    //  キャッシュ
    var _context   = this.context;
    var _drawList  = this.drawList;

    //  canvas の初期化
    _context.setTransform( 1, 0, 0, 1, 0, 0 );
    _context.miClearScreen();

    //  描画リストに登録されたオブジェクトの描画前処理
    for( var i=0,l=_drawList.length; i<l; i++){
        _drawList[ i ].viewMtx = this.camera.getViewMatrix();
        _drawList[ i ].preproc( _context );
    }

    //  描画リストに登録されたオブジェクトの描画処理
    for( var i=0,l=_drawList.length; i<l; i++){
        _drawList[ i ].proc( _context );
    }

    //  描画リストに登録されたオブジェクトの描画後処理
    for( var i=0,l=_drawList.length; i<l; i++){
        _drawList[ i ].postproc( _context );
    }

    //  描画リストを空にする
    _drawList.length = 0;
};

//------------------------------------------------------------------------------
//  描画リストに追加
//
//  @param[in] object 描画リストに追加するグラフィクスオブジェクト
//------------------------------------------------------------------------------
GfxManager.prototype.entryDrawList = function( object ) {
    var _drawList = this.drawList;
    _drawList[ _drawList.length ] = object;
};

})( window );
