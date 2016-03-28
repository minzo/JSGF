//==============================================================================
//
//  グラフィクスマネージャ [GfxManager.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  コンストラクタ
//
//  @param[in] width  生成する canvas の幅
//  @param[in] height 生成する canvas の高さ
//------------------------------------------------------------------------------
GfxManager = function( width, height ) {

    var self = this instanceof GfxManager
             ? this
             : Object.create( GfxManager.prototype );

    //  描画リストの生成
    self.drawList = new Array();

    //  Canvas の生成
    self.canvas = document.createElement( 'canvas' );
  	self.canvas.width  = width;
  	self.canvas.height = height;
  	document.body.appendChild( self.canvas );

    //  context の取得
    self.context = self.canvas.getContext( '2d' );

    //  幅と高さ
    self.width = width;
    self.height= height;

    //  GfxObject が用いるグラフィクスマネージャ用変数に設定
    systemGfxManager = self;

    return self;
};

//------------------------------------------------------------------------------
//  Canvasの大きさを取得
//
//  @return VEC2 幅と高さ
//------------------------------------------------------------------------------
GfxManager.prototype.getCanvasSize = function() {
    return { x:this.width, y:this.height };
};

GfxManager.prototype.getScreenSize = function() {
    window.scrollTo(0,0);
    return{ x:window.innerWidth, y:window.innerHeight };
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
    _context.clearRect( 0, 0, this.width, this.height );

    //  描画リストに登録されたオブジェクトの描画処理
    for( var i=0,l=_drawList.length; i<l; i++){
        var _drawObject = _drawList[ i ];
        _drawObject.preproc();
        _drawObject.proc( _context );
        _drawObject.postproc();
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
