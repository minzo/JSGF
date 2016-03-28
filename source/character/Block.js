//==============================================================================
//
//  ブロッククラス [Block.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  コンストラクタ
//
//  @param[in] x      左上X座標
//  @param[in] y      左上Y座標
//  @param[in] label  適用する画像のラベル
//------------------------------------------------------------------------------
Block = function( x, y, w, h ) {

    var self = this instanceof Block
             ? this
             : Object.create( Block.prototype );
    GfxRect.call( self, x, y, w, h, 'black' );
    return self;
};
Block.prototype = Object.create( GfxRect.prototype );
Block.prototype.constructor = Block;

//------------------------------------------------------------------------------
//  当たり判定
//
//  @param[in] object 自身と衝突しているか調べる Object
//------------------------------------------------------------------------------
Block.prototype.checkHit = function( object ) {

    var pos = object.pos;
    var size= object.size;
    var spd = object.spd;

    var ulx = pos.x + 10;
    var uly = pos.y;
    var urx = ulx + size.x -10;
    var ury = uly;
    var ucx = pos.x + size.x / 2;
    var ucy = uly;
    var dlx = ulx;
    var dly = uly + size.y;
    var drx = urx;
    var dry = dly;
    var dcx = ucx;
    var dcy = dly;

    var movex = { x: spd.x, y: 0 };
    var movey = { x: 0, y: spd.y };

    var ret = false;

    if( spd.y < 0 ) {
        if( this.isInSelf(ulx,uly,movey) ||
            this.isInSelf(urx,ury,movey) ||
            this.isInSelf(ucx,ucy,movey) ){
//            pos.y  = this.pos.y + this.size.y + 0.5;
            this.size.y -= this.pos.y + this.size.y - pos.y;

            ret = true;
        }
    } else
    if( spd.y > 0 ) {
        if( this.isInSelf(dlx,dly,movey) ||
            this.isInSelf(drx,dry,movey) ||
            this.isInSelf(dcx,dcy,movey) ){
            pos.y  = this.pos.y - object.size.y - 0.5;
            ret = true;
        }
    }

    if( spd.x < 0 ) {
        if( this.isInSelf(ulx,uly,movex) || this.isInSelf(dlx,dly,movex) ) {
            pos.x  = this.pos.x + this.size.x + 0.5;
            ret = true;
        }
    }
    else
    if( spd.x >  0 ) {
        if( this.isInSelf(urx,ury,movex) || this.isInSelf(drx,dry,movex) ) {
            pos.x  = this.pos.x - object.size.x - 0.5;
            ret = true;
        }
    }

    return ret;
};


//------------------------------------------------------------------------------
//  点座標が移動後に自身の中にいる
//
//  @paran[in] x   X座標
//  @paran[in] y   Y座標
//  @param[in] spd 移動量
//  @return   bool 自身の中にいるなら true を返す
//------------------------------------------------------------------------------
Block.prototype.isInSelf = function( x, y, spd ) {
    var pos = this.pos;
    var size= this.size;
    x += spd.x;
    y += spd.y;
    return ( x > pos.x && x < pos.x + size.x &&
             y > pos.y && y < pos.y + size.y );
};




})( window );
