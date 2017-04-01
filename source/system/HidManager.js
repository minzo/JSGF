//==============================================================================
//
//  HIDマネージャ [HIDManager.js]
//
//==============================================================================

(function( window, undefined ) {

// 初回タッチ
var _isFirstTap = false;

//------------------------------------------------------------------------------
//  コンストラクタ
//------------------------------------------------------------------------------
HidManager = function() {

    systemHidManager = this;
    var self = this;

    // タッチのリスト
    this.touches = [
        new Touch(),
        new Touch(),
        new Touch(),
        new Touch(),
        new Touch(),
        new Touch() // click 用オブジェクト
    ];

    // 最新のタッチを保持
    this.latestTouch = null;

    // 最古のタッチを保持
    this.oldestTouch = null;

    // 更新処理
    var update = function( touchEvent, delegate ) {
        touchEvent.preventDefault();
        var touches = touchEvent.changedTouches;
        for( var i=0,l=touches.length; i<l; i++) {
            var touch = touches[i];
            var index = touches[i].identifier % ( self.touches.length - 1 );
            delegate.call( self.touches[ index ], touch.clientX, touch.clientY );
        }
    }

    // Touch Event
    document.addEventListener( "touchstart", function( e ){
        //  iOS の mute を解除
        if( _isFirstTap ) { gSndMngr.play( 'mute' ); _isFirstTap = false; }
        update( e, Touch.prototype.setTrg );
    }, false );
    document.addEventListener( "touchmove", function( e ) {
        update( e, Touch.prototype.setPos );
    }, false );
    document.addEventListener( "touchend", function( e ) {
        update( e, Touch.prototype.setRls );
    }, false );
    document.addEventListener( "touchcancel", function( e ) {
        update( e, Touch.prototype.setRls );
    }, false );

    // Mouse Event
    document.addEventListener( "mousedown", function( e ) {
        e.preventDefault();
        self.touches[ self.touches.length - 1 ].setTrg( e.clientX, e.clientY );
    }, false );
    document.addEventListener( "mousemove", function( e ) {
        e.preventDefault();
        self.touches[ self.touches.length - 1 ].setPos( e.clientX, e.clientY );
    }, false );
    document.addEventListener( "mouseup", function( e ) {
        e.preventDefault();
        self.touches[ self.touches.length - 1 ].setRls( e.clientX, e.clientY );
    }, false );

    return this;
};

//------------------------------------------------------------------------------
//  更新
//  MEMO: 毎フレーム呼び出すことで入力状態を最新に保つ
//------------------------------------------------------------------------------
HidManager.prototype.update = function() {

    this.latestTouch = null;
    this.oldestTouch = null;

    var min = Number.MAX_SAFE_INTEGER;
    var max = Number.MIN_SAFE_INTEGER;

    for( var i=0, t = this.touches, l=t.length; i<l; i++)
    {
        t[ i ].update();

        // タッチされていない状態のものは更新しない
        if( !t[ i ].isValid() ) continue;

        // 最新と最古のタッチ情報を取得する
        var frame = t[ i ].state.getFrame();

        if( frame < min ) {
            min = frame;
            this.latestTouch = t[ i ];
        }

        if( frame > max ) {
            max = frame;
            this.oldestTouch = t[ i ];
        }
    }
};

//------------------------------------------------------------------------------
// 取得系
//------------------------------------------------------------------------------
HidManager.prototype.getLatestTouch = function () { return this.latestTouch; }
HidManager.prototype.getOldestTouch = function () { return this.oldestTouch; }

//------------------------------------------------------------------------------
//  Touch
//  MEMO: タッチの状態を保持するクラス
//------------------------------------------------------------------------------
var Touch = function() {

    this.state = new StateControl( 'none' );

    this.pos   = new VEC2( -1.0, -1.0 ); //  タッチされている位置の座標
    this.spd   = new VEC2( -1.0, -1.0 ); //  タッチの移動速度

    this.trgPos= new VEC2( -1.0, -1.0 ); //  trgされた座標
    this.rlsPos= new VEC2( -1.0, -1.0 ); //  rlsされた座標

    this.prvPos= new VEC2( -1.0, -1.0 ); //  前のフレームでタッチされていた座標

    return this;
};

//------------------------------------------------------------------------------
//  タッチされた瞬間の状態にする
//------------------------------------------------------------------------------
Touch.prototype.setTrg = function( x, y ){
    this.state.changeImmediately( 'trg' );
    this.pos.set( x, y );
    this.spd.setZero();
    this.trgPos.set( x, y );
    this.prvPos.set( x, y );
};

//------------------------------------------------------------------------------
//  離された瞬間の状態にする
//------------------------------------------------------------------------------
Touch.prototype.setRls = function( x, y ) {
    this.state.changeImmediately( 'rls' );
    this.pos.set( x, y );
    this.rlsPos.set( x, y );
};

//------------------------------------------------------------------------------
//  座標を設定する
//------------------------------------------------------------------------------
Touch.prototype.setPos = function( x, y ) {
    this.pos.set( x, y );
};

//------------------------------------------------------------------------------
//  状態取得
//------------------------------------------------------------------------------
Touch.prototype.isTrg = function() { return this.state.get() == 'trg'; };
Touch.prototype.isHld = function() { return this.state.get() == 'hld'; };
Touch.prototype.isRls = function() { return this.state.get() == 'rls'; };
Touch.prototype.isValid = function() { return this.state.get() != 'none'; };
Touch.prototype.getPos = function() { return this.pos; };
Touch.prototype.getSpd = function() { return this.spd; };

//------------------------------------------------------------------------------
//  更新
//------------------------------------------------------------------------------
Touch.prototype.update = function() {

    this.state.update();

    // none 状態は更新しなくていい
    if( !this.isValid() ) return;;

    var pos    = this.pos;
    var spd    = this.spd;
    var prvPos = this.prvPos;

    //  移動速度の算出
    if( this.state.get() == 'hld' ) {
        spd.x    = pos.x - prvPos.x;
        spd.y    = pos.y - prvPos.y;
        prvPos.x = pos.x;
        prvPos.y = pos.y;
    }

    //  タッチ状態の遷移
    if( this.state.get() == 'trg' ) {
        this.state.change( 'hld' );
    }

    if( this.state.get() == 'rls' ) {
        this.state.change( 'none' );
        this.stateframe = 0;
    }
};

})( window );
