//==============================================================================
//
//  基底フェーダクラス [FaderBase.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  コンストラクタ
//------------------------------------------------------------------------------
FaderBase = function() {

    var self = this instanceof FaderBase
             ? this
             : Object.create( FaderBase.prototype );

    var size = systemGfxManager.getCanvasSize();

    self.state = new StateControl( 'fadein' );
    self.blind = new GfxRect( 0, 0, size.x, size.y, 'rgba(255,255,255,0)' );
    self.alpha = 0;

    return self;
};

//------------------------------------------------------------------------------
//  ロード
//------------------------------------------------------------------------------
FaderBase.prototype.load   = function() {};

//------------------------------------------------------------------------------
//  更新
//
//  MEMO: (ほとんどないはずだが) 必要に応じてオーバーライドすること
//------------------------------------------------------------------------------
FaderBase.prototype.update      = function() {
    var _state = this.state;
    _state.update();
    switch( _state.get() ){
    case 'fadein' : this.fadein();  break;
    case 'fade'   : this.fade();    break;
    case 'fadeout': this.fadeout(); break;
    case 'stop'   : break;
    }
};

//------------------------------------------------------------------------------
//  描画
//
//  MEMO: 必要に応じてオーバーライドすること
//------------------------------------------------------------------------------
FaderBase.prototype.draw = function() {
    this.blind.draw();
};


//------------------------------------------------------------------------------
//  fadein / fade/ fadeout
//
//  MEMO: 必要に応じてオーバーライドすること (デフォルトは暗転)
//------------------------------------------------------------------------------
FaderBase.prototype.fadein = function() {

    var _state = this.state;

    if( _state.isFirst() ) {
        this.alpha = 0.0;
    };

    this.alpha = Math.clamp( this.alpha + 1/30, 0, 1 );
    this.blind.color = 'rgba(0,0,0,' + this.alpha + ')';

    if( _state.getFrame() > 30 ) {
        _state.change( 'fade' );
    };
};
FaderBase.prototype.fade   = function() {
    if( this.state.isFirst() ) {
        this.alpha = 1.0;
        this.blind.color = 'rgba(0,0,0,' + this.alpha + ')';
    }
};
FaderBase.prototype.fadeout= function() {

    var _state = this.state;

    if( _state.isFirst() ) {
        this.alpha = 1.0;
    }

    this.alpha = Math.clamp( this.alpha - 1/30, 0, 1 );
    this.blind.color = 'rgba(0,0,0,' + this.alpha + ')';

    if( _state.getFrame() > 30 ) {
        _state.change( 'stop' );
    };
};

//------------------------------------------------------------------------------
//  フェーダの fadein / fadeout を開始する
//------------------------------------------------------------------------------
FaderBase.prototype.startFadein = function() { this.state.change( 'fadein' ); };
FaderBase.prototype.startFadeout= function() { this.state.change( 'fadeout' );};

})( window );
