//==============================================================================
//
//  物理コンポーネント [RigidBodyComponent.js]
//
//==============================================================================
(function(window, undefined) {

RigidBodyManager = class
{
    //--------------------------------------------------------------------------
    // コンストラクタ
    //--------------------------------------------------------------------------
    constructor()
    {
        this.objectList = new Array();
    }

    //--------------------------------------------------------------------------
    // 登録
    //--------------------------------------------------------------------------
    entry( object )
    {
        this.objectList[ this.objectList.length ] = object;
    }

    //--------------------------------------------------------------------------
    // 更新
    //--------------------------------------------------------------------------
    update()
    {
        var objs = this.objectList;
        var length = this.objectList.length;

        for( var i=0; i<length; i++)
        {
            objs[ i ].preproc();
        }

        for(var i=0; i<length; i++)
        {
            for(var j=i+1; j<length; j++)
            {
                // todo 衝突判定処理
                // objs[ i ].isHit( objs[ j ] );
            }
        }

        for( var i=0; i<length; i++)
        {
            objs[ i ].proc();
        }

        for( var i=0; i<length; i++)
        {
            objs[ i ].postproc();
        }

        // 処理リストを空にする
        objs.length = 0;
    }
};

})( window );
