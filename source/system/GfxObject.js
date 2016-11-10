//==============================================================================
//
//  グラフィクスオブジェクト [GfxObject.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  GfxObject
//
//  MEMO: GfxManager で描画できる基本クラス
//
//  @param[in] x      左上X座標
//  @param[in] y      左上Y座標
//  @param[in] w      幅
//  @param[in] h      高さ
//  @param[in] color  色( ’rgba(255,255,255,1.0’ ) で指定可能 )
//------------------------------------------------------------------------------
GfxObject = function( x, y, w, h, color ) {

    //  パラメータ
    this.pos   = {x:0,y:0};
    this.size  = {x:0,y:0};
    this.scale = {x:1,y:1};
    this.offset= {x:0,y:0};
    this.rot   = 0;

    this.parent = null;
    this.matrix = new MTX33();
    this.bUpdateMatrix = false;

    //  キャンバス上の座標
    this.cvs = {};
    this.cvs.pos   = {x:this.pos.x,   y:this.pos.y};
    this.cvs.size  = {x:this.size.x,  y:this.size.y};
    this.cvs.scale = {x:this.scale.x, y:this.scale.y};
    this.cvs.offset= {x:this.offset.x,y:this.offset.y};
    this.cvs.rot   = this.rot;

    //  引数省略チェック
    this.pos.x  = ( x     ) ? x     : 0;
    this.pos.y  = ( y     ) ? y     : 0;
    this.size.x = ( w     ) ? w     : 0;
    this.size.y = ( h     ) ? h     : 0;
    this.color  = ( color ) ? color : 'black';
};
GfxObject.prototype.update   = function() {};
GfxObject.prototype.draw     = function() {
    systemGfxManager.entryDrawList( this );
};
GfxObject.prototype.preproc  = function() { this.transform(); };
GfxObject.prototype.proc     = function( context ) {};
GfxObject.prototype.postproc = function() { this.bUpdateMatrix = false; };
GfxObject.prototype.setParent= function( parent ) { this.parent = parent; }
GfxObject.prototype.transform= function() {

    //  行列計算が既に終了していたら抜ける
    if( this.bUpdateMatrix ) return;

    //  キャッシュ
    var pos    = this.pos;
    var scale  = this.scale;
    var offset = this.offset;
    var parent = this.parent;
    var matrix = new MTX33();
    var cvs    = this.cvs;

    //  親が存在した場合
    if( parent ) {

        //  親の行列計算が終了していなかったら先に計算する
        if( !parent.bUpdateMatrix ) {
            parent.transform();
        }

        matrix.translate( offset.x + pos.x, offset.y + pos.y );
        matrix.rotate( this.rot );
        matrix.scale( scale.x, scale.y );
        matrix.translate( -offset.x, -offset.y );
        this.matrix = MTX33.mult( parent.matrix, matrix );

        cvs.pos = MTX33.multVEC2( matrix, pos );
        cvs.rot = parent.cvs.rot + this.rot;
    }

    //  親が存在しない場合
    else {
        matrix.translate( offset.x + pos.x, offset.y + pos.y );
        matrix.rotate( this.rot );
        matrix.scale( scale.x, scale.y );
        matrix.translate( -offset.x, -offset.y );
        this.matrix = matrix;

        cvs.pos = MTX33.multVEC2( matrix, pos );
        cvs.rot = this.rot;
    }

    //  行列計算を終了状態にする
    this.bUpdateMatrix = true;
};

//------------------------------------------------------------------------------
//  GfxLine
//
//  @param[in] sx     始点X座標
//  @param[in] sy     始点Y座標
//  @param[in] gx     終点X座標
//  @param[in] gy     終点Y座標
//  @param[in] color  色( ’rgba(255,255,255,1.0’) で指定可能 )
//------------------------------------------------------------------------------
GfxLine = function( sx, sy, gx, gy, color ) {

    var self = this instanceof GfxLine
             ? this
             : Object.create( GfxLine.prototype );
    GfxObject.call( self, sx, sy, gx, gy, color );

    self.pos.x1 = sx;
    self.pos.y1 = sy;
    self.pos.x2 = gx;
    self.pos.y2 = gy;

    return self;
};
GfxLine.prototype = new GfxObject();
GfxLine.prototype.proc = function( context ) {
    var pos = this.pos;
    var mtx = this.matrix;
    context.save();
    //context.setTransform( mtx.m00, mtx.m10, mtx.m01, mtx.m11, mtx.m02, mtx.m12 );
    context.fillStyle = this.color;
    context.strokeStyle = this.color;
    context.beginPath();
    context.moveTo( pos.x1, pos.y1 );
    context.lineTo( pos.x2, pos.y2 );
    context.stroke();
    context.closePath();
    context.restore();
};


