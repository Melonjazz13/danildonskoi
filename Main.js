let app = new PIXI.Application({
    backgroundColor: 0xcccccc,
    antialias: true,
    resizeTo: window
});
document.body.appendChild(app.view);

PIXI.Assets.load("./assets/Medium_Man.json").then((resource) => {
	console.log( resource.spineData );   
    
    let animation = new PIXI.spine.Spine( resource.spineData );
    app.stage.addChild(animation);
    
    animation.scale.set(0.1);
    animation.position.set(500, 500);
    
    console.log(animation);       
    animation.state.setAnimation(0, 'block_arm', true);

    animation.skeleton.setSkin(null);
    animation.skeleton.setSkinByName('Bryan_Danielson');

    // dont run too fast
    // animation.state.timeScale = 0.1;
    // update yourself
    // animation.autoUpdate = true;
});