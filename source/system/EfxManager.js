//==============================================================================
//
//  エフェクトマネージャ [EfxManager.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  コンストラクタ
//------------------------------------------------------------------------------
EfxManager = function() {

    var self = this instanceof EfxManager
             ? this
             : Object.create( EfxManager.prototype );
    self.effectList = [];
    return self;
};

//------------------------------------------------------------------------------
//  更新
//------------------------------------------------------------------------------
EfxManager.prototype.update = function() {
    var effects = this.effectList;
    for( var i=0,l=effects.length; i<l; i++ ) {
        var effect = effects.shift();
        effect.draw();
        if( ! effect.isDead() ) effects.push( effect );
    }
};

//------------------------------------------------------------------------------
//  エフェクトの登録
//
//  @param[in] effect 登録するエフェクトオブジェクト
//------------------------------------------------------------------------------
EfxManager.prototype.entry = function( effect, lifeTime ) {
    effect.lifeTime = lifeTime;
    this.effectList.push( effect );
};


})( window );
