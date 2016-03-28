//==============================================================================
//
//  テーブルビュー [TableView.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  コンストラクタ
//
//  @param[in] x TableView の左上のX座標
//  @param[in] y TableView の左上のY座標
//  @param[in] w TableView の幅
//  @param[in] h TableView の高さ
//------------------------------------------------------------------------------
TableView = function( x, y, w, h ) {
    var self = this instanceof TableView
             ? this
             : Object.create( TableView.prototype );
    TouchObject.call( self, x, y, w, h );

    //  スクロール速度
    self.acc = { x:0, y:0 };
    self.spd = { x:0, y:0 };

    //  TableView に表示される項目のリスト
    self.cellList = [];

    return self;
};
TableView.prototype = Object.create( TouchObject.prototype );
TableView.prototype.constructor = TableView;

//------------------------------------------------------------------------------
//  更新 / 描画
//------------------------------------------------------------------------------
TableView.prototype.update  = function() {

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
        }
    }

    //  タッチされていたら移動量に応じてスクロールする
    else {

        //  指が離れたら追随をやめる
        if( _touched.state == 'rls' ){
            this.touched = null;
        }
    }
};
TableView.prototype.draw    = function() {
    systemGfxManager.entryDrawList( this );
    for( var i=0,cells=this.cellList,l=cells.length; i<l; i++ ) {
        cells[ i ].draw();
    }
};
TableView.prototype.isTouch = TouchRect.prototype.isTouch;

//------------------------------------------------------------------------------
//  リスト操作
//------------------------------------------------------------------------------
TableView.prototype.addList = function( cell ) {
    cell.size.x = this.size.x;
    cell.parent = this;
    this.cellList.push( cell );
};
TableView.prototype.insertList = function( cell ) {};
TableView.prototype.removeList = function( index ) {};



//------------------------------------------------------------------------------
//  TableViewCell
//------------------------------------------------------------------------------
TableViewCell = function() {
    var self = this instanceof TableViewCell
             ? this
             : Object.create( TableViewCell.prototype );
    GfxObject.call( self, 0, 0, 0, 0, 'skyblue' );
    return self;
};
TableViewCell.prototype = Object.create( GfxObject.prototype );
TableViewCell.prototype.constructor = TableViewCell;
TableViewCell.prototype.touchTrg= function( touch ) {};
TableViewCell.prototype.touchHld= function( touch ) {};
TableViewCell.prototype.touchRls= function( touch ) {};
TableViewCell.prototype.preproc = function( touch ) {};
TableViewCell.prototype.proc    = function( context ) {};
TableViewCell.prototype.postproc= function() {};

})( window );
