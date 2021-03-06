// Establish render related global variables.
var scene, camera, renderer, controls, datGUI;

// Establish growth related global variables
var lsystem, turtle, rules, properties;
var lightHelper;
var guiproperties = { hue: 0, dhue: 0, rotation: Math.PI/2, iterations: 3 };
var afolder, lfolder;

var treeparts;

var init = function() {
	// Initialize growth variables
	lsystem = new LSystem('', '', '{}', {});

	
	configureGUI();
	// Initialize render variables
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	// Add lighting
	var spotLight = new THREE.SpotLight( 0xFFFFFF, 1);
	spotLight.position.set(105, 500, 35);
	spotLight.castShadow = true;
	spotLight.angle = Math.PI / 4;
	spotLight.penumbra = 0.05;
	spotLight.decay = 0;
	spotLight.distance = 200;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 1;
	spotLight.shadow.camera.far = 200;
	scene.add(spotLight);
	
	lightHelper = new THREE.SpotLightHelper(spotLight);
	//scene.add(lightHelper);

	// Add controls
	controls = new THREE.OrbitControls(camera);
	controls.addEventListener('change', render);

	camera.position.set(0, 0, 200);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	// Add floor
	var loader = new THREE.TextureLoader();
	var floorTexture = new loader.load('img/tile.jpg');
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set(10, 10);
	var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide});
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.receiveShadow = true;
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	runSystem();

	
};

var animate = function() {
	controls.update();
	requestAnimationFrame(animate);
};

var render = function() {
	lightHelper.update();
    renderer.render(scene, camera);
};

var configureGUI = function() {
	gui = new dat.GUI({ load: getExamples(), preset: 'Tree' });
	gui.remember(lsystem.properties);
	gui.remember(lsystem);
	//gui.remember(turtle.dTheta);
	gui.remember(guiproperties);

	// LSystem folder containing variables pertinent to the construction of the system
	lfolder = gui.addFolder('LSystem');
	lfolder.add(lsystem, 'axiom').onFinishChange(function(){runSystem();});
	lfolder.add(lsystem, 'constants');
	lfolder.add(lsystem, 'rules').onFinishChange(function(){runSystem();});
	//lfolder.add(lsystem.properties, 'angle', 0, 180);
	
	// Appearance folder containing variables pertinent to the user experience
	afolder = gui.addFolder('Appearance');
	// afolder.add(guiproperties, 'dhue', 0, 100);
	afolder.add(guiproperties, 'iterations', 0, 16).step(1).onFinishChange(function(){runSystem();});
	afolder.add(guiproperties, 'rotation', 0, 360).onFinishChange(function(){runSystem();});
};

// Initialize our program and begin animation.
init();
animate();