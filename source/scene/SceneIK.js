//==============================================================================
//
//  Scene IK [SceneIK.js]
//
//==============================================================================

(function( window, undefined ) {

//------------------------------------------------------------------------------
//  コンストラクタ
//------------------------------------------------------------------------------
SceneIK = function() {
    var self = this instanceof SceneIK
             ? this
             : Object.create( SceneIK.prototype );
    SceneBase.call( self );

    self.effector = [];
    self.constraints = [];
    self.lines = [];

    return self;
};
SceneIK.prototype = new SceneBase();
//gScnMngr.entryScene( SceneIK, 'SceneIK' );

//------------------------------------------------------------------------------
//  ロード
//------------------------------------------------------------------------------
SceneIK.prototype.load   = function() {
};

//------------------------------------------------------------------------------
//  初期化
//------------------------------------------------------------------------------
SceneIK.prototype.init   = function() {

    this.effector = [
        new GfxCircle(50, 50, 20, 20, 'red'),
        new GfxCircle(100, 100, 20, 20, 'blue'),
        new GfxCircle(150, 150, 20, 20, 'green'),
        new GfxCircle(200, 200, 20, 20, 'gray')
    ];

    for(var i=0; i<this.effector.length-1; i++)
    {
        var pos1 = this.effector[i].pos;
        var pos2 = this.effector[i+1].pos;
        var dx = pos1.x - pos2.x;
        var dy = pos1.y - pos2.y;

        this.constraints[i] = Math.sqrt(dx*dx+dy*dy);

       this.lines[i] = new GfxLine(i*10,i*10+5,i*20,i*10+5,'red');
    }

    this.rootPos = {
        x: this.effector[this.effector.length-1].pos.x,
        y: this.effector[this.effector.length-1].pos.y
    }
};

//------------------------------------------------------------------------------
//  更新
//------------------------------------------------------------------------------
SceneIK.prototype.update = function() {

    var effector = this.effector;
    var constraints = this.constraints;

    var rootPos = this.rootPos;

    var target = {x:0, y:0};

    for(var i=0; i<gHID.touches.length; i++)
    {
        if(gHID.touches[i].state == 'hld')
        {
            target = gHID.touches[i].pos;
            break;
        }
    }

    var NUM_MAX_ITERATION = 1;

    gDbgMngr.print("POS: " + target.x + " " + target.y)

    for(var i=0; i<NUM_MAX_ITERATION; i++)
    {
        var dv = {
            x: target.x - effector[0].pos.x,
            y: target.y - effector[0].pos.y,
            len: 0
        };

        dv.len = Math.sqrt(dv.x * dv.x + dv.y * dv.y);

        if(dv.len > constraints[0])
        {
            effector[0].pos.x += dv.x / dv.len * constraints[0];
            effector[0].pos.y += dv.y / dv.len * constraints[0];
        }
        else
        {
            effector[0].pos.x += dv.x;
            effector[0].pos.y += dv.y;
        }

        for(var pid=0; pid<effector.length-1; pid++)
        {
            var dv = {
                x: effector[pid+1].pos.x - effector[pid].pos.x,
                y: effector[pid+1].pos.y - effector[pid].pos.y,
                len: 0
            };

            dv.len = Math.sqrt(dv.x * dv.x + dv.y * dv.y);

            dv.x *= 0.5 - 0.5 * constraints[pid] / dv.len;
            dv.y *= 0.5 - 0.5 * constraints[pid] / dv.len;

            effector[pid].pos.x += dv.x;
            effector[pid].pos.y += dv.y;

            effector[pid+1].pos.x -= dv.x;
            effector[pid+1].pos.y -= dv.y;
        }

        dv.x = rootPos.x - effector[effector.length - 1].pos.x;
        dv.y = rootPos.y - effector[effector.length - 1].pos.y;

//        dv.len = Math.sqrt(dv.x * dv.x + dv.y * dv.y);
//        dv.x *= 1.0 - constraints[constraints.length - 1] / dv.len;
//        dv.y *= 1.0 - constraints[constraints.length - 1] / dv.len;

        for(var i=0; i<effector.length; i++)
        {
            effector[i].pos.x += dv.x;
            effector[i].pos.y += dv.y;

            effector[i].update();
        }
    }

    for(var i=0; i<this.lines.length; i++)
    {
        this.lines[i].pos.x1 = this.effector[i].pos.x + this.effector[i].size.x / 2;
        this.lines[i].pos.y1 = this.effector[i].pos.y + this.effector[i].size.y / 2;
        this.lines[i].pos.x2 = this.effector[i+1].pos.x + this.effector[i+1].size.x / 2;
        this.lines[i].pos.y2 = this.effector[i+1].pos.y + this.effector[i+1].size.y / 2;
        this.lines[i].color  = this.effector[i].color;

        this.lines[i].update();
    }
};

//------------------------------------------------------------------------------
//  描画
//------------------------------------------------------------------------------
SceneIK.prototype.draw   = function() {


    for(var i=0; i<this.effector.length; i++)
    {
        this.effector[i].draw();
    }

        for(var i=0; i<this.lines.length; i++)
    {
        this.lines[i].draw();
    }

};

//------------------------------------------------------------------------------
//  終了
//------------------------------------------------------------------------------
SceneIK.prototype.exit   = function() {
};

})( window );
