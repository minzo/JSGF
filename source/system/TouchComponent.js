//==============================================================================
//
//  タッチオブジェクト [TouchObject.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  TouchComponent
//------------------------------------------------------------------------------
TouchComponent = function( collision ) {
    Component.call( this );
    this.collision = collision;
    this.state = new StateControl( 'none' );
    return this;
};
TouchComponent.prototype = new Component();

//------------------------------------------------------------------------------
// 計算処理
//------------------------------------------------------------------------------
TouchComponent.prototype.calc = function( owner ) {

    Component.prototype.calc.call( this, owner );

    this.state.update();

    // owner の子として collision を設定
    this.collision.transform.setParent( this.owner.transform );
    this.collision.calc( this.owner );

    var touch = systemHidManager.getOldestTouch();

    // タッチしてなかったら状態を戻す
    if( touch == null ) {
        this.state.changeInitState();
        return;
    }

    var isNotInitState = this.state.get() != this.state.initState;

    if( touch.isTrg() && this.collision.isHitPoint( touch.pos ) ) {
        this.state.change( 'trg' );
    }
    else if( touch.isRls() && isNotInitState ) {
        this.state.change( 'rls' );
    }
    else if( touch.isHld() && isNotInitState ) {
        this.state.change( 'hld' );
    }

    // 初期ステートでなければタッチされているのでドラッグ処理
    if( isNotInitState ) {
        var inverse = this.owner.transform.worldMtx.inverse();
        // translate 成分を消す
        inverse.m03 = 0.0;
        inverse.m13 = 0.0;
        inverse.m23 = 0.0;
        this.owner.transform.getPos().add( MTX34.multVEC3( inverse, touch.spd.toVEC3() ) );
    }
};

//------------------------------------------------------------------------------
//  TouchRect
//------------------------------------------------------------------------------
TouchRect = class extends TouchComponent {
    //--------------------------------------------------------------------------
    //  コンストラクタ
    //  @param[in] w  幅
    //  @param[in] h  高さ
    //--------------------------------------------------------------------------
    constructor( w, h ) { super( new Col2dRect( w, h ) ); }
};

//------------------------------------------------------------------------------
//  TouchCircle
//------------------------------------------------------------------------------
TouchCircle = class extends TouchComponent {
    //--------------------------------------------------------------------------
    //  @param[in] r  半径
    //--------------------------------------------------------------------------
    constructor( r ) { super( new Col2dCircle( r ) ); }
};

})( window );
