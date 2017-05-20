//==============================================================================
//
// ベースオブジェクト [BaseObject.js]
//
//==============================================================================

(function( window, undefined ){

//------------------------------------------------------------------------------
// BaseObject
//------------------------------------------------------------------------------
BaseObject = function() {

    // Transform
    this.transform = new Transform();

    // Component
    this.components = {};

    return this;
};

//------------------------------------------------------------------------------
// Transform 操作
//------------------------------------------------------------------------------
// local
BaseObject.prototype.setPos   = function( x, y, z ) { this.transform.setPos(x, y, z); };
BaseObject.prototype.setScale = function( x, y, z ) { this.transform.setScale(x, y, z); };
BaseObject.prototype.getPos   = function() { return this.transform.getPos(); };
BaseObject.prototype.getScale = function() { return this.transform.getScale(); };

// model
BaseObject.prototype.getModelPos = function() { return this.transform.getModelPos(); };
BaseObject.prototype.getModelScale = function() { return this.transform.getModelScale(); };

// world
BaseObject.prototype.getWorldPos = function() { return this.transform.getWorldPos(); };
BaseObject.prototype.getWorldScale = function() { return this.transform.getWorldScale(); };

// Parent
BaseObject.prototype.setParent = function( parent ) {
    this.transform.setParent( parent.transform );
};

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
BaseObject.prototype.attachComponent = function( component ) {
    return this.components[ component.constructor.name ] = component;
};
BaseObject.prototype.detachComponent = function() {
    delete this.components[ name ];
};


//------------------------------------------------------------------------------
// 継承先で実装する処理
//------------------------------------------------------------------------------
// 計算処理 (必ず親のcalcが先に実行される)
BaseObject.prototype.calc = function() {};


//------------------------------------------------------------------------------
// update - 更新処理
//------------------------------------------------------------------------------
BaseObject.prototype.update = function() {

    // 座標更新
    this.transform.calc();

    // 計算処理
    this.calc();

    var components = this.components;

    // コンポーネントの計算
    for( var name in components )
    {
        components[ name ].calc( this );
    }
};
BaseObject.prototype.postUpdate = function() {
    this.transform.postcalc();
};

})( window );
