class FinishScreen extends Screen {
    display;
    background;
    downloadBtn;

    mainScene;
    speechCaption;
    fireAnim;
    spineData;
    playerSpine;
    

    constructor() {
        super();
        this.initScreen();        
        app.resizes.add( this.onResize );
        
    }

    initScreen() {
        this.display = new PIXI.Container();
        
        this.initSpine();
        this.initScene();    
    }

    initScene() {
        this.background = new PIXI.Sprite( assets.textures.pixi.finishStage );
        this.background.anchor.set( 0.5, 0.5 );
        this.display.addChild( this.background );
        
        this.mainScene = new PIXI.Container();
        this.display.addChild( this.mainScene );
        
        this.speechCaption = new PIXI.Container();
        this.mainScene.addChild( this.speechCaption );
        this.speechCaption.visible = false; 
        this.speechCaption.y = -290;     
        
        let speechBaloon = new PIXI.Sprite( assets.textures.pixi.speechBaloon );
        speechBaloon.anchor.set( 0.5, 1 );
        speechBaloon.scale.set( 0.4, 0.35 );
        speechBaloon.visible = true;
        
        let speech = new PIXI.Sprite( assets.textures.pixi.speech );
        speech.anchor.set( 0.5, 1 );
        speech.scale.set( 0.4, 0.35 );
        speech.visible = true;

        this.speechCaption.addChild( speechBaloon, speech );

        this.fireAnim = createAnimSprite( assets.textures.pixi['fire'], fireSheetData, 'fire' );	
	    this.fireAnim.anchor.set(0.5, 0.5);
        this.fireAnim.scale.set( 4, 4);
        this.fireAnim.visible = false;
        this.mainScene.addChild( this.fireAnim );
        this.fireAnim.x = 10;
        this.fireAnim.y = 0;

        this.initPlayerSpine();

        this.downloadBtn = new PIXI.Sprite(assets.textures.pixi.downloadBtn);
        this.display.addChild( this.downloadBtn );
        this.downloadBtn.anchor.set( 0.5, 0.5 );	
        this.downloadBtn.interactive = true;
        this.downloadBtn.on( 'pointertap', clickAd );        	
    } 

    initSpine() {
        let rawSkeletonData = JSON.parse(jsonData);
        let rawAtlasData = atlasData;

        let spineAtlas = new PIXI.spine.TextureAtlas(rawAtlasData, function(line, callback) {
            callback( assets.textures.pixi.spineImage.baseTexture)
        });

        let spineAtlasLoader = new PIXI.spine.AtlasAttachmentLoader(spineAtlas)
        let spineJsonParser = new PIXI.spine.SkeletonJson(spineAtlasLoader);
        this.spineData = spineJsonParser.readSkeletonData(rawSkeletonData);                
    } 

    initPlayerSpine() {
        this.playerSpine = new PIXI.spine.Spine(this.spineData);
        this.mainScene.addChild(this.playerSpine);
        this.playerSpine.visible = false;   

        this.playerSpine.autoUpdate = true;             
        //this.playerSpine.state.setAnimation(0, 'win', false);
        this.playerSpine.scale.set(0.35);
        
        this.playerSpine.position.x = 0
        this.playerSpine.position.y = 440;        
    } 

    enter( object ) {
        //console.log('enter from finish screen');

        switch (object.playerName ) {
            case 'Kenny':
                this.playerSpine.skeleton.setSkinByName('Kenny_Omega');
                this.playerSpine.visible = true;
                this.playerSpine.state.addAnimation(0, 'idle', true);
                this.playerSpine.state.addAnimation(1, 'win', false, 0);                       
                this.playerSpine.state.addAnimation(2, 'idle', true);                       
                gsap.from( this.playerSpine, 0.5, {alpha: 0} );
                this.fireAnim.visible = true;
                this.fireAnim.play();                
                gsap.from( this.fireAnim, 0.5, {alpha: 0, repeat: 1, yoyo: true});       
                gsap.delayedCall( 0.5, () => {
                    this.speechCaption.visible = true;
                    gsap.from( this.speechCaption, 1, {alpha: 0, ease: "back.out"});
                    gsap.from( this.speechCaption.scale, 0.7, {x:0, y:0, ease: "back.out"} );
                } );
                break;

            case 'MJF':
                this.playerSpine.skeleton.setSkinByName('MJF');
                this.playerSpine.visible = true;
                this.playerSpine.state.addAnimation(0, 'idle', true);
                this.playerSpine.state.addAnimation(1, 'win', false, 0);                       
                this.playerSpine.state.addAnimation(2, 'idle', true);    
                gsap.from( this.playerSpine, 0.5, {alpha: 0} );
                this.fireAnim.visible = true;
                this.fireAnim.play();                
                gsap.from( this.fireAnim, 0.5, {alpha: 0, repeat: 1, yoyo: true});       
                gsap.delayedCall( 0.5, () => {
                    this.speechCaption.visible = true;
                    gsap.from( this.speechCaption, 1, {alpha: 0, ease: "back.out"});
                    gsap.from( this.speechCaption.scale, 0.7, {x:0, y:0, ease: "back.out"} );
                } );
                break;
        }
    }

    exit() {
       //console.log('exit from finish screen')
    }
    
    onResize = ({ isPortraite, leftUI, rightUI, upUI, downUI }) => {               
        if (isPortraite) {
            this.background.height = downUI - upUI;
            this.background.width = 1917 * this.background.height/3000;

            this.downloadBtn.x = 0;
            this.downloadBtn.y = downUI - 120;

            this.mainScene.y = 0;            
        } else {            
            this.background.width = rightUI - leftUI;
            this.background.height = 3000 * this.background.width/1917;

            this.downloadBtn.x = rightUI - 210;
            this.downloadBtn.y = downUI - 100;

            this.mainScene.y = 180;
        }
    }
}

