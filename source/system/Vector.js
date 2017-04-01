//==============================================================================
//
//  ベクトル [Vector.js]
//
//==============================================================================

(function( window, undefined ){

//------------------------------------------------------------------------------
//  2次元ベクトルクラス
//------------------------------------------------------------------------------
VEC2 = function( x, y ) {
    this.x = x; this.y = y;
    return this;
};

//------------------------------------------------------------------------------
//  複製する
//------------------------------------------------------------------------------
VEC2.prototype.clone = function() {
    return new VEC2(this.x, this.y);
};
VEC2.prototype.toVEC3 = function() {
    return new VEC3(this.x, this.y, 0.0);
};

//------------------------------------------------------------------------------
//  値を設定する
//------------------------------------------------------------------------------
VEC2.prototype.set = function(x, y) {
    this.x = x; this.y = y;
    return this;
};
VEC2.prototype.setZero = function() {
    this.x = 0.0; this.y = 0.0;
    return this;
};

//------------------------------------------------------------------------------
//  加算・減算・乗算・内積・外積
//------------------------------------------------------------------------------
//  加算
VEC2.prototype.add = function( V1 ) {
    this.x += V1.x; this.y += V1.y;
    return this;
};
//  減算
VEC2.prototype.sub = function( V1 ) {
    this.x -= V1.x; this.y -= V1.y;
    return this;
};
//  乗算(要素どうしをかける)
VEC2.prototype.mult = function( V1 ) {
    this.x *= V1.x; this.y *= V1.y;
    return this;
};
//  内積
VEC2.prototype.dot = function( V1 ) {
    return this.x * V1.x + this.y * V1.y;
};
//  外積
VEC2.prototype.cross = function( V1 ) {
    return this.x * V1.y - this.y * V1.x;
};

//------------------------------------------------------------------------------
//  その他操作
//------------------------------------------------------------------------------
//  正規化 (戻り値で長さを返します)
VEC2.prototype.normalize = function () {
    var length = this.length();
    if( length == 0 ) return length;
    this.x /= length;
    this.y /= length;
    return length;
};
// 長さをあわせる
VEC2.prototype.adjustLength = function( length ) {
    this.normalize();
    this.x *= length;
    this.y *= length;
    return this;
};
// 長さを取得
VEC2.prototype.length = function() {
    return Math.sqrt( this.squaredLength() );
};
// 2乗した長さ
VEC2.prototype.squaredLength = function() {
    return this.x * this.x + this.y * this.y;
};

//------------------------------------------------------------------------------
//  加算・減算・乗算・内積・外甥 - クラスメソッド
//------------------------------------------------------------------------------
//  加算
VEC2.add = function( V1, V2 ) {
    return new VEC2( V1.x + V2.x, V1.y + V2.y );
};
//  減算
VEC2.sub = function( V1, V2 ) {
    return new VEC2( V1.x - V2.x, V1.y - V2.y );
};
//  乗算
VEC2.mult = function( V1, V2 ) {
    return new VEC2( V1.x * V2.x, V1.y * V2.y );
};
//  内積
VEC2.dot = function( V1, V2 ) {
    return V1.dot(V2);
};
//  外積
VEC2.cross = function( V1, V2 ) {
    return V1.cross( V2 );
};
// 2乗した距離
VEC2.squaredDistance = function( V1, V2 ) {
    var dx = V1.x - V2.x;
    var dy = V1.y - V2.y;
    return dx * dx + dy * dy;
};
// 距離
VEC2.distance = function( V1, V2 ) {
    return Math.sqrt( VEC2.squaredDistance( V1, V2 ) );
};

// 単位ベクトル取得
VEC2.ex = function() { return new VEC2( 1.0, 0.0 ); };
VEC2.ey = function() { return new VEC2( 0.0, 1.0 ); };


//------------------------------------------------------------------------------
//  3次元ベクトルクラス
//------------------------------------------------------------------------------
VEC3 = function(x, y, z) {
    this.x = x; this.y = y; this.z = z;
    return this;
};

//------------------------------------------------------------------------------
//  複製する
//------------------------------------------------------------------------------
VEC3.prototype.clone = function() {
    return new VEC3( this.x, this.y, this.z );
};

//------------------------------------------------------------------------------
//  値を設定する
//------------------------------------------------------------------------------
VEC3.prototype.set = function(x, y, z) {
    this.x = x; this.y = y; this.z=z;
    return this;
};
VEC3.prototype.setZero = function() {
    this.x = 0; this.y = 0; this.z=0;
    return this;
};

//------------------------------------------------------------------------------
//  加算・減算・乗算・内積・外積
//------------------------------------------------------------------------------
//  加算
VEC3.prototype.add = function( V1 ) {
    this.x += V1.x; this.y += V1.y; this.z += V1.z;
    return this;
};
//  減算
VEC3.prototype.sub = function( V1 ) {
    this.x -= V1.x; this.y -= V1.y; this.z -= V1.z;
    return this;
};
//  乗算(要素どうしをかける)
VEC3.prototype.mult = function( V1 ) {
    this.x *= V1.x; this.y *= V1.y; this.z *= V1.z;
    return this;
};
//  内積
VEC3.prototype.dot = function( V1 ) {
    return this.x * V1.x + this.y * V1.y + this.z * V1.z;
};
//  外積
VEC3.prototype.cross = function( V1 ) {
    var x = this.y * V1.z - this.z * V1.y;
    var y = this.z * V1.x - this.x * V1.z;
    var z = this.x * V1.y - this.y * V1.x;
    return new VEC3( x, y, z );
};

//------------------------------------------------------------------------------
//  その他操作
//------------------------------------------------------------------------------
//  正規化 (戻り値で長さを返します)
VEC3.prototype.normalize = function () {
    var length = this.length();
    if( length == 0 ) return length;
    this.x /= length;
    this.y /= length;
    this.z /= length;
    return length;
};
// 長さをあわせる
VEC3.prototype.adjustLength = function( length ) {
    this.normalize();
    this.x *= length;
    this.y *= length;
    this.z *= length;
    return this;
};
// 長さを取得
VEC3.prototype.length = function() {
    return Math.sqrt( this.squaredLength() );
};
// 2乗した長さ
VEC3.prototype.squaredLength = function() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
};

//------------------------------------------------------------------------------
//  加算・減算・乗算・内積・外甥 - クラスメソッド
//------------------------------------------------------------------------------
//  加算
VEC3.add = function( V1, V2 ) {
    return new VEC3( V1.x + V2.x, V1.y + V2.y, V1.z + V2.z );
};
//  減算
VEC3.sub = function( V1, V2 ) {
    return new VEC3( V1.x,- V2.x, V1.y - V2.y, V1.z - V2.z );
};
//  乗算
VEC3.mult = function( V1, V2 ) {
    return new VEC3( V1.x * V2.x, V1.y * V2.y, V1.z * V2.z );
};
//  内積
VEC3.dot = function( V1, V2 ) {
    return V1.dot(V2);
};
//  外積
VEC3.cross = function( V1, V2 ) {
    return V1.cross( V2 );
};
// 2乗した距離
VEC3.squaredDistance = function( V1, V2 ) {
    var dx = V1.x - V2.x;
    var dy = V1.y - V2.y;
    var dz = V1.z - V2.z;
    return dx * dx + dy * dy + dz * dz;
};
// 距離
VEC3.distance = function( V1, V2 ) {
    return Math.sqrt( VEC2.squaredDistance( V1, V2 ) );
};

// 単位ベクトルを取得
VEC3.ex = function() { return new VEC3(1.0, 0.0, 0.0); };
VEC3.ey = function() { return new VEC3(0.0, 1.0, 0.0); };
VEC3.ez = function() { return new VEC3(0.0, 0.0, 1.0); };


})( window );
