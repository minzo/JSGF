//==============================================================================
//
//  シーンクラス [SceneBase.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  コンストラクタ
//------------------------------------------------------------------------------
SceneBase = function() {
    var self = this instanceof SceneBase
             ? this
             : Object.create( SceneBase.prototype );
    return self;
};

//------------------------------------------------------------------------------
//  各状態で呼ばれる関数
//------------------------------------------------------------------------------
SceneBase.prototype.load   = function() {};
SceneBase.prototype.init   = function() {};
SceneBase.prototype.update = function() {};
SceneBase.prototype.draw   = function() {};
SceneBase.prototype.exit   = function() {};

})( window );
