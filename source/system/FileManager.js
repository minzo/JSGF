//==============================================================================
//
//  ファイルマネージャ [FileManager.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  コンストラクタ
//------------------------------------------------------------------------------
FileManager = function() {

    var self = this instanceof FileManager
             ? this
             : Object.create( FileManager.prototype );

    //  ロード中のリソースリスト
    self.LoadedImages = {};
    self.LoadedSounds = {};
    self.LoadedSprites= {};

    //  全てのリソースが読み込まれているか
    self.bAllImageLoaded = true;
    self.bAllSoundLoaded = true;
    self.bAllSpriteLoaded= true;

    //  リソースのリスト
    self.Images = {};
    self.Sounds = {};
    self.Sprites= {};

    return self;
};

//------------------------------------------------------------------------------
//  パスからラベルに変換する
//
//  @oaram[in] filepath ファイルパス
//  @return    label    ラベル
//------------------------------------------------------------------------------
FileManager.prototype.pathToLabel = function( filepath ) {
    return filepath.substring( filepath.lastIndexOf( '/' ) + 1,
                               filepath.lastIndexOf( '.' ) );
};

//------------------------------------------------------------------------------
//  Image を取得する
//
//  @param[in] label 取得する Image のラベル
//------------------------------------------------------------------------------
FileManager.prototype.getImage = function( label ) {
    return this.Images[ label ];
};

//------------------------------------------------------------------------------
//  Sound を取得する
//
//  @param[in] label 取得する Sound のラベル
//------------------------------------------------------------------------------
FileManager.prototype.getSound = function( label ) {
    return this.Sounds[ label ];
};

//------------------------------------------------------------------------------
//  Sprite を取得する
//
//  @param[in] label 取得する Sprite のラベル
//------------------------------------------------------------------------------
FileManager.prototype.getSprite = function( label ) {
    return this.Sprites[ label ];
};

//------------------------------------------------------------------------------
//  Image をロードする
//
//  @param[in] filepath ロードするファイルのパス
//------------------------------------------------------------------------------
FileManager.prototype.loadImage = function( filepath ) {

    var self  = this;
    var label = self.pathToLabel( filepath );

    //  2重読み込みを回避
    if( self.Images[ label ] != undefined ) return;

    self.LoadedImages[ label ] = false;
    self.bAllImageLoaded = false;

    self.Images[ label ] = new Image();
    self.Images[ label ].src = filepath;
    self.Images[ label ].onload = function() {
        self.LoadedImages[ label ] = true;
        console.log( "[Image] " + filepath + " loaded" );
    };
};

//------------------------------------------------------------------------------
//  Sound をロードする
//
//  @param[in] filepath ロードするファイルのパス
//------------------------------------------------------------------------------
FileManager.prototype.loadSound = function( filepath ) {

    var self  = this;
    var label = self.pathToLabel( filepath );
    var ext   = filepath.substring( filepath.lastIndexOf('.') + 1 );

    //  2重読み込みを回避
    if( self.Sounds[ label ] != undefined ) return;

    self.LoadedSounds[ label ] = false;
    self.bAllSoundLoaded = false;

    var request = new XMLHttpRequest();
    request.onload = function() {
        console.log( "[Sound] " + filepath + " loaded" );
        var context = systemSndManager.context;
        context.decodeAudioData( request.response, function( buffer ) {
            self.LoadedSounds[ label ] = true;
            self.Sounds[ label ] = buffer;
            console.log( "[Sound] " + filepath + " decoded" );
        });
    };
    request.open( 'GET', filepath, true );
    request.responseType = 'arraybuffer';
    request.send();
};

//------------------------------------------------------------------------------
//  Sprite JSON をロードする
//
//  @param[in] filepath ロードするファイルのパス
//------------------------------------------------------------------------------
FileManager.prototype.loadSprite = function( filepath ) {

    var self = this;
    var label= self.pathToLabel( filepath );

    self.LoadedSprites[ label ] = false;
    self.bAllSpriteLoaded = false;

    self.load( filepath, function( file ) {

        self.LoadedSprites[ label ] = true;
        self.Sprites[ label ]       = JSON.parse( file );
        console.log( "[Sprite] " + filepath + " loaded" );

        //  Sprite JSON 内の画像を読み込む
        var animes = self.Sprites[ label ];
        for( var key in animes ) {
            self.loadImage( animes[ key ].filepath );
        }
    });
};

//------------------------------------------------------------------------------
//  ロード
//
//  @param[in] fillepath 読み込むファイルのパス
//  @param[in] callback  コールバック関数
//------------------------------------------------------------------------------
FileManager.prototype.load = function( filepath, callback ) {

    var request = new XMLHttpRequest();

    request.onload = function() {
        callback( request.responseText );
    };

    request.open( 'GET', filepath, true );
    request.send();
};

//------------------------------------------------------------------------------
//  リソースを全て破棄
//------------------------------------------------------------------------------
FileManager.prototype.destroyAll = function() {

    //  キャッシュ
    var _Images = this.Images;
    var _Sounds = this.Sounds;
    var _Sprites= this.Sprites;

    //  Image のリソースを破棄
    for( var imgs_key in _Images ) {
        delete _Images[ imgs_key ];
    }

    //  Sprite のリソースを破棄
    for( var sprt_key in _Sprites ) {
        delete _Sprites[ sprt_key ];
    }

    //  Sound のリソースを破棄
    for( var snds_key in _Sounds ) {
        delete _Sounds[ snds_key ];
    }
};

//------------------------------------------------------------------------------
//  リソースが全て読み込み済みであるか調べる
//
//  @return bool 読み込み済みなら true を返す
//------------------------------------------------------------------------------
FileManager.prototype.isLoadedAll = function() {
    return this.bAllImageLoaded && this.bAllSoundLoaded && this.bAllSpriteLoaded;
};

//------------------------------------------------------------------------------
//  更新
//------------------------------------------------------------------------------
FileManager.prototype.update = function() {

    //  キャッシュ
    var _LoadedImages = this.LoadedImages;
    var _LoadedSounds = this.LoadedSounds;
    var _LoadedSprites= this.LoadedSprites;

    //  全て読み込み済みかどうか
    var _bAllImageLoaded = true;
    var _bAllSoundLoaded = true;
    var _bAllSpriteLoaded= true;

    //  Image の読み込みフラグの管理
    for( var imgs_key in _LoadedImages ) {
        if( _LoadedImages[ imgs_key ] ) {
            delete _LoadedImages[ imgs_key ];
        }
        else {
            _bAllImageLoaded &= false;
        }
    }

    //  Sound の読み込みフラグの管理
    for( var snds_key in _LoadedSounds ) {
        if( _LoadedSounds[ snds_key ] ) {
            delete _LoadedSounds[ snds_key ];
        }
        else {
            _bAllSoundLoaded &= false;
        }
    }

    //  Sprite の読み込みフラグの管理
    for( var sprt_key in _LoadedSprites ) {
        if( _LoadedSprites[ sprt_key ] ) {
            delete _LoadedSprites[ sprt_key ];
        }
        else {
            _bAllSpriteLoaded &= false;
        }
    }

    //  読み込み状態の反映
    this.bAllImageLoaded = _bAllImageLoaded;
    this.bAllSoundLoaded = _bAllSoundLoaded;
    this.bAllSpriteLoaded= _bAllSpriteLoaded;
};

})( window );