//------------------------------------------------------------------------------
//  GfxRect
//
//  @param[in] x      左上X座標
//  @param[in] y      左上Y座標
//  @param[in] w      幅
//  @param[in] h      高さ
//  @param[in] color  色( ’rgba(255,255,255,1.0’) で指定可能 )
//------------------------------------------------------------------------------
GfxRect = function( x, y, w, h, color ) {
    var self = this instanceof GfxRect
             ? this
             : Object.create( GfxRect.prototype );
    GfxObject.call( self, x, y, w, h, color );
    return self;
};
GfxRect.prototype = new GfxObject();
GfxRect.prototype.proc     = function( context ) {
    var size= this.size;
    var mtx = this.matrix;
    context.save();
    context.setTransform( mtx.m00, mtx.m10, mtx.m01, mtx.m11, mtx.m02, mtx.m12 );
    context.fillStyle = this.color;
    context.fillRect( 0, 0, size.x, size.y );
    context.restore();
};


//------------------------------------------------------------------------------
//  GfxCircle
//
//  @param[in] x      左上X座標
//  @param[in] y      左上Y座標
//  @param[in] w      幅
//  @param[in] h      高さ ( 無視される )
//  @param[in] color  色   ( ’rgba(255,255,255,1.0)’ で指定可能 )
//------------------------------------------------------------------------------
GfxCircle = function( x, y, w, h, color ) {
    var self = this instanceof GfxCircle
             ? this
             : Object.create( GfxCircle.prototype );
    GfxObject.call( self, x, y, w, h, color );
    return self;
};
GfxCircle.prototype = new GfxObject();
GfxCircle.prototype.proc    = function( context ) {
    var size     = this.size;
    var mtx      = this.matrix;
    var _centerX = size.x / 2;
    var _centerY = size.y / 2;
    var _2PI     = 2 * Math.PI;
    context.save();
    context.setTransform( mtx.m00, mtx.m10, mtx.m01, mtx.m11, mtx.m02, mtx.m12 );
    context.fillStyle = this.color;
    context.beginPath();
    context.arc( _centerX, _centerY, size.x / 2, 0, _2PI, true );
    context.fill();
    context.closePath();
    context.restore();
};


//------------------------------------------------------------------------------
//  GfxImage
//
//  @param[in] x      左上X座標
//  @param[in] y      左上Y座標
//  @param[in] label  適用する画像のラベル
//------------------------------------------------------------------------------
GfxImage = function( x, y, label ) {
    var self = this instanceof GfxImage
             ? this
             : Object.create( GfxImage.prototype );
    GfxObject.call( self, x, y, 0, 0 );

    self.label  = label;
    self.image  = gFileMngr.getImage( label );
    self.size.x = self.image.width;
    self.size.y = self.image.height;

    return self;
};
GfxImage.prototype = new GfxObject();
GfxImage.prototype.proc = function( context ) {
    var size = this.size;
    var mtx  = this.matrix;
    var img  = this.image;
    context.save();
    context.setTransform( mtx.m00, mtx.m10, mtx.m01, mtx.m11, mtx.m02, mtx.m12 );
    context.drawImage( img, 0, 0, img.width, img.height, 0, 0, size.x, size.y );
    context.restore();
};


//------------------------------------------------------------------------------
//  GfxSprite
//
//  @param[in] x      左上X座標
//  @param[in] y      左上Y座標
//  @param[in] label  適用するスプライトのラベル
//  @param[in] anime  再生するスプライト内のアニメ
//------------------------------------------------------------------------------
GfxSprite = function( x, y, label, anime ) {
    var self = this instanceof GfxSprite
             ? this
             : Object.create( GfxSprite.prototype );
    GfxObject.call( self, x, y, 0, 0 );

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
GfxSprite.prototype = new GfxObject();
GfxSprite.prototype.proc = function( context ) {
    var image = this.image;
    var anime = this.anime;
    var size  = this.size;
    var mtx   = this.matrix;

    var aniw  = anime.width;
    var anih  = anime.height;

    var unit  = Math.floor( image.width / anime.width );
    var current= this.current;

    context.save();
    context.setTransform( mtx.m00, mtx.m10, mtx.m01, mtx.m11, mtx.m02, mtx.m12 );
    context.drawImage( image,
                       current%unit*aniw,
                       Math.floor(current/unit)*anih, aniw, anih,
                       0, 0, size.x, size.y );
    context.restore();
};
GfxSprite.prototype.postproc = function() {

    GfxObject.prototype.postproc.call( this );

    if( !this.bPlay ) return;

    var anime = this.anime;

    this.frame++;

    if( this.frame % anime.frame == 0 ) {
        this.current++;
    }

    if( this.current > anime.end ) {
        if( anime.loop ) this.current = anime.start;
        else             this.bPlay = false;
    }
};
GfxSprite.prototype.setAnime = function( anime ) {
    this.anime = this.sprite[ anime ];
    this.image = gFileMngr.getImage(gFileMngr.pathToLabel(this.anime.filepath));
    this.frame  = 0;
    this.current= 0;
    this.bPlay  = true;
    this.size.x = this.anime.width;
    this.size.y = this.anime.height;
};

})( window );
