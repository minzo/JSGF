//==============================================================================
//
//  シーンのテンプレート [SceneTemplate.js]
//
//==============================================================================

//------------------------------------------------------------------------------
//
//  新しいシーンの作り方
//
//  1. このファイルをコピーして適切な名前にリネームする
//  2. "SceneTemplate" の部分を適切名前に一括置換する
//  3. 不必要なコメントを削除し, 不適切なコメントを修正する
//
//------------------------------------------------------------------------------

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  コンストラクタ
//------------------------------------------------------------------------------
SceneTemplate = function() {
    SceneBase.call( this );
    return this;
};
SceneTemplate.prototype = new SceneBase();
gScnMngr.entryScene( SceneTemplate, 'SceneTemplate' );

//------------------------------------------------------------------------------
//  ロード
//------------------------------------------------------------------------------
SceneTemplate.prototype.load   = function() {
};

//------------------------------------------------------------------------------
//  初期化
//------------------------------------------------------------------------------
SceneTemplate.prototype.init   = function() {
};

//------------------------------------------------------------------------------
//  更新
//------------------------------------------------------------------------------
SceneTemplate.prototype.update = function() {
};

//------------------------------------------------------------------------------
//  描画
//------------------------------------------------------------------------------
SceneTemplate.prototype.draw   = function() {
};

//------------------------------------------------------------------------------
//  終了
//------------------------------------------------------------------------------
SceneTemplate.prototype.exit   = function() {
};

})( window );
