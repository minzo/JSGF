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
//------------------------------------------------------------------------------
Gfx2dComponent = class extends Component
{
    //--------------------------------------------------------------------------
    //  @param[in] w      幅
    //  @param[in] h      高さ
    //  @param[in] style  Gfx2dStyle スタイル
    //--------------------------------------------------------------------------
    constructor( w, h, style )
    {
        super();

        this.transform = new Transform();

        this.viewMtx  = new MTX34();
        this.matrix   = new MTX34();

        this.transform.setScale( w?w:1.0, h?h:1.0, 1.0 );
        this.style   = ( style ) ? style : Gfx2dStyle.FillBlack();

        this.drawDelegate = null;
    }

    //--------------------------------------------------------------------------
    // 計算処理 - Component は calc() が必ず呼ばれます
    // @param owner このコンポーネントをアタッチしているオブジェクト
    //--------------------------------------------------------------------------
    calc( owner )
    {
        super.calc( owner );
        systemGfxManager.entryDrawList( this );
    }

    //--------------------------------------------------------------------------
    // GfxManager から呼ばれる
    //--------------------------------------------------------------------------
    // 描画前処理
    preproc()
    {
        // 計算
        this.transform.setParent( this.owner.transform );
        this.transform.resetUpdateFlag();
        this.transform.calc();

        // camera space matrix
        this.matrix = MTX34.mult( this.viewMtx, this.transform.worldMtx );
    }

    // 描画処理
    proc( context )
    {
        var mtx = this.matrix;
        var style = this.style;
        context.setTransform( mtx.m00, mtx.m10, mtx.m01, mtx.m11, mtx.m03, mtx.m13 );
        context.strokeStyle = style.strokeStyle;
        context.fillStyle   = style.fillStyle;
        context.lineWidth   = style.lineWidth;
    }

    // 描画後処理
    postproc()
    {
    }
};


//------------------------------------------------------------------------------
//  Gfx2dLine
//------------------------------------------------------------------------------
Gfx2dLine = class extends Gfx2dComponent
{
    //--------------------------------------------------------------------------
    // コンストラクタ
    //  @param[in] sx     始点X座標
    //  @param[in] sy     始点Y座標
    //  @param[in] gx     終点X座標
    //  @param[in] gy     終点Y座標
    //  @param[in] style  Gfx2dStyle スタイル
    //--------------------------------------------------------------------------
    constructor( sx, sy, gx, gy, style )
    {
        super();
        this.pos1 = new VEC2( sx, sy );
        this.pos2 = new VEC2( gx, gy );
    }

    //--------------------------------------------------------------------------
    // GfxManager から呼ばれる
    //--------------------------------------------------------------------------
    proc( context )
    {
        super.proc( context );
        context.beginPath();
        context.moveTo( this.pos1.x, this.pos1.y );
        context.lineTo( this.pos2.x, this.pos2.y );
        context.stroke();
        context.closePath();
    }
};


//------------------------------------------------------------------------------
//  Gfx2dRect
//------------------------------------------------------------------------------
Gfx2dRect = class extends Gfx2dComponent
{
    //--------------------------------------------------------------------------
    //  @param[in] w      幅
    //  @param[in] h      高さ
    //  @param[in] style  Gfx2dStyle スタイル
    //--------------------------------------------------------------------------
    constructor( w, h, style )
    {
        super( w, h, style );
    }

    //--------------------------------------------------------------------------
    // GfxManager から呼ばれる
    //--------------------------------------------------------------------------
    proc( context )
    {
        super.proc( context );
        this.style.isEdge
            ? context.fillRect( -0.5, -0.5, 1.0, 1.0 )
            : context.strokeRect( -0.5, -0.5, 1.0, 1.0 );
    }
};


//------------------------------------------------------------------------------
//  Gfx2dCircle
//------------------------------------------------------------------------------
Gfx2dCircle = class extends Gfx2dComponent
{
    //--------------------------------------------------------------------------
    //  @param[in] r      半径
    //  @param[in] style  Gfx2dStyle スタイル
    //--------------------------------------------------------------------------
    constructor( r, style )
    {
        super( r, r, style );
    }

    //--------------------------------------------------------------------------
    // GfxManager から呼ばれる
    //--------------------------------------------------------------------------
    proc( context )
    {
        super.proc( context );
        context.beginPath();
        context.arc( 0.0, 0.0, 0.5, 0.0, 2.0 * Math.PI, true );
        this.style.isEdge ? context.stroke() : context.fill();
        context.closePath();
    }
};


//------------------------------------------------------------------------------
//  Gfx2dImage
//------------------------------------------------------------------------------
Gfx2dImage = class extends Gfx2dComponent
{
    //--------------------------------------------------------------------------
    // コンストラクタ
    //  @param[in] w      幅
    //  @param[in] h      高さ
    //  @param[in] label  適用する画像のラベル
    //--------------------------------------------------------------------------
    constructor( w, h, label )
    {
        super( 0.0, 0.0 );

        this.label  = label;
        this.image  = gFileMngr.getImage( label );
        this.transform.setScale( w?w:1.0, h?h:1.0, 1.0 );
    }

    //--------------------------------------------------------------------------
    // GfxManager から呼ばれる
    //--------------------------------------------------------------------------
    proc( context )
    {
        super.calc( context );
        var img   = this.image;
        context.drawImage( img, 0.0, 0.0, img.width, img.height, -0.5, -0.5, 1.0, 1.0 );
    }
};


//------------------------------------------------------------------------------
//  Gfx2dSprite
//------------------------------------------------------------------------------
Gfx2dSprite = class extends Gfx2dComponent
{
    //--------------------------------------------------------------------------
    // コンストラクタ
    // @param[in] w      幅
    // @param[in] h      高さ
    // @param[in] label  適用するスプライトのラベル
    // @param[in] anime  再生するスプライト内のアニメ
    //--------------------------------------------------------------------------
    constructor( w, h, label, anime )
    {
        super( w, h );

        this.label  = label;
        this.sprite = gFileMngr.getSprite( label ); // スプライトアニメの情報が入ったJSON

        this.anime  = this.sprite[ anime ];
        this.image  = gFileMngr.getImage(gFileMngr.pathToLabel(self.anime.filepath));
        this.frame     = 0;    //  フレームのカウント
        this.current   = 0;    //  現在の再生フレーム
        this.isPlaying = true; //  再生フラグ

        this.transform.setScale( w?w:1.0, h?h:1.0, 1.0 );
    }

    //--------------------------------------------------------------------------
    // GfxManager から呼ばれる
    //--------------------------------------------------------------------------
    proc( context )
    {
        super.proc( context );

        var img   = this.image;
        var anime = this.anime;
        var aniw  = anime.width;
        var anih  = anime.height;
        var numHorizontal  = Math.floor( img.width / anime.width );
        var offsetX = this.current % numHorizontal * aniw;
        var offsetY = Math.floor( this.current / numHorizontal ) * anih;

        context.drawImage( img, offsetX, offsetY, aniw, anih, -0.5, -0.5, 1.0, 1.0 );
    }

    postproc()
    {
        super.postproc();

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
    }

    //--------------------------------------------------------------------------
    // 再生するスプライト内ののアニメを設定する
    // @param anime再生するスプライト内のアニメ
    //--------------------------------------------------------------------------
    setAnime( anime )
    {
        this.anime = this.sprite[ anime ];
        this.image = gFileMngr.getImage(gFileMngr.pathToLabel(this.anime.filepath));
        this.frame  = 0;
        this.current= 0;
        this.isPlaying  = true;
    }
};

})( window );
