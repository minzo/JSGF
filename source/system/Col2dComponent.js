//==============================================================================
//
//  衝突判定オブジェクト [ColliObject.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  Col2dComponent
//
//  @param visualizer コリジョンの可視化用 GfxComponent
//------------------------------------------------------------------------------
Col2dComponent = function( visualizer ) {
    Component.call( this );
    this.transform  = new Transform();
    this.visualizer = visualizer;
    return this;
};
Col2dComponent.prototype = new Component();

// コリジョンの可視化
Col2dComponent.isVisibleCollision = false;

//------------------------------------------------------------------------------
// 計算処理
//------------------------------------------------------------------------------
Col2dComponent.prototype.calc = function( owner ) {

    Component.prototype.calc.call( this, owner );

    this.transform.setParent( this.owner.transform );
    this.transform.resetUpdateFlag();
    this.transform.calc();

    if( Col2dComponent.isVisibleCollision && this.visualizer )
    {
        this.visualizer.calc( this );
    }
};

//------------------------------------------------------------------------------
// Util
//------------------------------------------------------------------------------
Col2dComponent.prototype.calcRectWorldVertices = function( rect ) {
    var pos   = rect.transform.getPos();
    var scale = rect.transform.getScale();
    var matrix= rect.transform.worldMtx;
    var top   = pos.y - scale.y / 2;
    var bottom= top   + scale.y;
    var left  = pos.x - scale.x / 2;
    var right = left  + scale.x;
    return [
        MTX34.multVEC3( matrix, new VEC3( left,  top, 0.0 )),    // 左上
        MTX34.multVEC3( matrix, new VEC3( right, top, 0.0 )),    // 右上
        MTX34.multVEC3( matrix, new VEC3( right, bottom, 0.0 )), // 右下
        MTX34.multVEC3( matrix, new VEC3( left,  bottom, 0.0 ))  // 左下
    ];
};

//------------------------------------------------------------------------------
//  衝突判定関数
//------------------------------------------------------------------------------
Col2dComponent.prototype.isHitPoint  = function( collision, callback ) {};
Col2dComponent.prototype.isHitCircle = function( collision, callback ) {};
Col2dComponent.prototype.isHitRect   = function( collision, callback ) {};


//------------------------------------------------------------------------------
//  円と線の交差判定
//------------------------------------------------------------------------------
Col2dComponent.prototype.isHitCircleLine = function( circle, posA, posB ) {

    var center = circle.getWorldPos();
    var radius = circle.getWorldScale().x;

    var S = VEC2.sub( posA, posB );
    var A = VEC2.sub( center, posA );
    var B = VEC2.sub( center, posB );

    var d = Math.abs( VEC2.cross( A, S ) ) / VEC2.dist( S );

    if( d < radius ) {
        if( VEC2.dot( A, S ) * VEC2.dot( B, S ) <= 0 ){ return true; }
        if( VEC2.dot( A, A ) < radius * radius ) { return true; }
        if( VEC2.dot( B, B ) < radius * radius ) { return true; }
    }

    return false;
};

//------------------------------------------------------------------------------
// 円と円の交差判定
//------------------------------------------------------------------------------
Col2dComponent.prototype.isHitCircleCircle = function( objA, objB ) {

    //  ObjA の World Space 座標
    var posA    = objA.transform.getWorldPos();
    var radiusA = objA.transform.getWorldScale().x;

    //  ObjB の World Space 座標
    var posB    = objB.transform.getWorldPos();
    var radiusB = objB.transform.getWorldScale().x;

    //  衝突判定
    var dx = posA.x - posB.x;
    var dy = posA.y - posB.y;
    var dr = radiusA + radiusB;

    return dx*dx + dy*dy < dr*dr;
};

//------------------------------------------------------------------------------
// 矩形と矩形の交差判定
//------------------------------------------------------------------------------
Col2dComponent.prototype.isHitRectRect = function( objA, objB ) {

    var U = this.calcRectWorldVertices( objA );
    var V = this.calcRectWorldVertices( objB );

    //  objA を囲むベクトルの計算
    var U0 = VEC2.sub( U[1], U[0] );
    var U1 = VEC2.sub( U[2], U[1] );
    var U2 = VEC2.sub( U[3], U[2] );
    var U3 = VEC2.sub( U[0], U[3] );

    //  衝突判定
    //  objB の各頂点が objA の矩形内にあるか調べる
    for( var i=0; i<4; i++ ) {

        // objA の各頂点から objB のある頂点へ向かうベクトル
        var V0 = VEC2.sub( V[i], U[0] );
        var V1 = VEC2.sub( V[i], U[1] );
        var V2 = VEC2.sub( V[i], U[2] );
        var V3 = VEC2.sub( V[i], U[3] );

        if( VEC2.cross( U0, V0 ) >= 0 && VEC2.cross( U1, V1 ) >= 0 &&
            VEC2.cross( U2, V2 ) >= 0 && VEC2.cross( U3, V3 ) >= 0 ){
            return true;
        }
    }

    return false;
};

