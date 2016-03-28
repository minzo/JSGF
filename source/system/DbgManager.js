//==============================================================================
//
//  デバッグマネージャ [DbgManager.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  コンストラクタ
//
//  @param[in] width  生成するデバッグ用メッセージ表示領域の幅
//  @param[in] height 生成するデバッグ用メッセージ表示領域の高さ
//------------------------------------------------------------------------------
DbgManager = function( width, height ) {

    var self = this instanceof DbgManager
             ? this
             : Object.create( DbgManager.prototype );

    //  描画情報リスト
    self.printList = [];

    //  FPS計測
    self.fps = {};
    self.fps.idx = 0;               // rec に記録すべきインデックス
    self.fps.sum = 0;               // 過去60フレームの合計時間時間[ms]
    self.fps.rec = new Array( 60 ); // 過去60フレームの処理時間[ms]
    self.fps.prev= 0;               // 前フレームの時刻
    for( var i=0; i<60; i++){
        self.fps.rec[ i ] = 0;
    }

    //  負荷計測
    self.prfm = {};
    self.prfm.idx = 0;
    self.prfm.sum = 0;
    self.prfm.rec = new Array( 60 );
    for( var i=0; i<60; i++){
        self.prfm.rec[ i ] = 0;
    }

    return self;
};

//------------------------------------------------------------------------------
//  更新
//------------------------------------------------------------------------------
DbgManager.prototype.update = function() {

    var _context   = systemGfxManager.context;
    var _printList = this.printList;

    _context.save();

    _context.font = "40px 'sans-serif'";

    for(var i=0, l=_printList.length; i<l; i++ ){
        var string = _printList[ i ].string;
        var color  = _printList[ i ].color;
        _context.fillStyle = color;
        _context.fillText( string, 5, i*40 + 30 );
    }

    _context.restore();

    _printList.length = 0;
};

//------------------------------------------------------------------------------
//  印字
//
//  @param[in] string デバッグ用メッセージ
//  @param[in] color  デバッグ用メッセージの色
//------------------------------------------------------------------------------
DbgManager.prototype.print = function( string, color ) {
    var _printList = this.printList;
    _printList[ _printList.length ] = {
        string: ( string== undefined ) ? ''      : string,
        color : ( color == undefined ) ? 'black' : color
    };
};

//------------------------------------------------------------------------------
//  FPS計測
//
//  @return 現在のフレームレートを返す
//------------------------------------------------------------------------------
DbgManager.prototype.getFPS = function() {

    var _fps    = this.fps;
    var idx     = _fps.idx;
    var rec     = _fps.rec;
    var current = Date.now();
    var interval= current - _fps.prev;

    _fps.sum  -= rec[ idx ];
    _fps.sum  += interval;
    rec[ idx ] = interval;

    _fps.idx  = ( idx + 1 ) % 60;
    _fps.prev = current;

    return 60000 / _fps.sum;
};

//------------------------------------------------------------------------------
//  負荷計測
//
//  @return int fps を維持するための余力のうち何%使用したかを返す
//------------------------------------------------------------------------------
DbgManager.prototype.getPrfm = function( fps, interval ) {

    var _prfm  = this.prfm;
    var idx    = _prfm.idx;
    var rec    = _prfm.rec;

    _prfm.sum -= rec[ idx ];
    _prfm.sum += interval;
    rec[ idx ] = interval;

    _prfm.idx  = ( idx + 1 ) % 60;

    return  Math.floor( _prfm.sum * fps / 600 );
};

//------------------------------------------------------------------------------
//  ログ
//  MEMO: console.系の関数の別名
//        空の関数の置き換えることでログを無効化しやすくしている
//------------------------------------------------------------------------------
DbgManager.prototype.log    = console.log;
DbgManager.prototype.dir    = console.dir;
DbgManager.prototype.assert = console.assert;

})( window );
