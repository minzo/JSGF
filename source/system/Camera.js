//==============================================================================
//
//  カメラ [Camera.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
// Camera
//------------------------------------------------------------------------------
Camera = function() {

    BaseObject.call( this );

    this.viewMtx = new MTX34();
    this.isViewMtxUpdated = false;

    this.scaleMtx = new MTX34();

    this.setPos( 0.0, 0.0, 0.0 );

    return this;
};
Camera.prototype = new BaseObject();

//------------------------------------------------------------------------------
// カメラの設定
//------------------------------------------------------------------------------
// 位置
Camera.prototype.setPos = function( x, y, z ) {
    var size = systemGfxManager.getCanvasSize();
    var offsetX = -size.x * 0.5;
    var offsetY = -size.y * 0.5;
    BaseObject.prototype.setPos.call( this, offsetX - x, offsetY - y, z );
    this.isViewMtxUpdated = false;
};
Camera.prototype.getPos = function() {
    var size = systemGfxManager.getCanvasSize();
    var offsetX = -size.x * 0.5;
    var offsetY = -size.y * 0.5;
    var pos = BaseObject.prototype.getPos.call( this );
    return new VEC3( offsetX - pos.x, offsetY - pos.y, pos.z );
};


// ズーム
Camera.prototype.setZoom = function( zoom ) {
    var s = 1.0 / zoom;
    this.scaleMtx.setScale( s, s, s );
    this.isViewMtxUpdated = false;
};

//------------------------------------------------------------------------------
// カメラ行列の取得
//------------------------------------------------------------------------------
Camera.prototype.getViewMatrix = function() {
    if(!this.isViewMtxUpdated) {
        this.viewMtx = MTX34.mult( this.scaleMtx, this.transform.worldMtx ).inverse();
        this.isViewMtxUpdated = true;
    }
    return this.viewMtx;
};

})( window );
