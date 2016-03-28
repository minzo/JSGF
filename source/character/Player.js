//==============================================================================
//
//  プレイヤー [Player.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  コンストラクタ
//------------------------------------------------------------------------------
Player = function( x, y ) {
    var self = this instanceof Player
             ? this
             : Object.create( Player.prototype );
    TouchRect.call( self, x, y, 64, 64, 'red' );

    this.prvPos = {x:0,y:0};
    this.spd = {x:0,y:0};

    this.objectList = [];

    return self;
};
Player.prototype = Object.create( TouchRect.prototype );
Player.prototype.constructor = Player;

//------------------------------------------------------------------------------
//  更新
//------------------------------------------------------------------------------
Player.prototype.update = function() {

    var pos      = this.pos;
    var parent   = this.parent;
    var _touched = this.touched;
    var tPos, inverse;

    //  タッチされていなかったらタッチされているか調べる
    if( !_touched ) {

        if( ( _touched = this.getTouch() ) != null ) {

            this.touched = _touched;

            if( parent ) {
                inverse= parent.matrix.inverse();
                tPos   = MTX33.multVEC2( inverse, _touched.pos );
            }
            else {
                tPos = _touched.pos;
            }

            this.touchOffset.x = tPos.x - pos.x;
            this.touchOffset.y = tPos.y - pos.y;
        }
    }

    //  タッチされていたらオブジェクトを追随させる
    else {

        if ( parent ) {
            inverse = parent.matrix.inverse();
            tPos    = MTX33.multVEC2( inverse, _touched.pos );
        }
        else {
            tPos = _touched.pos;
        }

        this.spd.x  = tPos.x - this.touchOffset.x - this.prvPos.x;
        this.spd.y  = tPos.y - this.touchOffset.y - this.prvPos.y;

        //  指が離れたら追随をやめる
        if( _touched.state == 'rls' ){
            this.touched = null;
        }
    }

    gDbgMngr.print( this.spd.x + ',' + this.spd.y );

    this.isHit();

    this.pos.x += this.spd.x;
    this.pos.y += this.spd.y;

    this.prvPos.x = this.pos.x;
    this.prvPos.y = this.pos.y;
};

//------------------------------------------------------------------------------
//  衝突判定
//------------------------------------------------------------------------------
Player.prototype.isHit = function() {

    var pos = this.pos;
    var spd = this.spd;
    var size= this.size;

    var objs= this.objectList;
    var ret = false;

    for( var i=0,l=objs.length; i<l; i++ ) {
        ret |= objs[ i ].checkHit( this );
    }

    return ret;
};


})( window );
