//==============================================================================
//
//  シーンマネージャ [SceneManager.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  コンストラクタ
//
//  @param[in] firstSceneName 一番最初のシーン名
//------------------------------------------------------------------------------
SceneManager = function( firstSceneName ) {

    var self = this instanceof SceneManager
             ? this
             : Object.create( SceneManager.prototype );

    self.state = new StateControl( 'first' );
    self.fader = new FaderBase();
    self.scene = null;
    self.name  = firstSceneName;
    self.sceneList = {};
    self.sceneStack= [];

    self.nextSceneName = "";

    return self;
};

//------------------------------------------------------------------------------
//  シーンの変更
//------------------------------------------------------------------------------
SceneManager.prototype.changeScene = function( nextSceneName ) {
    this.name = nextSceneName;
    this.state.change( 'exit' );
    this.sceneStack.forEach( function( scene ) { scene.exit(); } );
    this.sceneStack = [];
};

//------------------------------------------------------------------------------
//  現在のシーンをスタックに push してシーンを変更する
//------------------------------------------------------------------------------
SceneManager.prototype.pushScene = function( nextSceneName ) {
    var state = this.state;
    this.sceneStack.push({scene:this.scene, name:this.name, state:state.get()});
    this.name = nextSceneName;
    this.state.change( 'load' );
    this.fader.startFadein();
};

//------------------------------------------------------------------------------
//  現在のシーンを破棄してスタックから pop したシーンに変更する
//------------------------------------------------------------------------------
SceneManager.prototype.popScene = function() {
    console.assert( this.sceneStack.length, '[Scene] Scene Stack Empty' );
    var data   = this.sceneStack.pop();
    this.scene.exit();
    this.scene = data.scene;
    this.name  = data.name;
    this.state.change( data.state );
};

//------------------------------------------------------------------------------
//  シーンの登録
//------------------------------------------------------------------------------
SceneManager.prototype.entryScene = function( scene, name ) {
    this.sceneList[ name ] = scene;
};

//------------------------------------------------------------------------------
//  フェーダの設定
//------------------------------------------------------------------------------
SceneManager.prototype.setFader = function( faderClass ) {
    this.fader = new faderClass();
    this.fader.load();
};


//------------------------------------------------------------------------------
//  更新
//------------------------------------------------------------------------------
SceneManager.prototype.update = function() {

    //  キャッシュ
    var _state = this.state;
    var _scene = this.scene;
    var _fader = this.fader;

    _state.update();

    switch( _state.get() ){
    //  シーンマネージャの起動  ------------------------------------------------
    case 'first':
        _state.change( 'load' );
        _fader.state.change( 'fade' );
        break;

    //  ロード  ----------------------------------------------------------------
    case 'load':
        //  初回にシーンの生成とロードをおこなう
        if( _state.isFirst() ) {

            console.log( "--- " + this.name + " ---" );
            console.log( "--- load ---" );
            console.assert( this.sceneList[ this.name ],
                            '[Scene] "' + this.name + '" is not entry' );

            //  シーンを生成してロード
            this.scene = new (this.sceneList[ this.name ])();
            this.scene.load();
        }

        //  読み込みが終了していたら初期化状態に遷移
        if( gFileMngr.isLoadedAll() ) {
            _state.change( 'init' );
        }
        break;

    //  初期化  ----------------------------------------------------------------
    case 'init':
        console.log("--- init ---");

        //  初期化関数の呼び出し
        _scene.init();
        _state.change( 'update' );

        //  フェーダのフェードアウト開始
        _fader.startFadeout();

        break;

    //  更新と描画  ------------------------------------------------------------
    case 'update':
        if( _state.isFirst() ) {
            console.log("--- update ---");
        }
        _scene.update();
        _scene.draw();
        break;

    //  終了  ------------------------------------------------------------------
    case 'exit':
        console.log("--- exit ---");

        //  終了時関数の呼び出し
        _scene.exit();
        _state.change( 'load' );

        //  フェーダのフェードインの開始
        _fader.startFadein();

        break;
    }

    _fader.update();

    if( _fader.state.get() !== 'stop' ) {
        _fader.draw();
    }
};

})( window );
