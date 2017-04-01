//==============================================================================
//
//  行列 [Matrix.js]
//
//==============================================================================

(function( window, undefined ){

//------------------------------------------------------------------------------
//  2x3 行列クラス
//------------------------------------------------------------------------------
MTX23 = function() {
    this.m00 = 1.0; this.m01 = 0.0; this.m02 = 0.0;
    this.m10 = 0.0; this.m11 = 1.0; this.m12 = 0.0;
    return this;
};

//------------------------------------------------------------------------------
//  値を設定する
//------------------------------------------------------------------------------
//  0行列
MTX23.prototype.setZero = function() {
    this.m00 = 0.0; this.m01 = 0.0; this.m02 = 0.0;
    this.m10 = 0.0; this.m11 = 0.0; this.m12 = 0.0;
    return this;
};
//  単位行列
MTX23.prototype.setIdentity = function() {
    this.m00 = 1.0; this.m01 = 0.0; this.m02 = 0.0;
    this.m10 = 0.0; this.m11 = 1.0; this.m12 = 0.0;
    return this;
};
//  移動
MTX23.prototype.setTranslate = function( tx, ty ) {
    this.m00 = 1.0; this.m01 = 0.0; this.m02 = tx;
    this.m10 = 0.0; this.m11 = 1.0; this.m12 = ty;
    return this;
};
//  拡大・縮小
MTX23.prototype.setScale = function( sx, sy ) {
    this.m00 = sx; this.m01 =0.0; this.m02 = 0.0;
    this.m10 =0.0; this.m11 = sy; this.m12 = 0.0;
    return this;
};
//  回転
MTX23.prototype.setRotate = function( r ) {
    var c = Math.cos( rad );
    var s = Math.sin( rad );
    this.m00 = c;   this.m01 = s;   this.m02 = 0.0;
    this.m10 = -s;  this.m11 = c;   this.m12 = 0.0;
    return this;
};

// 複製する
MTX23.prototype.clone = function () {
    var m = new MTX23();
    m.m00 = this.m00; m.m01 = this.m01; m.m02 = this.m02;
    m.m10 = this.m10; m.m11 = this.m11; m.m12 = this.m12;
    return m;
}

//------------------------------------------------------------------------------
//  加算・減算・乗算
//------------------------------------------------------------------------------
//  加算
MTX23.prototype.add  = function( M1 ) {
    this.m00 += M1.m00; this.m01 += M1.m01; this.m02 += M1.m02;
    this.m10 += M1.m10; this.m11 += M1.m11; this.m12 += M1.m12;
    return this;
};
//  減算
MTX23.prototype.sub  = function( M1 ) {
    this.m00 -= M1.m00; this.m01 -= M1.m01; this.m02 -= M1.m02;
    this.m10 -= M1.m10; this.m11 -= M1.m11; this.m12 -= M1.m12;
    return this;
};
//  乗算
MTX23.prototype.mult = function( M1 ) {
    var m00 = this.m00, m01 = this.m01, m02 = this.m02;
    var m10 = this.m10, m11 = this.m11, m12 = this.m12;
    this.m00 = m00*M1.m00 + m01*M1.m10;
    this.m01 = m00*M1.m01 + m01*M1.m11;
    this.m02 = m00*M1.m02 + m01*M1.m12 + m02;
    this.m10 = m10*M1.m00 + m11*M1.m10;
    this.m11 = m10*M1.m01 + m11*M1.m11;
    this.m12 = m10*M1.m02 + m11*M1.m12 + m12;
    return this;
};

//------------------------------------------------------------------------------
//  逆行列
//------------------------------------------------------------------------------
MTX23.prototype.inverse = function() {
    var m00 = this.m00, m01 = this.m01, m02 = this.m02;
    var m10 = this.m10, m11 = this.m11, m12 = this.m12;
    var det = m00*m11 - m10*m01;
    var M = new MTX23();
    M.m00 = ( m11) / det;
    M.m01 = (-m01) / det;
    M.m02 = ( m01*m12 - m02*m11 ) / det;
    M.m10 = (-m10) / det;
    M.m11 = ( m00) / det;
    M.m12 = ( m02*m10 - m00*m12 ) / det;
    return M;
};

//------------------------------------------------------------------------------
//  アフィン変換
//------------------------------------------------------------------------------
//  移動
MTX23.prototype.translate = function( tx, ty ) {
    this.m02 += this.m00 * tx + this.m01 * ty;
    this.m12 += this.m10 * tx + this.m11 * ty;
    return this;
};
//  拡大・縮小
MTX23.prototype.scale     = function( sx, sy ) {
    this.m00 *= sx; this.m01 *= sy;
    this.m10 *= sx; this.m11 *= sy;
    return this;
};
//  回転
MTX23.prototype.rotate    = function( rad ) {
    var c = Math.cos( rad );
    var s = Math.sin( rad );
    var m00 = this.m00, m01 = this.m01;
    var m10 = this.m10, m11 = this.m11;
    this.m00 = c * m00 + s * m01;
    this.m10 = c * m10 + s * m11;
    this.m01 = c * m01 - s * m00;
    this.m11 = c * m11 - s * m10;
    return this;
};

//------------------------------------------------------------------------------
//  加算・減算・乗算 - クラスメソッド
//------------------------------------------------------------------------------
//  加算
MTX23.add  = function( M1, M2 ) {
    var M = new MTX23();
    M.m00=M1.m00+M2.m00; M.m01=M1.m01+M2.m01; M.m02=M1.m02+M2.m02;
    M.m10=M1.m10+M2.m10; M.m11=M1.m11+M2.m11; M.m12=M1.m12+M2.m12;
    return M;
};
//  減算
MTX23.sub  = function( M1, M2 ) {
    var M = new MTX23();
    M.m00=M1.m00-M2.m00; M.m01=M1.m01-M2.m01; M.m02=M1.m02-M2.m02;
    M.m10=M1.m10-M2.m10; M.m11=M1.m11-M2.m11; M.m12=M1.m12-M2.m12;
    return M;
};
//  乗算
MTX23.mult = function( M1, M2 ) {
    var M = new MTX23();
    M.m00 = M1.m00*M2.m00 + M1.m01*M2.m10;
    M.m01 = M1.m00*M2.m01 + M1.m01*M2.m11;
    M.m02 = M1.m00*M2.m02 + M1.m01*M2.m12 + M1.m02;
    M.m10 = M1.m10*M2.m00 + M1.m11*M2.m10;
    M.m11 = M1.m10*M2.m01 + M1.m11*M2.m11;
    M.m12 = M1.m10*M2.m02 + M1.m11*M2.m12 + M1.m12;
    return M;
};

//------------------------------------------------------------------------------
//  2次元ベクトルとの乗算 - クラスメソッド
//------------------------------------------------------------------------------
MTX23.multVEC2 = function( M, V ) {
    return new VEC2().set(
        M.m00*V.x + M.m01*V.y + M.m02,
        M.m10*V.x + M.m11*V.y + M.m12
    );
};


//------------------------------------------------------------------------------
//  3x3 行列クラス
//------------------------------------------------------------------------------
MTX33 = function() {
    this.m00 = 1.0; this.m01 = 0.0; this.m02 = 0.0;
    this.m10 = 0.0; this.m11 = 1.0; this.m12 = 0.0;
    this.m20 = 0.0; this.m21 = 0.0; this.m22 = 1.0;
    return this;
};

//------------------------------------------------------------------------------
//  値を設定する
//------------------------------------------------------------------------------
//  0行列
MTX33.prototype.setZero = function() {
    this.m00 = 0.0; this.m01 = 0.0; this.m02 = 0.0;
    this.m10 = 0.0; this.m11 = 0.0; this.m12 = 0.0;
    this.m20 = 0.0; this.m21 = 0.0; this.m22 = 0.0;
    return this;
};
//  単位行列
MTX33.prototype.setIdentity = function() {
    this.m00 = 1.0; this.m01 = 0.0; this.m02 = 0.0;
    this.m10 = 0.0; this.m11 = 1.0; this.m12 = 0.0;
    this.m20 = 0.0; this.m21 = 0.0; this.m22 = 1.0;
    return this;
};
//  移動
MTX33.prototype.setTranslate = function( tx, ty ) {
    this.m00 = 1.0; this.m01 = 0.0; this.m02 = tx;
    this.m10 = 0.0; this.m11 = 1.0; this.m12 = ty;
    this.m20 = 0.0; this.m21 = 0.0; this.m22 = 1.0;
    return this;
};
//  拡大・縮小
MTX33.prototype.setScale = function( sx, sy ) {
    this.m00 = sx; this.m01 =0.0; this.m02 = 0.0;
    this.m10 =0.0; this.m11 = sy; this.m12 = 0.0;
    this.m20 =0.0; this.m21 =0.0; this.m22 = 1.0;
    return this;
};
//  回転
MTX33.prototype.setRotate = function( r ) {
    var c = Math.cos( rad );
    var s = Math.sin( rad );
    this.m00 = c;   this.m01 = s;   this.m02 = 0.0;
    this.m10 = -s;  this.m11 = c;   this.m12 = 0.0;
    this.m20 = 0.0; this.m21 = 0.0; this.m22 = 1.0;
    return this;
};

// 複製する
MTX33.prototype.clone = function () {
    var m = new MTX33();
    m.m00 = this.m00; m.m01 = this.m01; m.m02 = this.m02;
    m.m10 = this.m10; m.m11 = this.m11; m.m12 = this.m12;
    m.m20 = this.m20; m.m21 = this.m21; m.m22 = this.m22;
    return m;
}

//------------------------------------------------------------------------------
//  加算・減算・乗算
//------------------------------------------------------------------------------
//  加算
MTX33.prototype.add  = function( M1 ) {
    this.m00 += M1.m00; this.m01 += M1.m01; this.m02 += M1.m02;
    this.m10 += M1.m10; this.m11 += M1.m11; this.m12 += M1.m12;
    this.m20 += M1.m20; this.m21 += M1.m21; this.m22 += M1.m22;
    return this;
};
//  減算
MTX33.prototype.sub  = function( M1 ) {
    this.m00 -= M1.m00; this.m01 -= M1.m01; this.m02 -= M1.m02;
    this.m10 -= M1.m10; this.m11 -= M1.m11; this.m12 -= M1.m12;
    this.m20 -= M1.m20; this.m21 -= M1.m21; this.m22 -= M1.m22;
    return this;
};
//  乗算
MTX33.prototype.mult = function( M1 ) {
    var m00 = this.m00, m01 = this.m01, m02 = this.m02;
    var m10 = this.m10, m11 = this.m11, m12 = this.m12;
    var m20 = this.m20, m21 = this.m21, m22 = this.m22;
    this.m00 = m00*M1.m00 + m01*M1.m10 + m02*M1.m20;
    this.m01 = m00*M1.m01 + m01*M1.m11 + m02*M1.m21;
    this.m02 = m00*M1.m02 + m01*M1.m12 + m02*M1.m22;
    this.m10 = m10*M1.m00 + m11*M1.m10 + m12*M1.m20;
    this.m11 = m10*M1.m01 + m11*M1.m11 + m12*M1.m21;
    this.m12 = m10*M1.m02 + m11*M1.m12 + m12*M1.m22;
    this.m20 = m20*M1.m00 + m21*M1.m10 + m22*M1.m20;
    this.m21 = m20*M1.m01 + m21*M1.m11 + m22*M1.m21;
    this.m22 = m20*M1.m02 + m21*M1.m12 + m22*M1.m22;
    return this;
};

//------------------------------------------------------------------------------
//  逆行列
//------------------------------------------------------------------------------
MTX33.prototype.inverse = function() {
    var m00 = this.m00, m01 = this.m01, m02 = this.m02;
    var m10 = this.m10, m11 = this.m11, m12 = this.m12;
    var m20 = this.m20, m21 = this.m21, m22 = this.m22;
    var det = m00*m11*m22 + m10*m21*m02 + m20*m01*m12
            - m00*m21*m12 - m20*m11*m02 - m10*m01*m22;
    var M = new MTX33();
    M.m00 = ( m11*m22 - m12*m21 ) / det;
    M.m01 = ( m02*m21 - m01*m22 ) / det;
    M.m02 = ( m01*m12 - m02*m11 ) / det;
    M.m10 = ( m12*m20 - m10*m22 ) / det;
    M.m11 = ( m00*m22 - m02*m20 ) / det;
    M.m12 = ( m02*m10 - m00*m12 ) / det;
    M.m20 = ( m10*m21 - m11*m20 ) / det;
    M.m21 = ( m01*m20 - m00*m21 ) / det;
    M.m22 = ( m00*m11 - m01*m10 ) / det;
    return M;
};

//------------------------------------------------------------------------------
//  アフィン変換
//------------------------------------------------------------------------------
//  移動
MTX33.prototype.translate = function( tx, ty ) {
    this.m02 += this.m00 * tx + this.m01 * ty;
    this.m12 += this.m10 * tx + this.m11 * ty;
    this.m22 += this.m20 * tx + this.m21 * ty;
    return this;
};
//  拡大・縮小
MTX33.prototype.scale     = function( sx, sy ) {
    this.m00 *= sx; this.m01 *= sy;
    this.m10 *= sx; this.m11 *= sy;
    this.m20 *= sx; this.m21 *= sy;
    return this;
};
//  回転
MTX33.prototype.rotate    = function( rad ) {
    var c = Math.cos( rad );
    var s = Math.sin( rad );
    var m00 = this.m00, m01 = this.m01;
    var m10 = this.m10, m11 = this.m11;
    var m20 = this.m20, m21 = this.m21;
    this.m00 = c * m00 + s * m01;
    this.m10 = c * m10 + s * m11;
    this.m20 = c * m20 + s * m21;
    this.m01 = c * m01 - s * m00;
    this.m11 = c * m11 - s * m10;
    this.m21 = c * m21 - s * m20;
    return this;
};

//------------------------------------------------------------------------------
//  加算・減算・乗算 - クラスメソッド
//------------------------------------------------------------------------------
//  加算
MTX33.add  = function( M1, M2 ) {
    var M = new MTX33();
    M.m00=M1.m00+M2.m00; M.m01=M1.m01+M2.m01; M.m02=M1.m02+M2.m02;
    M.m10=M1.m10+M2.m10; M.m11=M1.m11+M2.m11; M.m12=M1.m12+M2.m12;
    M.m20=M1.m20+M2.m20; M.m21=M1.m21+M2.m21; M.m22=M1.m22+M2.m22;
    return M;
};
//  減算
MTX33.sub  = function( M1, M2 ) {
    var M = new MTX33();
    M.m00=M1.m00-M2.m00; M.m01=M1.m01-M2.m01; M.m02=M1.m02-M2.m02;
    M.m10=M1.m10-M2.m10; M.m11=M1.m11-M2.m11; M.m12=M1.m12-M2.m12;
    M.m20=M1.m20-M2.m20; M.m21=M1.m21-M2.m21; M.m22=M1.m22-M2.m22;
    return M;
};
//  乗算
MTX33.mult = function( M1, M2 ) {
    var M = new MTX33();
    M.m00 = M1.m00*M2.m00 + M1.m01*M2.m10 + M1.m02*M2.m20;
    M.m01 = M1.m00*M2.m01 + M1.m01*M2.m11 + M1.m02*M2.m21;
    M.m02 = M1.m00*M2.m02 + M1.m01*M2.m12 + M1.m02*M2.m22;
    M.m10 = M1.m10*M2.m00 + M1.m11*M2.m10 + M1.m12*M2.m20;
    M.m11 = M1.m10*M2.m01 + M1.m11*M2.m11 + M1.m12*M2.m21;
    M.m12 = M1.m10*M2.m02 + M1.m11*M2.m12 + M1.m12*M2.m22;
    M.m20 = M1.m20*M2.m00 + M1.m21*M2.m10 + M1.m22*M2.m20;
    M.m21 = M1.m20*M2.m01 + M1.m21*M2.m11 + M1.m22*M2.m21;
    M.m22 = M1.m20*M2.m02 + M1.m21*M2.m12 + M1.m22*M2.m22;
    return M;
};

//------------------------------------------------------------------------------
//  2次元ベクトルとの乗算 - クラスメソッド
//------------------------------------------------------------------------------
MTX33.multVEC2 = function( M, V ) {
    return new VEC2().set(
        M.m00*V.x + M.m01*V.y + M.m02,
        M.m10*V.x + M.m11*V.y + M.m12
    );
};



//------------------------------------------------------------------------------
//  3x4 行列クラス
//------------------------------------------------------------------------------
MTX34 = function() {
    return this.setIdentity();
};

//------------------------------------------------------------------------------
//  値を設定する
//------------------------------------------------------------------------------
//  0行列
MTX34.prototype.setZero = function() {
    this.m00 = 0.0; this.m01 = 0.0; this.m02 = 0.0; this.m03 = 0.0;
    this.m10 = 0.0; this.m11 = 0.0; this.m12 = 0.0; this.m13 = 0.0;
    this.m20 = 0.0; this.m21 = 0.0; this.m22 = 0.0; this.m23 = 0.0;
    return this;
};
//  単位行列
MTX34.prototype.setIdentity = function() {
    this.m00 = 1.0; this.m01 = 0.0; this.m02 = 0.0; this.m03 = 0.0;
    this.m10 = 0.0; this.m11 = 1.0; this.m12 = 0.0; this.m13 = 0.0;
    this.m20 = 0.0; this.m21 = 0.0; this.m22 = 1.0; this.m23 = 0.0;
    return this;
};
//  移動
MTX34.prototype.setTranslate = function( tx, ty, tz ) {
    this.m00 = 1.0; this.m01 = 0.0; this.m02 = 0.0; this.m03 = tx;
    this.m10 = 0.0; this.m11 = 1.0; this.m12 = 0.0; this.m13 = ty;
    this.m20 = 0.0; this.m21 = 0.0; this.m22 = 1.0; this.m23 = tz;
    return this;
};
//  拡大・縮小
MTX34.prototype.setScale = function( sx, sy, sz ) {
    this.m00 = sx; this.m01 =0.0; this.m02 = 0.0; this.m03 = 0.0;
    this.m10 =0.0; this.m11 = sy; this.m12 = 0.0; this.m13 = 0.0;
    this.m20 =0.0; this.m21 =0.0; this.m22 = sz;  this.m23 = 0.0;
    return this;
};
//  回転
MTX34.prototype.setRotate = function( axis, rad ) {
    throw new Error("NOT_IMPLEMENT");
    return this;
};

// 複製する
MTX34.prototype.clone = function () {
    var m = new MTX34();
    m.m00 = this.m00; m.m01 = this.m01; m.m02 = this.m02; m.m03 = this.m03;
    m.m10 = this.m10; m.m11 = this.m11; m.m12 = this.m12; m.m13 = this.m13;
    m.m20 = this.m20; m.m21 = this.m21; m.m22 = this.m22; m.m23 = this.m23;
    return m;
}

//------------------------------------------------------------------------------
//  加算・減算・乗算
//------------------------------------------------------------------------------
//  加算
MTX34.prototype.add  = function( M1 ) {
    this.m00 += M1.m00; this.m01 += M1.m01; this.m02 += M1.m02; this.m03 += M1.m03;
    this.m10 += M1.m10; this.m11 += M1.m11; this.m12 += M1.m12; this.m13 += M1.m13;
    this.m20 += M1.m20; this.m21 += M1.m21; this.m22 += M1.m22; this.m23 += M1.m23;
    return this;
};
//  減算
MTX34.prototype.sub  = function( M1 ) {
    this.m00 -= M1.m00; this.m01 -= M1.m01; this.m02 -= M1.m02; this.m03 -= M1.m03;
    this.m10 -= M1.m10; this.m11 -= M1.m11; this.m12 -= M1.m12; this.m13 -= M1.m13;
    this.m20 -= M1.m20; this.m21 -= M1.m21; this.m22 -= M1.m22; this.m23 -= M1.m23;
    return this;
};
//  乗算
MTX34.prototype.mult = function( M1 ) {
    var m00 = this.m00, m01 = this.m01, m02 = this.m02, m03 = this.m03;
    var m10 = this.m10, m11 = this.m11, m12 = this.m12, m13 = this.m13;
    var m20 = this.m20, m21 = this.m21, m22 = this.m22, m23 = this.m23;
    this.m00 = m00*M1.m00 + m01*M1.m10 + m02*M1.m20;
    this.m01 = m00*M1.m01 + m01*M1.m11 + m02*M1.m21;
    this.m02 = m00*M1.m02 + m01*M1.m12 + m02*M1.m22;
    this.m03 = m00*M1.m03 + m01*M1.m13 + m02*M1.m23 + m03;
    this.m10 = m10*M1.m00 + m11*M1.m10 + m12*M1.m20;
    this.m11 = m10*M1.m01 + m11*M1.m11 + m12*M1.m21;
    this.m12 = m10*M1.m02 + m11*M1.m12 + m12*M1.m22;
    this.m13 = m10*M1.m03 + m11*M1.m13 + m12*M1.m23 + m13;
    this.m20 = m20*M1.m00 + m21*M1.m10 + m22*M1.m20;
    this.m21 = m20*M1.m01 + m21*M1.m11 + m22*M1.m21;
    this.m22 = m20*M1.m02 + m21*M1.m12 + m22*M1.m22;
    this.m23 = m20*M1.m03 + m21*M1.m13 + m22*M1.m23 + m23;
    return this;
};

//------------------------------------------------------------------------------
//  逆行列
//------------------------------------------------------------------------------
MTX34.prototype.inverse = function() {

    var m00 = this.m00, m01 = this.m01, m02 = this.m02, m03 = this.m03;
    var m10 = this.m10, m11 = this.m11, m12 = this.m12, m13 = this.m13;
    var m20 = this.m20, m21 = this.m21, m22 = this.m22, m23 = this.m23;

    var det = m00*m11*m22 + m01*m12*m20 + m02*m10*m21
            - m00*m12*m21 - m01*m10*m22 - m02*m11*m20;

    var M = new MTX34();
    var n00 = m11*m22 - m12*m21;
    var n01 = m02*m21 - m01*m22;
    var n02 = m01*m12 - m02*m11;
    var n03 = m01*m13*m22 + m02*m11*m23 + m03*m12*m21
            - m01*m12*m23 - m02*m13*m21 - m03*m11*m22;
    var n10 = m12*m20 - m10*m22;
    var n11 = m00*m22 - m02*m20;
    var n12 = m02*m10 - m00*m12;
    var n13 = m00*m12*m23 + m02*m13*m20 + m03*m10*m22
            - m00*m13*m22 - m02*m10*m23 - m03*m12*m20;
    var n20 = m10*m21 - m11*m20;
    var n21 = m01*m20 - m00*m21;
    var n22 = m00*m11 - m01*m10;
    var n23 = m00*m13*m21 + m01*m10*m23 + m03*m11*m20
            - m00*m11*m23 - m01*m13*m20 - m03*m10*m21;

    M.m00 = n00 / det;
    M.m01 = n01 / det;
    M.m02 = n02 / det;
    M.m03 = n03 / det;
    M.m10 = n10 / det;
    M.m11 = n11 / det;
    M.m12 = n12 / det;
    M.m13 = n13 / det;
    M.m20 = n20 / det;
    M.m21 = n21 / det;
    M.m22 = n22 / det;
    M.m23 = n23 / det;

    return M;
};

//------------------------------------------------------------------------------
//  アフィン変換
//------------------------------------------------------------------------------
//  移動
MTX34.prototype.translate = function( tx, ty, tz ) {
    this.m03 += this.m00 * tx + this.m01 * ty + this.m02 * tz;
    this.m13 += this.m10 * tx + this.m11 * ty + this.m12 * tz;
    this.m23 += this.m20 * tx + this.m21 * ty + this.m22 * tz;
    return this;
};
//  拡大・縮小
MTX34.prototype.scale     = function( sx, sy, sz ) {
    this.m00 *= sx; this.m01 *= sy; this.m02 *= sz;
    this.m10 *= sx; this.m11 *= sy; this.m12 *= sz;
    this.m20 *= sx; this.m21 *= sy; this.m22 *= sz;
    return this;
};
//  回転
MTX34.prototype.rotate    = function( rad ) {
    var c = Math.cos( rad );
    var s = Math.sin( rad );
    var m00 = this.m00, m01 = this.m01;
    var m10 = this.m10, m11 = this.m11;
    var m20 = this.m20, m21 = this.m21;
    this.m00 = c * m00 + s * m01;
    this.m10 = c * m10 + s * m11;
    this.m20 = c * m20 + s * m21;
    this.m01 = c * m01 - s * m00;
    this.m11 = c * m11 - s * m10;
    this.m21 = c * m21 - s * m20;
    return this;
};

//------------------------------------------------------------------------------
//  加算・減算・乗算 - クラスメソッド
//------------------------------------------------------------------------------
//  加算
MTX34.add  = function( M1, M2 ) {
    var M = new MTX34();
    M.m00=M1.m00+M2.m00; M.m01=M1.m01+M2.m01; M.m02=M1.m02+M2.m02; M.m03=M1.m03+M2.m03;
    M.m10=M1.m10+M2.m10; M.m11=M1.m11+M2.m11; M.m12=M1.m12+M2.m12; M.m13=M1.m13+M2.m13;
    M.m20=M1.m20+M2.m20; M.m21=M1.m21+M2.m21; M.m22=M1.m22+M2.m22; M.m23=M1.m23+M2.m23;
    return M;
};
//  減算
MTX34.sub  = function( M1, M2 ) {
    var M = new MTX34();
    M.m00=M1.m00-M2.m00; M.m01=M1.m01-M2.m01; M.m02=M1.m02-M2.m02; M.m03=M1.m03-M2.m03;
    M.m10=M1.m10-M2.m10; M.m11=M1.m11-M2.m11; M.m12=M1.m12-M2.m12; M.m13=M1.m13-M2.m13;
    M.m20=M1.m20-M2.m20; M.m21=M1.m21-M2.m21; M.m22=M1.m22-M2.m22; M.m23=M1.m23-M2.m23;
    return M;
};
//  乗算
MTX34.mult = function( M1, M2 ) {
    var M = new MTX34();
    M.m00 = M1.m00*M2.m00 + M1.m01*M2.m10 + M1.m02*M2.m20;
    M.m01 = M1.m00*M2.m01 + M1.m01*M2.m11 + M1.m02*M2.m21;
    M.m02 = M1.m00*M2.m02 + M1.m01*M2.m12 + M1.m02*M2.m22;
    M.m03 = M1.m00*M2.m03 + M1.m01*M2.m13 + M1.m02*M2.m23 + M1.m03;
    M.m10 = M1.m10*M2.m00 + M1.m11*M2.m10 + M1.m12*M2.m20;
    M.m11 = M1.m10*M2.m01 + M1.m11*M2.m11 + M1.m12*M2.m21;
    M.m12 = M1.m10*M2.m02 + M1.m11*M2.m12 + M1.m12*M2.m22;
    M.m13 = M1.m10*M2.m03 + M1.m11*M2.m13 + M1.m12*M2.m23 + M1.m13;
    M.m20 = M1.m20*M2.m00 + M1.m21*M2.m10 + M1.m22*M2.m20;
    M.m21 = M1.m20*M2.m01 + M1.m21*M2.m11 + M1.m22*M2.m21;
    M.m22 = M1.m20*M2.m02 + M1.m21*M2.m12 + M1.m22*M2.m22;
    M.m23 = M1.m20*M2.m03 + M1.m21*M2.m13 + M1.m22*M2.m23 + M1.m23;
    return M;
};

//------------------------------------------------------------------------------
//  3次元ベクトルとの乗算 - クラスメソッド
//------------------------------------------------------------------------------
MTX34.multVEC3 = function( M, V ) {
    return new VEC3().set(
        M.m00*V.x + M.m01*V.y + M.m02*V.z + M.m03,
        M.m10*V.x + M.m11*V.y + M.m12*V.z + M.m13,
        M.m20*V.x + M.m21*V.y + M.m22*V.z + M.m23
    );
};

})( window );