//------------------------------------------------------------------------------
// 円と矩形の衝突判定
//------------------------------------------------------------------------------
Col2dComponent.prototype.isHitCircleRect = function( circle, rect ) {

    var center = circle.getWorldPos();
    var radius = circle.getWorldScale().x;

    var vertices = this.calcRectWorldVertices( rect );

    if( this.isHitCircleLine( circle, vertices[0], vertices[1] ) ||
        this.isHitCircleLine( circle, vertices[0], vertices[2] ) ||
        this.isHitCircleLine( circle, vertices[0], vertices[3] ) ||
        this.isHitCircleLine( circle, vertices[0], vertices[0] ) ){
        return true;
    }
    return false;
};

//------------------------------------------------------------------------------
// 点と円の交差判定
//------------------------------------------------------------------------------
Col2dComponent.prototype.isHitPointCircle = function( point, circle ) {
    var center = circle.transform.getWorldPos();
    var radius = circle.transform.getWorldScale().x;
    return VEC2.sub( center, point ).squaredLength() < radius * radius;
};

//------------------------------------------------------------------------------
// 点と矩形の衝突判定
//------------------------------------------------------------------------------
Col2dComponent.prototype.isHitPointRect = function( point, rect ) {

    var U = this.calcRectWorldVertices( rect );

    var U0 = VEC2.sub( U[1], U[0] );
    var U1 = VEC2.sub( U[2], U[1] );
    var U2 = VEC2.sub( U[3], U[2] );
    var U3 = VEC2.sub( U[0], U[3] );

    var V0 = VEC2.sub( point, U[0] );
    var V1 = VEC2.sub( point, U[1] );
    var V2 = VEC2.sub( point, U[2] );
    var V3 = VEC2.sub( point, U[3] );

    return VEC2.cross( U0, V0 ) >= 0 && VEC2.cross( U1, V1 ) >= 0 &&
           VEC2.cross( U2, V2 ) >= 0 && VEC2.cross( U3, V3 ) >= 0;
};


//------------------------------------------------------------------------------
//  Col2dRect
//
//  @param[in] x      中心X座標
//  @param[in] y      中心Y座標
//  @param[in] w      幅
//  @param[in] h      高さ
//------------------------------------------------------------------------------
Col2dRect = function( w, h ) {
    Col2dComponent.call( this, new Gfx2dRect( 1.0, 1.0, Gfx2dStyle.EdgeRed() ) );
    this.transform.setScale( w, h, 1.0 );
    return this;
};
Col2dRect.prototype = new Col2dComponent();

//------------------------------------------------------------------------------
//  衝突判定関数
//
//  @param[in] colli    衝突判定対象のオブジェクト
//  @param[in] callback 衝突応答コールバック関数
//  @return    bool     衝突していれば true
//------------------------------------------------------------------------------
Col2dRect.prototype.isHitPoint = function( collision, callback ) {
    var isHit = this.isHitPointRect( collision, this );
    if( isHit && callback != undefined ) callback();
    return isHit;
}
Col2dRect.prototype.isHitCircle= function( collision, callback ) {
    var isHit = this.isHitCircleRect( collision, this );
    if( isHit && callback != undefined ) callback();
    return isHit;
};
Col2dRect.prototype.isHitRect  = function( collision, callback ) {
    var isHit = this.isHitRectRect( collision, this );
    if( isHit && callback != undefined ) callback();
    return isHit;
};

//------------------------------------------------------------------------------
//  Col2dRect
//
//  @param[in] r 半径
//------------------------------------------------------------------------------
Col2dCircle = function( r ) {
    Col2dComponent.call( this, new Gfx2dCircle( 1.0, Gfx2dStyle.EdgeRed() ));
    this.transform.setScale( r, r, 1.0 );
    return this;
};
Col2dCircle.prototype = new Col2dComponent();

//------------------------------------------------------------------------------
//  衝突判定関数
//
//  @param[in] colli    衝突判定対象のオブジェクト
//  @param[in] callback 衝突応答コールバック関数
//  @return    bool     衝突していれば true
//------------------------------------------------------------------------------
Col2dCircle.prototype.isHitPoint = function( collision, callback ) {
    var isHit = this.isHitPointCircle( collision, this );
    if( isHit && callback != undefined ) callback();
    return isHit;
};
Col2dCircle.prototype.isHitCircle= function( collision, callback ) {
    var isHit = this.isHitCircleCircle( collision, this );
    if( isHit && callback != undefined ) callback();
    return isHit;
};
Col2dCircle.prototype.isHitRect  = function( collision, callback ) {
    var isHit = this.isHitCircleRect( this, collision );
    if( isHit && callback != undefined ) callback();
    return isHit;
};

})( window );
