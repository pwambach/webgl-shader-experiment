// set the scene size

(function(window){

	var $container = $('#container');

	var WIDTH = $(document).width(),
	    HEIGHT = $(document).height();

	// set some camera attributes
	var VIEW_ANGLE = 45,
	    ASPECT = WIDTH / HEIGHT,
	    NEAR = 0.1,
	    FAR = 10000;

	var raycaster = new THREE.Raycaster();





	// WebGL Renderer
	var renderer = new THREE.WebGLRenderer({antialias: true });
	renderer.setClearColor(0xffffff, 1);
	renderer.setSize(WIDTH, HEIGHT);

	// Scene
	var scene = new THREE.Scene();

	
	

	// Camera
	var perspectiveCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	perspectiveCamera.position.z = 100;
	perspectiveCamera.position.x = 100;
	perspectiveCamera.position.y = 100;
	perspectiveCamera.lookAt(new THREE.Vector3(0,0,0));
	scene.add(perspectiveCamera);
/*	var cameraHelper = new THREE.CameraHelper(camera);
	scene.add(cameraHelper);*/

	// Controls
	var controls = new THREE.OrbitControls(perspectiveCamera);
	controls.noKeys = true;


	var getIntersectFromMouse = function(event, object) {
        var x = event.clientX || event.originalEvent.targetTouches[0].clientX;
        var y = event.clientY || event.originalEvent.targetTouches[0].clientY;
        mouse = new THREE.Vector2();
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, perspectiveCamera);
        return raycaster.intersectObject(object);
    };



	var attributes = {
	  index: {
	    type: 'f', // a float
	    value: [] // an empty array
	  }
	};

	var uniforms = {
	  time: {
	    type: 'f', // a float
	    value: 0
	  },
	  mouseX: {
	  	type: 'f',
	  	value: 0
	  },
	  mouseY: {
	  	type: 'f',
	  	value: 0
	  }
	};



	var vShader = $('#vertexshader');
	var fShader = $('#fragmentshader');

	// create the material and now
	// include the attributes property
	var shaderMaterial =
	  new THREE.ShaderMaterial({
	  	wireframe: true,
	    attributes: attributes,
	    uniforms: uniforms,
	    vertexShader: vShader.text(),
	    fragmentShader: fShader.text()
	  });

	// now populate the array of attributes
	// var verts =
	//   sphere.geometry.vertices;

	// var values =
	//   attributes.displacement.value;

	// for (var v = 0; v < verts.length; v++) {
	//   values.push(Math.random() * 30);
	// }


	var geometry = new THREE.PlaneGeometry( 100, 100, 50, 50);
	var plane = new THREE.Mesh( geometry, shaderMaterial );
	scene.add(plane);


	geometry.vertices.forEach(function(vertex,index){
		attributes.index.value.push(index);
	});

	var mouseMoveHandler = function(event) {
        var intersects = getIntersectFromMouse(event, plane);
        if(intersects.length){
        	uniforms.mouseX.value = intersects[0].point.x;
        	uniforms.mouseY.value = intersects[0].point.y;
        }
    };

    $('#container').on('mousemove', mouseMoveHandler);


	// Render loop
	function render() {
		uniforms.time.value++;	
	    renderer.render(scene, perspectiveCamera);
        requestAnimationFrame(render);
	}
	$container.append(renderer.domElement); 
	render();


})(this);






