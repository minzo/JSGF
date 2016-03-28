//==============================================================================
//
//  エフェクトオブジェクト [EfxObject.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  コンストラクタ
//------------------------------------------------------------------------------
EfxObject = function( x, y ) {

    var self = this instanceof EfxObject
             ? this
             : Object.create( EfxObject.prototype );
    GfxObject.call( self, x, y, 100, 100 );

    self.lifeTime = 0;

    return self;
};
EfxObject.prototype = Object.create( GfxObject.prototype );
EfxObject.prototype.constructor = EfxObject;

//------------------------------------------------------------------------------
//  死ぬかどうか
//------------------------------------------------------------------------------
EfxObject.prototype.isDead = function() { return ( this.lifeTime <= 0 ); };

//------------------------------------------------------------------------------
//  描画
//------------------------------------------------------------------------------
EfxObject.prototype.preproc = function() {
    this.transform();
    this.lifeTime--;
};
EfxObject.prototype.proc    = GfxObject.prototype.proc;
EfxObject.prototype.postproc= GfxObject.prototype.postproc;

})( window );
