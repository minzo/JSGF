//==============================================================================
//
//  グラフィクスコンポーネント [Gfx2dComponent.js]
//
//==============================================================================

(function( window, undefined ) {


//------------------------------------------------------------------------------
//  Gfx2dStyle
//    Gfx2dComponent の描画のしかたを決める
//------------------------------------------------------------------------------
Gfx2dStyle = class
{
    static FillColor( color ) { return new Gfx2dStyle( color, false, 0.1 ); }
    static EdgeColor( color ) { return new Gfx2dStyle( color, true,  0.1 ); }

    static FillRed()   { return Gfx2dStyle.FillColor( 'red' ); }
    static FillGreen() { return Gfx2dStyle.FillColor( 'green' ); }
    static FillBlue()  { return Gfx2dStyle.FillColor( 'blue' ); }
    static FillBlack() { return Gfx2dStyle.FillColor( 'black' ); }
    static FillWhite() { return Gfx2dStyle.FillColor( 'white' ); }

    static EdgeRed()   { return Gfx2dStyle.EdgeColor( 'red' ); }
    static EdgeGreen() { return Gfx2dStyle.EdgeColor( 'green' ); }
    static EdgeBlue()  { return Gfx2dStyle.EdgeColor( 'blue' ); }
    static EdgeBlack() { return Gfx2dStyle.EdgeColor( 'black' ); }
    static EdgeWhite() { return Gfx2dStyle.EdgeColor( 'white' ); }

    constructor( color, isEdge, lineWidth ) {
        this.fillStyle   = color;
        this.strokeStyle = color;
        this.lineWidth   = lineWidth;
        this.isEdge      = isEdge;
    }
};

//------------------------------------------------------------------------------
//  Gfx2dComponent
//
//  @param[in] w      幅
//  @param[in] h      高さ
//  @param[in] style  Gfx2dStyle スタイル
//------------------------------------------------------------------------------
Gfx2dComponent = function( w, h, style ) {

    Component.call( this );

    this.transform = new Transform();

    this.viewMtx  = new MTX34();
    this.matrix   = new MTX34();

    //  引数省略チェック
    this.transform.setScale( w?w:1.0, h?h:1.0, 1.0 );
    this.style   = ( style ) ? style : Gfx2dStyle.FillBlack();

    this.drawDelegate = null;

    return this;
};
Gfx2dComponent.prototype = new Component();

//------------------------------------------------------------------------------
// 計算処理
//------------------------------------------------------------------------------
Gfx2dComponent.prototype.calc = function( owner ) {
    Component.prototype.calc.call( this, owner );
    systemGfxManager.entryDrawList( this );
};

//------------------------------------------------------------------------------
// GfxManager から呼ばれる
//------------------------------------------------------------------------------
Gfx2dComponent.prototype.preproc = function() {

    // 計算
    this.transform.setParent( this.owner.transform );
    this.transform.resetUpdateFlag();
    this.transform.calc();

    // camera space matrix
    this.matrix = MTX34.mult( this.viewMtx, this.transform.worldMtx );
};
Gfx2dComponent.prototype.proc = function( context ) {
    var mtx = this.matrix;
    var style = this.style;
    context.setTransform( mtx.m00, mtx.m10, mtx.m01, mtx.m11, mtx.m03, mtx.m13 );
    context.strokeStyle = style.strokeStyle;
    context.fillStyle   = style.fillStyle;
    context.lineWidth   = style.lineWidth;
};
Gfx2dComponent.prototype.postproc = function() {};


//------------------------------------------------------------------------------
//  Gfx2dLine
//
//  @param[in] sx     始点X座標
//  @param[in] sy     始点Y座標
//  @param[in] gx     終点X座標
//  @param[in] gy     終点Y座標
//  @param[in] style  Gfx2dStyle スタイル
//------------------------------------------------------------------------------
Gfx2dLine = function( sx, sy, gx, gy, style ) {
    Gfx2dComponent.call( self, 1, 1, style );
    this.pos1 = new VEC2( sx, sy );
    this.pos2 = new VEC2( gx, gy );
    return this;
};
Gfx2dLine.prototype = new Gfx2dComponent();
Gfx2dLine.prototype.proc = function( context ) {
    Gfx2dComponent.prototype.proc.call( this, context );
    context.beginPath();
    context.moveTo( this.pos1.x, this.pos1.y );
    context.lineTo( this.pos2.x, this.pos2.y );
    context.stroke();
    context.closePath();
};


//------------------------------------------------------------------------------
//  Gfx2dRect
//
//  @param[in] w      幅
//  @param[in] h      高さ
//  @param[in] style  Gfx2dStyle スタイル
//  @param[in] isEdge    枠のみ描画するか
//  @param[in] lineWidth 線の太さ
//------------------------------------------------------------------------------
Gfx2dRect = function( w, h, style, isEdge, lineWidth ) {
    Gfx2dComponent.call( this, w, h, style );
    return this;
};
Gfx2dRect.prototype = new Gfx2dComponent();
Gfx2dRect.prototype.proc = function( context ) {
    Gfx2dComponent.prototype.proc.call( this, context );

    if( this.style.isEdge )
    {
        context.strokeRect( -0.5, -0.5, 1.0, 1.0 );
    }
    else
    {
        context.fillRect( -0.5, -0.5, 1.0, 1.0 );
    }
};


//------------------------------------------------------------------------------
//  Gfx2dCircle
//
//  @param[in] r      半径
//  @param[in] isEdge 線で描画
//  @param[in] style  Gfx2dStyle スタイル
//------------------------------------------------------------------------------
Gfx2dCircle = function( r, style, isEdge, lineWidth ) {
    Gfx2dComponent.call( this, r, r, style );
    return this;
};
Gfx2dCircle.prototype = new Gfx2dComponent();
Gfx2dCircle.prototype.proc    = function( context ) {

    Gfx2dComponent.prototype.proc.call( this, context );

    context.beginPath();
    context.arc( 0.0, 0.0, 0.5, 0.0, 2.0 * Math.PI, true );
    if( this.style.isEdge )
    {
        context.stroke();
    }
    else
    {
        context.fill();
    }
    context.closePath();
};


//------------------------------------------------------------------------------
//  Gfx2dImage
//
//  @param[in] w      幅
//  @param[in] h      高さ
//  @param[in] label  適用する画像のラベル
//------------------------------------------------------------------------------
Gfx2dImage = function( w, h, label ) {

    Gfx2dComponent.call( this, 0, 0 );

    this.label  = label;
    this.image  = gFileMngr.getImage( label );
    this.transform.setScale( w?w:1.0, h?h:1.0, 1.0 );

    return this;
};
Gfx2dImage.prototype = new Gfx2dComponent();
Gfx2dImage.prototype.proc = function( context ) {
    Gfx2dComponent.prototype.proc.call( this, context );
    var img   = this.image;
    context.drawImage( img, 0.0, 0.0, img.width, img.height, -0.5, -0.5, 1.0, 1.0 );
};


//------------------------------------------------------------------------------
//  Gfx2dSprite
//
//  @param[in] w      幅
//  @param[in] h      高さ
//  @param[in] label  適用するスプライトのラベル
//  @param[in] anime  再生するスプライト内のアニメ
//------------------------------------------------------------------------------
Gfx2dSprite = function( w, h, label, anime ) {
    Gfx2dComponent.call( this, w, h );

    this.label  = label;
    this.sprite = gFileMngr.getSprite( label ); // スプライトアニメの情報が入ったJSON

    this.anime  = this.sprite[ anime ];
    this.image  = gFileMngr.getImage(gFileMngr.pathToLabel(self.anime.filepath));
    this.frame     = 0;    //  フレームのカウント
    this.current   = 0;    //  現在の再生フレーム
    this.isPlaying = true; //  再生フラグ

    this.transform.setScale( w?w:1.0, h?h:1.0, 1.0 );

    return this;
};
Gfx2dSprite.prototype = new Gfx2dComponent();
Gfx2dSprite.prototype.proc = function( context ) {
    Gfx2dComponent.prototype.proc.call( this, context );
    var img   = this.image;
    var anime = this.anime;
    var aniw  = anime.width;
    var anih  = anime.height;
    var numHorizontal  = Math.floor( img.width / anime.width );
    var offsetX = this.current % numHorizontal * aniw;
    var offsetY = Math.floor( this.current / numHorizontal ) * anih;
    context.drawImage( img, offsetX, offsetY, aniw, anih, -0.5, -0.5, 1.0, 1.0 );
};
Gfx2dSprite.prototype.postproc = function() {
    Gfx2dObject.prototype.postproc.call( this );
    if( !this.isPlaying ) return;

    var anime = this.anime;

    this.frame++;

    // anime.frame = アニメの絵の切り替わりが何フレームに1回かを表す
    if( this.frame % anime.frame == 0 ) {
        this.current++;
    }

    if( this.current > anime.end ) {
        if( anime.loop ) this.current   = anime.start;
        else             this.isPlaying = false;
    }
};
Gfx2dSprite.prototype.setAnime = function( anime ) {
    this.anime = this.sprite[ anime ];
    this.image = gFileMngr.getImage(gFileMngr.pathToLabel(this.anime.filepath));
    this.frame  = 0;
    this.current= 0;
    this.isPlaying  = true;
};

})( window );
