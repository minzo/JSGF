//==============================================================================
//
//  双方向連結リスト [List.js]
//
//==============================================================================
(function(window, undefined) {

//------------------------------------------------------------------------------
// @breif ノード型
//------------------------------------------------------------------------------
var Node = function( data, prev, next ) {
    this.data = data;
    this.prev = prev;
    this.next = next;
};
Node.prototype.isHead = function() { return this.prev == null; };
Node.prototype.isTail = function() { return this.next == null; };

//------------------------------------------------------------------------------
//  @brief コンストラクタ
//------------------------------------------------------------------------------
List = function() {
    this.head = null;
    this.tail = null;
    this.length = 0;
    return this;
};

//------------------------------------------------------------------------------
//  @brief 格納数の取得
//------------------------------------------------------------------------------
List.prototype.getLength = function() { return this.length; };
List.prototype.getSize = function() { return this.length; };

//------------------------------------------------------------------------------
//  @brief 添え字アクセス
//------------------------------------------------------------------------------
List.prototype.at = function( index ) {

    var node = this.head;

    for(var i=0; i<index; i++) {
        node = node.next;
    }

    return node.data;
};

//------------------------------------------------------------------------------
//  @brief 列挙操作
//------------------------------------------------------------------------------
List.prototype.forEach = function( callback ) {
    for(var node = this.head; node != null; node = node.next) {
        callback( node.data );
    }
};

List.prototype.forEachReverse = function( callback ) {
    for(var node = this.tail; node != null; node = node.prev) {
        callback( node.data );
    }
};


//------------------------------------------------------------------------------
//  @brief 先頭/末尾へのpush/pop
//------------------------------------------------------------------------------
List.prototype.pushFront = function( data ) { this.insertPrev( this.head, data ); };
List.prototype.pushBack  = function( data ) { this.insertNext( this.tail, data ); };
List.prototype.popFront  = function() { return this.remove( this.head ); };
List.prototype.popBack   = function() { return this.remove( this.tail ); };


//------------------------------------------------------------------------------
//  @brief 前に挿入
//------------------------------------------------------------------------------
List.prototype.insertPrev = function( node, data ) {
    if(this.length == 0) {
        node = new Node( data, null, null );
        this.head = node;
        this.tail = node;
    }
    else {
        node.prev = new Node(data, node.prev, node);
        if( node == this.head ) this.head = node.prev;
    }
    this.length++;
};

//------------------------------------------------------------------------------
//  @brief 次に挿入
//------------------------------------------------------------------------------
List.prototype.insertNext = function( node, data ) {
    if(this.length == 0) {
        node = new Node( data, null, null );
        this.head = node;
        this.tail = node;
    }
    else {
        node.next = new Node(data, node, node.next);
        if(node == this.tail) this.tail = node.next;
    }
    this.length++;
};

//------------------------------------------------------------------------------
//  @brief 削除
//------------------------------------------------------------------------------
List.prototype.remove = function( node ) {

    if(this.length == 1) {
        this.head = null;
        this.tail = null;
    }
    else {
        if(node.isHead()) {
            this.head = node.next;
            node.next.prev = node.prev;
        }
        else if(node.isTail()) {
            this.tail = node.prev;
            node.prev.next = node.next;
        }
        else {
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }
    }
    this.length--;

    return node.data;
};

})(window);