//==============================================================================
//
// コンポーネント [Component.js]
//
//==============================================================================

(function( window, undefined ){

//------------------------------------------------------------------------------
// コンポーネント
//------------------------------------------------------------------------------
Component = function() {
    this.owner = null;
};

//------------------------------------------------------------------------------
// 計算処理 - Component は calc() が必ず呼ばれます
// @param owner このコンポーネントをアタッチしているオブジェクト
//------------------------------------------------------------------------------
Component.prototype.calc = function( owner ) { this.owner = owner; };

})( window );
