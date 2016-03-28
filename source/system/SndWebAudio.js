//==============================================================================
//
//  WebAudio クラス [SndWebAudio.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  コンストラクタ
//------------------------------------------------------------------------------
SndWebAudio = function( buffer ) {

    var self = this instanceof SndWebAudio
             ? this
             : Object.create( SndWebAudio.prototype );

    self.context= systemSndManager.context;
    self.buffer = buffer;
    self.bufferSoureceNode = null;

    return self;
};


//------------------------------------------------------------------------------
//  再生 / 停止
//------------------------------------------------------------------------------
//  再生
SndWebAudio.prototype.play = function( loop ) {
    this.bufferSoureceNode = this.context.createBufferSource();
    this.bufferSoureceNode.connect( systemSndManager.gainNode );
    this.bufferSoureceNode.buffer = this.buffer;
    this.bufferSoureceNode.loop   = loop ? true : false;
    this.bufferSoureceNode.start( 0 );
};
//  停止
SndWebAudio.prototype.stop = function() {
    this.bufferSoureceNode.stop( 0 );
};


//------------------------------------------------------------------------------
//  再生状態の取得
//
//  @return state 再生状態 (2:再生中, 3:再生終了)
//------------------------------------------------------------------------------
SndWebAudio.prototype.getPlayState = function() {
    return this.bufferSoureceNode.playbackState;
};


})( window );
