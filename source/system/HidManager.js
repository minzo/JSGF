//==============================================================================
//
//  HIDマネージャ [HIDManager.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  コンストラクタ
//------------------------------------------------------------------------------
HidManager = function() {

    var self = this instanceof HidManager
             ? this
             : Object.create( HidManager.prototype );

    systemHidManager = self;

    //　　タッチのリスト
    self.touches = [
        new Touch(),
        new Touch(),
        new Touch(),
        new Touch(),
        new Touch(),
        new Touch() // click 用オブジェクト
    ];

    self.firstTap = true;

    document.addEventListener( "touchstart", function( e ){
        //  iOS の mute を解除
        if( self.firstTap ) { gSndMngr.play( 'mute' ); self.firstTap = false; }
        e.preventDefault();
        for( var i=0,l=e.changedTouches.length; i<l; i++) {
            var _eventTouch = e.changedTouches[ i ];
            var _selfTouch  = self.touches[ _eventTouch.identifier % 5 ];
            _selfTouch.setTrg( _eventTouch.clientX, _eventTouch.clientY );
        }
    } );
    document.addEventListener( "touchmove", function( e ){
        e.preventDefault();
        for( var i=0,l=e.changedTouches.length; i<l; i++) {
            var _eventTouch = e.changedTouches[ i ];
            var _selfTouch  = self.touches[ _eventTouch.identifier % 5 ];
            _selfTouch.pos.x = _eventTouch.clientX;
            _selfTouch.pos.y = _eventTouch.clientY;
        }
    } );
    document.addEventListener( "touchend", function( e ){
        e.preventDefault();
        for( var i=0,l=e.changedTouches.length; i<l; i++) {
            var _eventTouch = e.changedTouches[ i ];
            var _selfTouch  = self.touches[ _eventTouch.identifier % 5 ];
            _selfTouch.setRls( _eventTouch.clientX, _eventTouch.clientY );
        }
    } );
    document.addEventListener( "touchcancel", function( e ){
        e.preventDefault();
        for( var i=0,l=e.changedTouches.length; i<l; i++) {
            var _eventTouch = e.changedTouches[ i ];
            var _selfTouch  = self.touches[ _eventTouch.identifier % 5 ];
            _selfTouch.setTrg( _eventTouch.clientX, _eventTouch.clientY );
        }
    });

    document.addEventListener( "mousedown", function( e ) {
        e.preventDefault();
        var _selfTouch = self.touches[ 5 ];
        _selfTouch.setTrg( e.clientX, e.clientY );
    });
    document.addEventListener( "mousemove", function( e ){
        e.preventDefault();
        var _selfTouch = self.touches[ 5 ];
        _selfTouch.pos.x = e.clientX;
        _selfTouch.pos.y = e.clientY;
    });
    document.addEventListener( "mouseup", function( e ) {
        e.preventDefault();
        var _selfTouch = self.touches[ 5 ];
        _selfTouch.setRls( e.clientX, e.clientY );
    });

    return self;
};


//------------------------------------------------------------------------------
//  更新
//
//  MEMO: 毎フレーム呼び出すことで入力状態を最新に保つ
//------------------------------------------------------------------------------
HidManager.prototype.update = function() {

    var _touches = this.touches;

    for( var i=0,l=_touches.length; i<l; i++) {
        var _touch = _touches[ i ];
        _touch.update();
    }
};



//------------------------------------------------------------------------------
//  Touch
//
//  MEMO: タッチの状態を保持するHIDManager固有クラス
//------------------------------------------------------------------------------
var Touch = function() {

    var self = this instanceof Touch
             ? this
             : Object.create( Touch.prototype );

    self.frame     = 0;        //  タッチされてから話されるまでのフレーム数
    self.state     = 'none';   //  現在のタッチされている状態
    self.stateframe= 0;        //  現在の状態が維持されているフレーム数

    self.pos   = {x:0,y:0};    //  タッチされている位置の座標
    self.spd   = {x:0,y:0};    //  タッチの移動速度

    self.trgPos= {x:0,y:0};    //  trgされた位置の座標
    self.rlsPos= {x:0,y:0};    //  rlsされた位置の座標

    self.prvPos= {x:0,y:0};    //  前のフレームでタッチされていた位置の座標

    return self;
};


//------------------------------------------------------------------------------
//  タッチされた瞬間の状態にする
//------------------------------------------------------------------------------
Touch.prototype.setTrg = function( x, y ){

    this.frame     = 0;
    this.state     = 'trg';
    this.stateframe= 0;

    this.pos.x = x;
    this.pos.y = y;
    this.spd.x = 0;
    this.spd.y = 0;

    this.trgPos.x = x;
    this.trgPos.y = y;

    this.prvPos.x = x;
    this.prvPos.y = y;
};


//------------------------------------------------------------------------------
//  離された瞬間の状態にする
//------------------------------------------------------------------------------
Touch.prototype.setRls = function( x, y ) {

    this.state     = 'rls';
    this.stateframe= 0;

    this.pos.x = x;
    this.pos.y = y;

    this.rlsPos.x = x;
    this.rlsPos.y = y;
};


//------------------------------------------------------------------------------
//  更新
//------------------------------------------------------------------------------
Touch.prototype.update = function() {

    var pos    = this.pos;
    var spd    = this.spd;
    var prvPos = this.prvPos;

    //  移動速度の算出
    if( this.state == 'hld' ) {
        spd.x    = pos.x - prvPos.x;
        spd.y    = pos.y - prvPos.y;
        prvPos.x = pos.x;
        prvPos.y = pos.y;
    }

    //  タッチ状態の遷移
    if( this.state == 'trg' && this.stateframe > 0 ) {
        this.state = 'hld';
        this.stateframe = 0;
    }
    if( this.state == 'rls' && this.stateframe > 0 ) {
        this.state = 'none';
        this.stateframe = 0;
    }

    //  生存フレーム
    this.frame++;
    this.stateframe++;
};

})( window );
