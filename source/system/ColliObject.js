//==============================================================================
//
//  衝突判定オブジェクト [ColliObject.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  ColliObject
//
//  @param[in] x      左上X座標
//  @param[in] y      左上Y座標
//  @param[in] w      幅
//  @param[in] h      高さ
//------------------------------------------------------------------------------
ColliObject = function( x, y, w, h, parent ) {
    GfxObject.call( this, x, y, w, h, 'rgba(255,0,0,0.2)' );
    this.setParent( parent );
};
ColliObject.prototype = new GfxObject();

//------------------------------------------------------------------------------
//  描画
//
//  @param[in] bVisible true で判定領域を描画する
//------------------------------------------------------------------------------
ColliObject.prototype.draw = function( bVisible ) {
    if( bVisible && gIsVisibleCollision ) systemGfxManager.entryDrawList( this );
};

//------------------------------------------------------------------------------
//  衝突判定関数 (Canvas座標で判定計算する)
//------------------------------------------------------------------------------
ColliObject.prototype.isHitRect   = function( colli, callback ) {};
ColliObject.prototype.isHitCircle = function( colli, callback ) {};


//------------------------------------------------------------------------------
//  円と線の交差判定
//------------------------------------------------------------------------------
ColliObject.prototype.isHitCircleLine = function( px,py,radius, sx,sy, tx,ty ) {

    var S = { x:sx-tx, y:sy-ty };
    var A = { x:px-sx, y:py-sy };
    var B = { x:px-tx, y:py-ty };

    var d = Math.abs( VEC2.cross( A, S ) ) / VEC2.dist( S );

    if( d < radius ) {
        if( VEC2.dot( A, S ) * VEC2.dot( B, S ) <= 0 ){ return true; }
        if( VEC2.dot( A, A ) < radius * radius ) { return true; }
        if( VEC2.dot( B, B ) < radius * radius ) { return true; }
    }

    return false;
};


//------------------------------------------------------------------------------
//  ColliRect
//
//  @param[in] x      左上X座標
//  @param[in] y      左上Y座標
//  @param[in] w      幅
//  @param[in] h      高さ
//------------------------------------------------------------------------------
ColliRect = function( x, y, w, h, parent ) {
    var self = this instanceof ColliRect
             ? this
             : Object.create( ColliRect.prototype );
    ColliObject.call( self, x, y, w, h, parent );
    return self;
};
ColliRect.prototype = new ColliObject();
ColliRect.prototype.proc = GfxRect.prototype.proc;

//------------------------------------------------------------------------------
//  衝突判定関数 (Canvas座標で判定計算する)
//
//  @param[in] colli    衝突判定対象のオブジェクト
//  @param[in] callback 衝突応答コールバック関数
//  @return    bool     衝突していれば true
//------------------------------------------------------------------------------
ColliRect.prototype.isHitRect  = function( colli, callback ) {

    this.transform( this.bUpdateMatrix = false );
    colli.transform( colli.bUpdateMatrix=false );

    //  自身のCanvas座標を算出
    var vPos = this.pos;
    var vSize= this.size;
    var vMtx = this.matrix;
    var v = [
        MTX33.multVEC2( vMtx, { x:vPos.x,         y:vPos.y } ),
        MTX33.multVEC2( vMtx, { x:vPos.x+vSize.x, y:vPos.y } ),
        MTX33.multVEC2( vMtx, { x:vPos.x+vSize.x, y:vPos.y+vSize.y } ),
        MTX33.multVEC2( vMtx, { x:vPos.x,         y:vPos.y+vSize.y } )
    ];

    //  対象のCanvas座標を算出
    var uPos = colli.pos;
    var uSize= colli.size;
    var uMtx = colli.matrix;
    var u = [
        MTX33.multVEC2( uMtx, { x:uPos.x,         y:uPos.y } ),
        MTX33.multVEC2( uMtx, { x:uPos.x+vSize.x, y:uPos.y } ),
        MTX33.multVEC2( uMtx, { x:uPos.x+vSize.x, y:uPos.y+uSize.y } ),
        MTX33.multVEC2( uMtx, { x:uPos.x,         y:uPos.y+uSize.y } )
    ];

    //  自身を囲むベクトルの計算
    var V0 = { x:v[1].x-v[0].x, y:v[1].y-v[0].y };
    var V1 = { x:v[2].x-v[1].x, y:v[2].y-v[1].y };
    var V2 = { x:v[3].x-v[2].x, y:v[3].y-v[2].y };
    var V3 = { x:v[0].x-v[3].x, y:v[0].y-v[3].y };

    //  衝突判定
    for( var i=0; i<4; i++ ) {
        var U0 = { x:u[i].x-v[0].x, y:u[i].y-v[0].y };
        var U1 = { x:u[i].x-v[1].x, y:u[i].y-v[1].y };
        var U2 = { x:u[i].x-v[2].x, y:u[i].y-v[2].y };
        var U3 = { x:u[i].x-v[3].x, y:u[i].y-v[3].y };

        if( VEC2.cross( V0, U0 ) >= 0 && VEC2.cross( V1, U1 ) >= 0 &&
            VEC2.cross( V2, U2 ) >= 0 && VEC2.cross( V3, U3 ) >= 0 ){
            if( callback != undefined ) callback();
            colli.bUpdateMatrix = false;
            return true;
        }
    }

    return false;
};
ColliRect.prototype.isHitCircle= function( colli, callback ) {

    this.transform( this.bUpdateMatrix = false );
    colli.transform( colli.bUpdateMatrix=false );

    //  自身のCanvas座標を算出
    var vPos = this.pos;
    var vSize= this.size;
    var vMtx = this.matrix;
    var v = [
        MTX33.multVEC2( vMtx, { x:0,       y:0 } ),
        MTX33.multVEC2( vMtx, { x:vSize.x, y:0 } ),
        MTX33.multVEC2( vMtx, { x:vSize.x, y:vSize.y } ),
        MTX33.multVEC2( vMtx, { x:0,       y:vSize.y } )
    ];

    //  対象のCanvas座標を算出
    var uPos = colli.pos;
    var uSize= colli.size;
    var uMtx = colli.matrix;
    var u = MTX33.multVEC2( uMtx, { x:uSize.x/2, y:uSize.y/2 } );
    var uRdis= uSize.x / 2;

    if( this.isHitCircleLine( u.x, u.y, uRdis, v[0].x,v[0].y, v[1].x,v[1].y ) ||
        this.isHitCircleLine( u.x, u.y, uRdis, v[1].x,v[1].y, v[2].x,v[2].y ) ||
        this.isHitCircleLine( u.x, u.y, uRdis, v[2].x,v[2].y, v[3].x,v[3].y ) ||
        this.isHitCircleLine( u.x, u.y, uRdis, v[3].x,v[3].y, v[0].x,v[0].y ) ){

        if( callback != undefined ) callback();
        colli.bUpdateMatrix = false;
        return true;
    }

    return false;
};


