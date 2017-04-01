//==============================================================================
//
//  Math拡張 [Math.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  値を指定した範囲内にまるめる
//
//  @param[in] val まるめる値
//  @param[in] min 指定する範囲の下限の値
//  @param[in] max 指定する範囲の上限の値
//------------------------------------------------------------------------------
Math.clamp = Math.clamp || function( val, min, max ) {
    return Math.min( max, Math.max( min, val ) );
};


//------------------------------------------------------------------------------
//  乱数を取得する
//
//  引数が1つの場合 [ 0,arg0 ) の整数の乱数を返す
//  引数が2つの場合 [ arg0, arg1 ] の整数の乱数を返す
//------------------------------------------------------------------------------
Math.rand = Math.rand || function( arg0, arg1 ) {
    switch( arguments.length ) {
    case 0: return Math.floor( Math.random() * 32767 );
    case 1: return Math.floor( Math.random() * arg0 );
    case 2: return Math.floor( Math.random() * ( arg1 - arg0 + 1 ) ) + arg0;
    default:
    };
    console.error( "Math.rand() invailid arguments" );
    return 0;
};

//------------------------------------------------------------------------------
//  角度をラジアンを度に変換する
//
//  @param[in] rad 変換する角度[rad]
//  @return    deg 変換後の角度[deg]
//------------------------------------------------------------------------------
Math.rad2Deg = Math.rad2Deg || function( rad ) {
    return 180 / Math.PI * rad;
};

//------------------------------------------------------------------------------
//  角度を度からラジアンに変換する
//
//  @param[in] deg 変換する角度[deg]
//  @return    rad 変換後の角度[rad]
//------------------------------------------------------------------------------
Math.deg2Rad = Math.deg2Rad || function( deg ) {
    return Math.PI / 180 * deg;
};

})( window );
