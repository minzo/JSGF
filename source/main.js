onload = function() { init(); main(); };
const FPS = 64;

function init() {

    // MEMO:
    // iPhone 5 の iOS7版 Mobile Safari にて
    // minimal-ui 指定の際 Portlate 時の画面サイズは 640x1058 pixel

    // stand alone mode 時は 640x1096
    var screen = GfxManager.prototype.getScreenSize();
    var WIDTH  = screen.x;
    var HEIGHT = screen.y > 1096 ? screen.y : 1096;

    gHID     = new HidManager();
    gFileMngr= new FileManager();
    gEfxMngr = new EfxManager();
    gSndMngr = new SndManager();
    gGfxMngr = new GfxManager( GfxManager.Mode2d, screen.x, screen.y );
    gDbgMngr = new DbgManager( screen.x, screen.y );
    gScnMngr = new SceneManager( 'SceneSpring' );
    gObjMngr = new ObjectManager();
    gPhysMngr= new RigidBodyManager();

    gFileMngr.loadSound( './resource/webapp/mute.wav' );

    gScnMngr.entryScene( SceneGameMain,'SceneGameMain' );
    gScnMngr.entryScene( SceneSpring, 'SceneSpring' );
    gScnMngr.entryScene( SceneIK,'SceneIK' );

//    gScnMngr.entryScene( SceneMultistageRocket, 'SceneMultistageRocket' );
};

function main() {

    var start = Date.now();

    gHID.update();
    gFileMngr.update();
    gScnMngr.update();
    gPhysMngr.update();
    gObjMngr.update();
    gEfxMngr.update();
    gSndMngr.update();
    gGfxMngr.update();
    gDbgMngr.update();

    gObjMngr.postUpdate();

    var proc_time = Date.now() - start;
    var fps = Math.floor( gDbgMngr.getFPS() );
    var cpu = gDbgMngr.getPrfm( FPS, proc_time );

    gDbgMngr.print( "FPS: " + fps + " (" + cpu + ")%", 'black' );

    var interval = 1000 / FPS - proc_time;

    requestAnimationFrame( main );
//    setTimeout( main, interval > 0 ? interval : 0 );
};