//------------------------------------------------------------------------------
//  ColliCircle
//
//  @param[in] x      左上X座標
//  @param[in] y      左上Y座標
//  @param[in] w      幅
//  @param[in] h      高さ
//------------------------------------------------------------------------------
ColliCircle = function( x, y, w, h, parent ) {
    var self = this instanceof ColliCircle
             ? this
             : Object.create( ColliCircle.prototype );
    ColliObject.call( self, x, y, w, h, parent );
    return self;
};
ColliCircle.prototype = new ColliObject();
ColliCircle.prototype.proc = GfxCircle.prototype.proc;

//------------------------------------------------------------------------------
//  衝突判定関数 (Canvas座標で判定計算する)
//
//  @param[in] colli    衝突判定対象のオブジェクト
//  @param[in] callback 衝突応答コールバック関数
//  @return    bool     衝突していれば true
//------------------------------------------------------------------------------
ColliCircle.prototype.isHitRect  = function( colli, callback ) {

    this.transform( this.bUpdateMatrix = false );
    colli.transform( colli.bUpdateMatrix=false );

    //  自身のCanvas座標を算出
    var vPos = this.pos;
    var vSize= this.size;
    var vMtx = this.matrix;
    var vv= MTX33.multVEC2( vMtx, { x:vPos.x+vSize.x/2, y:vPos.y } );
    var v = MTX33.multVEC2( vMtx, { x:vPos.x+vSize.x/2, y:vPos.y+vSize.x/2 } );
    var vRdis= Math.sqrt( (v.x-vv.x)*(v.x-vv.x)+(v.y-vv.y)*(v.y-vv.y) );

    //  対象のCanvas座標を算出
    var uPos = colli.pos;
    var uSize= colli.size;
    var uMtx = colli.matrix;
    var u = [
        MTX33.multVEC2( uMtx, { x:uPos.x,         y:uPos.y } ),
        MTX33.multVEC2( uMtx, { x:uPos.x+uSize.x, y:uPos.y } ),
        MTX33.multVEC2( uMtx, { x:uPos.x+uSize.x, y:uPos.y+uSize.y } ),
        MTX33.multVEC2( uMtx, { x:uPos.x,         y:uPos.y+uSize.y } )
    ];

    if( this.isHitCircleLine( u.x, u.y, vRdis, u[0].x,u[0].y, u[1].x,u[1].y ) ||
        this.isHitCircleLine( u.x, u.y, vRdis, u[1].x,u[1].y, u[2].x,u[2].y ) ||
        this.isHitCircleLine( u.x, u.y, vRdis, u[2].x,u[2].y, u[3].x,u[3].y ) ||
        this.isHitCircleLine( u.x, u.y, vRdis, u[3].x,u[3].y, u[0].x,u[0].y ) ){
        if( callback != undefined ) callback();
        colli.bUpdateMatrix = false;
        return true;
    }
    return false;
};
ColliCircle.prototype.isHitCircle= function( colli, callback ) {

    this.transform( this.bUpdateMatrix = false );
    colli.transform( colli.bUpdateMatrix=false );

    //  自身のCanvas座標を算出
    var vRdis= this.size.x / 2;
    var vMtx = this.matrix;
    var vCtr = MTX33.multVEC2( vMtx, { x:vRdis, y:vRdis } );


    //  衝突対象のCanvas座標を算出
    var uRdis= colli.size.x / 2;
    var uMtx = colli.matrix;
    var uCtr = MTX33.multVEC2( uMtx, { x:uRdis, y:uRdis } );

    //  衝突判定
    var dx = uCtr.x - vCtr.x;
    var dy = uCtr.y - vCtr.y;
    var dr = uRdis  + vRdis;

    if( dx * dx + dy * dy < dr * dr ) {
        if( callback != undefined ) callback();
        colli.bUpdateMatrix = false;
        return true;
    }

    return false;
};

})( window );
