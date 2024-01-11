class FightScreen extends Screen {
    display;
    background;
    figthScene;
    reward;
    fightCaptionHorizon; 
    fightCaptionVertical;     

    playerCharacters;
    enemyCharacters;

    playerSpine;
    enemySpine;
    spineData;

    timeline1;
    timeline2;

    selectedWrestless = {};
    
    constructor() {
        super();
        this.initScreen();
        app.resizes.add( this.onResize );        
    }

    initScreen() {
        this.display = new PIXI.Container();
        
        this.initSpine();
        this.initFightRing();                
        this.initReward();
        this.initFightPresentation();   
        this.initWinText(); 

    }

    initFightRing() {
        this.background = new PIXI.Sprite( assets.textures.pixi.ringBackground ); 
        this.background.anchor.set( 0.5, 0.5 );
        this.display.addChild( this.background );

        this.figthScene = new PIXI.Container();        
        this.display.addChild( this.figthScene );
        this.figthScene.visible = true;             
        
        let fightRing = new PIXI.Sprite( assets.textures.pixi.ring ); 
        fightRing.anchor.set( 0.5, 0.5 );

        let ringLight = new PIXI.Sprite( assets.textures.pixi.lights ); 
        ringLight.anchor.set( 0.5, 0.5 );
        this.figthScene.addChild( fightRing, ringLight ); 

        this.enemyCharacters = new PIXI.Container();
        this.enemyCharacters.scale.set(0.155);
        this.initEnemySpine();
        this.figthScene.addChild( this.enemyCharacters );
        this.enemyCharacters.visible = true;        
        
        this.playerCharacters = new PIXI.Container();
        this.playerCharacters.scale.set(0.155);
        this.initPlayerSpine();
        this.figthScene.addChild( this.playerCharacters );
        this.playerCharacters.visible = true;         

        let ringRope = new PIXI.Sprite( assets.textures.pixi.rope ); 
        ringRope.anchor.set( 0.5, 0.5 );
        this.figthScene.addChild( ringRope );
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
        
        this.playerSpine = new PIXI.spine.Spine(this.spineData);
        this.playerSpine.autoUpdate = true;
        //this.playerSpine.skeleton.scaleX = 1;
        //this.playerSpine.skeleton.scaleY = 1;


        this.enemySpine = new PIXI.spine.Spine(this.spineData);
        this.enemySpine.autoUpdate = true;
    } 

    initPlayerSpine() {        
        this.playerCharacters.addChild(this.playerSpine);

        this.playerCharacters.visible = false;
        // this.playerSpine.skeleton.setSkinByName('Kenny_Omega');
        // this.playerSpine.state.addAnimation(0, "figthidle", true);  

        this.playerSpine.scale.set(-1, 1);
        this.playerSpine.position.set(-800, 450);
    } 
    
    initEnemySpine() {        
        this.enemyCharacters.addChild(this.enemySpine);        

        this.enemyCharacters.visible = false;
        // this.enemySpine.skeleton.setSkinByName('Isiah_Kassidy');
        // this.enemySpine.state.addAnimation(0, "figthidle", true);

        this.enemySpine.position.set(550, 650); 
    }

    initScenario() {
        this.playerSpine.state.addAnimation(1, "punch", false, 0);
        gsap.delayedCall( 0.3, () => {
            playSound( 'grunt', false, 0.5 );

        } ); 
        this.playerSpine.state.addAnimation(1, "punch", false, 1);
        gsap.delayedCall( 1.2, () => {
            playSound( 'grunt', false, 0.5 );

        } ); 
        this.playerSpine.state.addAnimation(1, "kick", false, 1);
        gsap.delayedCall( 2.2, () => {
            playSound( 'damage', false, 0.5 );

        } );         
        this.playerSpine.state.addAnimation(1, "slap", false, 1);
        gsap.delayedCall( 4, () => {
            playSound( 'damage', false, 0.5 );

        } );         
        this.playerSpine.state.addAnimation(1, "figthidle", true, 0);
        this.playerSpine.state.addAnimation(1, "body_slam", false, 0);        
        this.playerSpine.state.addAnimation(2, "win", false, 8);
        this.playerSpine.state.tracks[2].listener = {
            complete: () => {
                playSound( 'peoplesWin', false, 0.6 );               
                this.winCaption.visible = true;
                gsap.from( this.winCaption.scale, 0.4, {x: 0.7, y: 0.7, repeat: -1, yoyo: true, ease: 'sine.inOut'} );

                gsap.delayedCall( 2, () => {
                    app.screenManager.set( FinishScreen, this.selectedWrestless, true );             
                });
        }};

        this.enemySpine.state.addAnimation(1, "block_arm", false, 0);
        this.enemySpine.state.addAnimation(1, "block_arm", false, 1);
        this.enemySpine.state.addAnimation(1, "figthidle", true, 0);
        this.enemySpine.state.addAnimation(1, "knockeddown_in", false, -1);
        this.enemySpine.state.addAnimation(1, "knockeddown_out", false, 0);
        this.enemySpine.state.addAnimation(1, "figthidle", false, 0);
        this.enemySpine.state.addAnimation(1, "defeat_f", false, -1);
        this.enemySpine.state.addAnimation(1, "stand_up_f", false, 1);
        this.enemySpine.state.addAnimation(1, "body_slam_damage", false, 1);
        gsap.delayedCall( 7.1, () => {
            playSound( 'whScream', false, 0.5 );

        } );       
    }

    initFightPresentation() {        
        let filterOutline = new PIXI.filters.OutlineFilter( 3, 0xffffff);
        filterOutline.padding = 10;

        this.fightCaptionHorizon = new PIXI.Container();
        this.fightCaptionHorizon.scale.set( 1.2, 1.2 );    
        this.figthScene.addChild( this.fightCaptionHorizon );
        this.fightCaptionHorizon.visible = false;
        this.fightCaptionHorizon.x = 70;
        this.fightCaptionHorizon.y = 160;
        
        this.fightCaptionVertical = new PIXI.Container();
        this.fightCaptionVertical.scale.set( 1.5, 1.5 );    
        this.figthScene.addChild( this.fightCaptionVertical );
        this.fightCaptionVertical.visible = false;
        this.fightCaptionVertical.x = 0;
        this.fightCaptionVertical.y = -600;        

        let fightTextHor1 = new PIXI.Sprite( assets.textures.pixi.fightText1 ); 
        fightTextHor1.anchor.set( 0.5, 0.5 );
        fightTextHor1.x = -215;  
       
        let fightTextHor2 = new PIXI.Sprite( assets.textures.pixi.fightText2 ); 
        fightTextHor2.anchor.set( 0.5, 0.5 );
        fightTextHor2.x = 170;

        let fightIconHor = new PIXI.Sprite( assets.textures.pixi.fightIcon ); 
        fightIconHor.anchor.set( 0.5, 0.5 );
        fightIconHor.x = 0;        
        fightIconHor.scale.set( 0.4, 0.4 );
        fightIconHor.filters = [filterOutline];

        this.fightCaptionHorizon.addChild(  fightTextHor1, fightTextHor2 , fightIconHor );

        let fightTextVer1 = new PIXI.Sprite( assets.textures.pixi.fightText1 ); 
        fightTextVer1.anchor.set( 0.5, 0.5 );
        fightTextVer1.x = 20;  
        fightTextVer1.y = -70;  
       
        let fightTextVer2 = new PIXI.Sprite( assets.textures.pixi.fightText2 ); 
        fightTextVer2.anchor.set( 0.5, 0.5 );
        fightTextVer2.x = 0;

        let fightIconVer = new PIXI.Sprite( assets.textures.pixi.fightIcon ); 
        fightIconVer.anchor.set( 0.5, 0.5 );
        fightIconVer.x = 0;
        fightIconVer.y = 90;        
        fightIconVer.scale.set( 0.4, 0.4 );
        fightIconVer.filters = [filterOutline];

        this.fightCaptionVertical.addChild(  fightTextVer1, fightTextVer2, fightIconVer );
    } 

    initWinText() {
        let filterOutline = new PIXI.filters.OutlineFilter( 3, 0xffffff);
        filterOutline.padding = 10;

        this.winCaption = new PIXI.Container();
        this.winCaption.scale.set( 1.2, 1.2 );    
        this.display.addChild( this.winCaption );
        this.winCaption.visible = false;;      

        let winText = new PIXI.Sprite( assets.textures.pixi.wonCaption ); 
        winText.anchor.set( 0.5, 0.5 );
        winText.x = 0;
        winText.filters = [filterOutline];

        this.winCaption.addChild( winText );
    }

    enter( object ) {
        //console.log('enter from fight screen');
        this.figthScene.visible = true;
        gsap.from( this.fightPresentation, 0.5, {alpha: 0} );
        gsap.from( this.fightCaptionHorizon.scale, 0.5, {x:0, y:0, ease: "back.out"} );
        gsap.from( this.fightCaptionVertical.scale, 0.5, {x:0, y:0, ease: "back.out"} );
        
        this.showFightPresentation();

        switch (object.playerName ) {
            case 'Kenny':
                this.playerCharacters.visible = true;               
                this.playerSpine.skeleton.setSkinByName('Kenny_Omega');
                this.playerSpine.state.setAnimation(0, 'figthidle', true);                
                this.selectedWrestless.playerName = object.playerName;
                break;

            case 'MJF':
                this.playerCharacters.visible = true;
                this.playerSpine.skeleton.setSkinByName('MJF');
                this.playerSpine.state.setAnimation(0, 'figthidle', true);                
                this.selectedWrestless.playerName = object.playerName;               
                break;
        }

        switch (object.enemyName ) {
            case 'Isiah':
                this.enemyCharacters.visible = true;
                this.enemySpine.skeleton.setSkinByName('Isiah_Kassidy');
                this.enemySpine.state.setAnimation(0, 'figthidle', true);                
                break;

            case 'Trent':
                this.enemyCharacters.visible = true;
                this.enemySpine.skeleton.setSkinByName('Trent_Beretta');
                this.enemySpine.state.setAnimation(0, 'figthidle', true);                
                break;
        }
    }

    exit() {
       //console.log('exit from fight screen')
    }
    
    onResize = ({ isPortraite, leftUI, rightUI, upUI, downUI }) => {               
        if (isPortraite) {
            this.background.height = downUI - upUI;
            this.background.width = 1280 * this.background.height/1766;

            this.figthScene.height = downUI - upUI;
            this.figthScene.width = 1280 * this.figthScene.height/1766;

            this.reward.height = 80;
            this.reward.width = 256 * this.reward.height/257;

            this.fightCaptionHorizon.visible = false;
            this.fightCaptionVertical.visible = true;

            this.winCaption.y = -450; 

        } else {            
            this.background.width = rightUI - leftUI;
            this.background.height = 1766 * this.background.width/1280;

            this.figthScene.width = rightUI - leftUI;
            this.figthScene.height = 1766 * this.figthScene.width/1280;

            this.reward.height = 80;
            this.reward.width = 256 * this.reward.height/257;

            this.fightCaptionVertical.visible = false;
            this.fightCaptionHorizon.visible = true;

            this.winCaption.y = -120;
        }
    }
    
    initReward() {
        this.reward = new PIXI.Sprite( assets.textures.pixi.cash ); 
        this.reward.anchor.set( 0.5, 0.5 );
        this.reward.visible = false;
        this.figthScene.addChild( this.reward );
        this.reward.x = 0;
        this.reward.y = 0;
        
        this.rewardText = new PIXI.Sprite( assets.textures.pixi.rewardText ); 
        this.rewardText.anchor.set( 0.5, 0 );
        this.rewardText.scale.set( 0.7, 0.7 );
        this.rewardText.visible = false;
        this.figthScene.addChild( this.rewardText );
        this.rewardText.x = 0;
        this.rewardText.y = this.playerCharacters.y + 70;
        
        this.timeline1 = gsap.timeline({repeat: -1, repeatDelay: 0, paused: true, delay: 0.1});
        this.timeline1.to( this.reward, 0.4, {x: 250, y: this.playerCharacters.y, ease: 'quad.inOut'});
        this.timeline1.to( this.reward.scale, 0.2, {x: 0.5, y: 0.5, repeat: 1, yoyo: true, ease: 'sine.inOut' });	
        this.timeline1.to( this.reward, 0.4, {alpha: 0, ease: 'quad.out'});

        this.timeline2 = gsap.timeline({repeat: -1, repeatDelay: 0, paused: true, delay: 0.1});
        this.timeline2.from( this.rewardText.scale, 0.6, {x: 1, y: 1, repeat: 1, yoyo: true, ease: 'sine.inOut' });	
    }

    showReward() {
        this.reward.visible = true;
        this.rewardText.visible = true;
        gsap.from( this.reward, 0.5, { alpha: 0 });
        gsap.from( this.rewardText, 0.5, { alpha: 0 });
        this.timeline1.play();
        this.timeline2.play();
    }

    hideReward() {        
        this.timeline1.pause(0);
        this.timeline2.pause(0);
        gsap.to( this.reward, 0.5, { alpha: 0 });
    }

    showFightPresentation() {
        playSound( 'countdown', false, 0.5 );
        gsap.from( this.fightCaptionHorizon, 0.65, {alpha: 0, repeat: 5, yoyo: true, ease: "quad.inOut", onComplete: ()=>{
            this.initScenario();
        }
    });
        gsap.from( this.fightCaptionVertical, 0.65, {alpha: 0, repeat: 5, yoyo: true, ease: "quad.inOut"});
    }    

}



