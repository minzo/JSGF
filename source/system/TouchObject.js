//==============================================================================
//
//  タッチオブジェクト [TouchObject.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  TouchObject
//
//  MEMO: GfxManager で描画できる触れる基本クラス
//
//  @param[in] x      左上X座標
//  @param[in] y      左上Y座標
//  @param[in] w      幅
//  @param[in] h      高さ
//  @param[in] color  色( ’rgba(255,255,255,1.0’ ) で指定可能 )
//------------------------------------------------------------------------------
TouchObject = function( x, y, w, h, color ) {
    GfxObject.call( this, x, y, w, h, color );
    this.touched     = null;
    this.touchOffset = {x:0,y:0};
};
TouchObject.prototype = new GfxObject();
TouchObject.prototype.update = function() {

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

        pos.x  = tPos.x - this.touchOffset.x;
        pos.y  = tPos.y - this.touchOffset.y;


        //  指が離れたら追随をやめる
        if( _touched.state == 'rls' ){
            this.touched = null;
        }
    }
};
TouchObject.prototype.getTouch = function() {
    var _touches = systemHidManager.touches;
    for( var i=0,l=_touches.length; i<l; i++ ){
        if( this.isTouch( _touches[ i ] ) ) return _touches[ i ];
    }
    return null;
};
TouchObject.prototype.isTouch  = function( touch ) {};


//------------------------------------------------------------------------------
//  TouchRect
//
//  @param[in] x      左上X座標
//  @param[in] y      左上Y座標
//  @param[in] w      幅
//  @param[in] h      高さ
//  @param[in] color  色( ’rgba(255,255,255,1.0’ ) で指定可能 )
//------------------------------------------------------------------------------
TouchRect = function( x, y, w, h, color ) {
    var self = this instanceof TouchRect
             ? this
             : Object.create( TouchRect.prototype );
    TouchObject.call( self, x, y, w, h, color );
    return self;
};
TouchRect.prototype = new TouchObject();
TouchRect.prototype.proc = GfxRect.prototype.proc;
TouchRect.prototype.isTouch = function( touch ) {

    if( touch.state != 'trg' ) return false;

    var tPos = MTX33.multVEC2( this.matrix.inverse(), touch.pos );

    if( tPos.x > 0 && tPos.x < this.size.x &&
        tPos.y > 0 && tPos.y < this.size.y ){
        return true;
    }

    return false;
};


//------------------------------------------------------------------------------
//  TouchCircle
//
//  @param[in] x      左上X座標
//  @param[in] y      左上Y座標
//  @param[in] w      幅
//  @param[in] h      高さ
//  @param[in] color  色( ’rgba(255,255,255,1.0’ ) で指定可能 )
//------------------------------------------------------------------------------
TouchCircle = function( x, y, w, h, color ) {

    var self = this instanceof TouchCircle
             ? this
             : Object.create( TouchCircle.prototype );
    TouchObject.call( self, x, y, w, h, color );

    return self;
};
TouchCircle.prototype = new TouchObject();
TouchCircle.prototype.proc = GfxCircle.prototype.proc;
TouchCircle.prototype.isTouch = function( touch ) {

    if( touch.state != "trg" ) return false;

    var tPos = MTX33.multVEC2( this.matrix.inverse(), touch.pos );

    var radius = this.size.x / 2;
    var dx     = radius - tPos.x;
    var dy     = radius - tPos.y;
    var dist   = dx * dx + dy * dy;

    if( dist < radius * radius ) {
        return true;
    }
    return false;
};


//------------------------------------------------------------------------------
//  TouchImage
//
//  @param[in] x      左上X座標
//  @param[in] y      左上Y座標
//  @param[in] color  色( ’rgba(255,255,255,1.0’ ) で指定可能 )
//------------------------------------------------------------------------------
TouchImage = function( x, y, label ) {

    var self = this instanceof TouchImage
             ? this
             : Object.create( TouchImage.prototype );
    TouchObject.call( self, x, y, 0, 0 );

    self.label  = label;
    self.image  = gFileMngr.getImage( label );

    self.size.x = self.image.width;
    self.size.y = self.image.height;

    return self;
};
TouchImage.prototype = new TouchObject();
TouchImage.prototype.proc    = GfxImage.prototype.proc;
TouchImage.prototype.isTouch = TouchRect.prototype.isTouch;

//------------------------------------------------------------------------------
//  TouchSprite
//
//  @param[in] x      左上X座標
//  @param[in] y      左上Y座標
//  @param[in] label  適用するスプライトのラベル
//  @param[in] anime  再生するスプライト内のアニメ
//------------------------------------------------------------------------------
TouchSprite = function( x, y, label, anime ) {

    var self = this instanceof TouchSprite
             ? this
             : Object.create( TouchSprite.prototype );
    TouchObject.call( self, x, y, 0, 0 );

    self.label  = label;
    self.sprite = gFileMngr.getSprite( label );
    self.anime  = self.sprite[ anime ];
    self.image  = gFileMngr.getImage(gFileMngr.pathToLabel(self.anime.filepath));

    self.frame  = 0;    //  フレームのカウント
    self.current= 0;    //  現在の再生フレーム
    self.bPlay  = true; //  再生フラグ

    self.size.x = self.anime.width;
    self.size.y = self.anime.height;

    return self;
};
TouchSprite.prototype = new TouchObject();
TouchSprite.prototype.proc     = GfxSprite.prototype.proc;
TouchSprite.prototype.postproc = GfxSprite.prototype.postproc;
TouchSprite.prototype.setAnime = GfxSprite.prototype.setAnime;
TouchSprite.prototype.isTouch  = TouchRect.prototype.isTouch;
})( window );
