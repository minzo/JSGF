//==============================================================================
//
//  グラフィクスカメラ [GfxCamera.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  GfxCamera
//
//  @param[in] x      左上X座標
//  @param[in] y      左上Y座標
//  @param[in] w      表示範囲幅
//  @param[in] h      表示範囲高さ
//------------------------------------------------------------------------------
GfxCamera = function( x, y, w, h ) {

    var self = this instanceof GfxCamera
             ? this
             : Object.create( GfxCamera.prototype );

    x = x ? x : 0;
    y = y ? y : 0;
    w = w ? w : systemGfxManager.width;
    h = h ? h : systemGfxManager.height;

    GfxObject.call( self, x, y, w, h );

    self.center = { x: x+w/2, y: y+h/2 };

    return self;
};
GfxCamera.prototype = new GfxObject();

//------------------------------------------------------------------------------
//  カメラの中央を設定
//------------------------------------------------------------------------------
GfxCamera.prototype.setCenter = function( cx, cy ) {
    this.pos.x    = cx - this.size.x / 2;
    this.pos.y    = cy - this.size.y / 2;
    this.center.x = cx;
    this.center.y = cy;
};

//------------------------------------------------------------------------------
//  カメラの表示範囲を設定
//------------------------------------------------------------------------------
GfxCamera.prototype.setSize = function( w, h ) {
    this.pos.x   = this.center.x - w / 2;
    this.pos.y   = this.center.y - h / 2;
    this.size.x  = w;
    this.size.y  = h;
    this.scale.x = systemGfxManager.width  / w;
    this.scale.y = systemGfxManager.height / h;
};


//------------------------------------------------------------------------------
//  更新
//------------------------------------------------------------------------------
GfxCamera.prototype.update = function() {
    this.transform();
};


//------------------------------------------------------------------------------
//  行列計算
//------------------------------------------------------------------------------
GfxCamera.prototype.transform = function() {

    //  行列計算が既に終了していたら抜ける
    if( this.bUpdateMatrix ) return;

    //  キャッシュ
    var pos    = this.pos;
    var scale  = this.scale;
    var offset = this.center;
    var matrix = new MTX33();

    matrix.translate( offset.x - pos.x, offset.y - pos.y );
    matrix.rotate( this.rot );
    matrix.scale( scale.x, scale.y );
    matrix.translate( -offset.x, -offset.y );
    this.matrix = matrix;

    //  行列計算を終了状態にする
    this.bUpdateMatrix = true;
};

})( window );
