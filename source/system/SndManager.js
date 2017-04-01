//==============================================================================
//
//  サウンドマネージャ [SndManager.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  Web Audio API vender prefix 対策
//------------------------------------------------------------------------------
window.AudioContext = window.AudioContext || window.webkitAudioContext;

//------------------------------------------------------------------------------
//  コンストラクタ
//
//  @param[in] width  生成する canvas の幅
//  @param[in] height 生成する canvas の高さ
//------------------------------------------------------------------------------
SndManager = function() {

    //  SndWebAudio が用いるサウンドマネージャ用変数に設定
    systemSndManager = this;

    //  conetxt の取得
    this.context = new AudioContext();

    //  Master Volume の作成
    this.gainNode = this.context.createGain();
    this.gainNode.connect( this.context.destination );

    //  PlayList
    this.playList ={};

    return this;
};


//------------------------------------------------------------------------------
//  更新
//------------------------------------------------------------------------------
SndManager.prototype.update = function() {};


//------------------------------------------------------------------------------
//  再生 / 停止
//------------------------------------------------------------------------------
//  再生
SndManager.prototype.play = function( label, loop ) {
    var buffer= gFileMngr.getSound( label );
    var sound = new SndWebAudio( buffer );
    this.playList[ label ] = sound;
    this.playList[ label ].play( loop );
};
//  停止
SndManager.prototype.stop = function( label ) {
    this.playList[ label ].stop();
};


//------------------------------------------------------------------------------
//  Master Volume
//
//  @param[in] vol 設定する音量 [0.0,1.0]
//------------------------------------------------------------------------------
SndManager.prototype.setMasterVolume = function( vol ) {
    this.gainNode.gain = vol;
};


})( window );
