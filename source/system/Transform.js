//==============================================================================
//
// Transform [Transform.js]
//
//==============================================================================

(function( window, undefined ){

//------------------------------------------------------------------------------
// Transform2d
//------------------------------------------------------------------------------
Transform = function() {

    // Transform
    this.pos    = new VEC3().setZero();
    this.scale  = new VEC3( 1.0, 1.0, 1.0 );
    this.rotate = new VEC3( 0.0, 0.0, 0.0 );

    // Matrix
    this.modelMtx = new MTX34();
    this.worldMtx = new MTX34();

    // Parent
    this.parent = null;
    this.isUpdated = false;

    return this;
};

//------------------------------------------------------------------------------
// 基本操作
//------------------------------------------------------------------------------
// local
Transform.prototype.setPos   = function( x, y, z ) { this.pos.set(x, y, z); };
Transform.prototype.setScale = function( x, y, z ) { this.scale.set(x, y, z); };
Transform.prototype.getPos   = function() { return this.pos; };
Transform.prototype.getScale = function() { return this.scale; };

// model
Transform.prototype.getModelPos = function() {
    return new VEC3( this.modelMtx.m03, this.modelMtx.m13, this.modelMtx.m23 );
};
Transform.prototype.getModelScale = function() {
    return new VEC3( this.modelMtx.m00, this.modelMtx.m11, this.modelMtx.m22 );
};

// world
Transform.prototype.getWorldPos = function() {
    return new VEC3( this.worldMtx.m03, this.worldMtx.m13, this.worldMtx.m23 );
};
Transform.prototype.getWorldScale = function() {
    return new VEC3( this.worldMtx.m00, this.worldMtx.m11, this.worldMtx.m22);
};

// Parent
Transform.prototype.setParent = function( parent ) { this.parent = parent; };

// 更新が必要かどうか
Transform.prototype.resetUpdateFlag = function() { this.isUpdated = false; }

//------------------------------------------------------------------------------
// update - 更新処理
//------------------------------------------------------------------------------
Transform.prototype.calc = function() {

    if( this.isUpdated ) return;

    var parent   = this.parent;
    var modelMtx = this.modelMtx.setIdentity();

    var pos    = this.pos;
    var scale  = this.scale;
    var rotate = this.rotate;

    // Model Matrix
    modelMtx.translate(pos.x, pos.y, pos.z);
    modelMtx.rotate(rotate.z);
    modelMtx.scale(scale.x, scale.y, scale.z);

    // 親がいる場合の処理
    if( parent ) {

        // 親のアップデートが終わっていなかったらアップデート
        if(!parent.isUpdated) {
            parent.calc();
        }

        // WorldMatrix 計算
        this.worldMtx = MTX34.mult(parent.worldMtx, modelMtx);
    }
    else {
        // WorldMatrix 計算
        this.worldMtx = modelMtx.clone();
    }

    this.isUpdated = true;
};
Transform.prototype.postcalc = function() {
    this.isUpdated = false;
};

})( window );
