//==============================================================================
//
//  行列 [Matrix.js]
//
//==============================================================================

(function( window, undefined ){

//------------------------------------------------------------------------------
//  3x3 行列クラス
//------------------------------------------------------------------------------
MTX33 = function() {
    this.m00 = 1; this.m01 = 0; this.m02 = 0;
    this.m10 = 0; this.m11 = 1; this.m12 = 0;
    this.m20 = 0; this.m21 = 0; this.m22 = 1;
};

//------------------------------------------------------------------------------
//  加算・減算・乗算
//------------------------------------------------------------------------------
//  加算
MTX33.prototype.add  = function( M1 ) {
    this.m00 += M1.m00; this.m01 += M1.m01; this.m02 += M1.m02;
    this.m10 += M1.m10; this.m11 += M1.m11; this.m12 += M1.m12;
    this.m20 += M1.m20; this.m21 += M1.m21; this.m22 += M1.m22;
};
//  減算
MTX33.prototype.sub  = function( M1 ) {
    this.m00 -= M1.m00; this.m01 -= M1.m01; this.m02 -= M1.m02;
    this.m10 -= M1.m10; this.m11 -= M1.m11; this.m12 -= M1.m12;
    this.m20 -= M1.m20; this.m21 -= M1.m21; this.m22 -= M1.m22;
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
};
//  拡大・縮小
MTX33.prototype.scale     = function( sx, sy ) {
    this.m00 *= sx; this.m01 *= sy;
    this.m10 *= sx; this.m11 *= sy;
    this.m20 *= sx; this.m21 *= sy;
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
    return { x: M.m00*V.x + M.m01*V.y + M.m02,
             y: M.m10*V.x + M.m11*V.y + M.m12 };
};

})( window );
