/** ****************************************************
//
// "3D Big Box" by Benjamin Wimmer (V1.0)
//
// More details and latest version available at
// http://bigboxcollection.com/#3DBB
//
******************************************************/

let camera; let scene; let renderer;
let mesh;
const targetCRotation = 0;
let targetRotation = 1.2;
let targetRotationOnMouseDown = 0;
let mouseX = 0;
let mouseXOnMouseDown = 0;
const mouseY = 0;
let mouseYOnMouseDown = 0;
let mouseYOnMouseThreshold = 0;
const zoomDefault = 240;
const zoomMin = 40;
const zoomMax = 600;
let zooming = 0;
let zoomLevel = 1;
let zoomable = 0;
let autoRotate = false;
const fullscreen = 1;
const windowHalfX = window.innerWidth / 3;
const windowHalfY = window.innerHeight / 3;
const byId = function( id ) { return document.getElementById( id ); };

if (init()) {
  animate();
  window.addEventListener( 'resize', onWindowResize, false );
  byId('box').addEventListener( 'mousedown', onDocumentMouseDown, false );
  byId('box').addEventListener( 'touchstart', onDocumentTouchStart, false );
}

function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}
function init() {
  let boxwidth;
  let boxheight;
  let boxdepth;
  let textureFile;
  // let autoRotate;
  let bgcolor;
  let errorMsg = '';
  if (getQueryVariable('w') && getQueryVariable('w') > 0) { boxwidth = getQueryVariable('w'); } else { errorMsg += '<b>Error!</b> No width (w) defined!<br/>'; }
  if (getQueryVariable('h') && getQueryVariable('h') > 0) { boxheight = getQueryVariable('h'); } else { errorMsg += '<b>Error!</b> No height (h) defined!<br/>'; }
  if (getQueryVariable('d') && getQueryVariable('d') > 0) { boxdepth = getQueryVariable('d'); } else { errorMsg += '<b>Error!</b> No depth (d) defined!<br/>'; }
  if (getQueryVariable('t') && getQueryVariable('t') != '') { textureFile = getQueryVariable('t'); } else { errorMsg += '<b>Error!</b> No texture (t) defined!<br/>'; }
  if (getQueryVariable('b') && getQueryVariable('b') != '') { byId('box').style.backgroundColor = '#' + getQueryVariable('b'); } else { errorMsg += '<b>Error!</b> No background color (b) defined!<br/>'; }
  if (getQueryVariable('s') > 0) { zoomLevel = getQueryVariable('s') / 100; } else { errorMsg += '<b>Error!</b> No relative size (s) defined!<br/>'; }
  if (getQueryVariable('z')) { zoomable = getQueryVariable('z'); }
  if (getQueryVariable('f') == 1) { byId('fullscreen').style.display = 'block'; }
  if (getQueryVariable('a') == 1) { autoRotate = true; }
  if (errorMsg != '') {
    document.write('<p style="text-align:center;color:red;">' + errorMsg + '</p>');
    byId('box').style.display = 'none';
    byId('idle').style.display = 'none';
    return false;
  }
  byId('fullscreen').href = document.location.pathname + '?h=' + boxheight + '&w=' + boxwidth + '&d=' + boxdepth + '&b=' + getQueryVariable('b') + '&s=' + (zoomLevel * 100) + '&z=' + zoomable + '&f=0&t=' + textureFile;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 400 * (1 + (1 - zoomLevel));
  camera.position.y = 0;
  camera.position.x = 0;

  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
  directionalLight.position.set(0, 1, 1.0).normalize();
  scene.add(directionalLight);

  const texture = new THREE.TextureLoader().load( textureFile, function() { byId('box').style.opacity = 1; byId('idle').style.opacity = 0;	} );

  const geometry = new THREE.CubeGeometry( boxwidth, boxheight, boxdepth);
  const material = new THREE.MeshBasicMaterial( { map: texture } );

  const left = [ new THREE.Vector2(0, 0), new THREE.Vector2(.1, 0), new THREE.Vector2(.1, 1), new THREE.Vector2(0, 1) ];
  const front = [ new THREE.Vector2(.1, 0), new THREE.Vector2(.5, 0), new THREE.Vector2(.5, 1), new THREE.Vector2(.1, 1) ];
  const right = [ new THREE.Vector2(.5, 0), new THREE.Vector2(.6, 0), new THREE.Vector2(.6, 1), new THREE.Vector2(.5, 1) ];
  const back = [ new THREE.Vector2(.6, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1), new THREE.Vector2(.6, 1) ];
  geometry.faceVertexUvs[0] = [];
  geometry.faceVertexUvs[0][0] = [ right[3], right[0], right[2] ]; // right
  geometry.faceVertexUvs[0][1] = [ right[0], right[1], right[2] ]; // right
  geometry.faceVertexUvs[0][2] = [ left[3], left[0], left[2] ]; // left
  geometry.faceVertexUvs[0][3] = [ left[0], left[1], left[2] ]; // left
  geometry.faceVertexUvs[0][4] = [ front[0], front[0], front[0] ];
  geometry.faceVertexUvs[0][5] = [ front[0], front[0], front[0] ];
  geometry.faceVertexUvs[0][6] = [ front[0], front[0], front[0] ];
  geometry.faceVertexUvs[0][7] = [ front[0], front[0], front[0] ];
  geometry.faceVertexUvs[0][8] = [ front[3], front[0], front[2] ]; // front
  geometry.faceVertexUvs[0][9] = [ front[0], front[1], front[2] ]; // front
  geometry.faceVertexUvs[0][10] = [ back[3], back[0], back[2] ]; // back
  geometry.faceVertexUvs[0][11] = [ back[0], back[1], back[2] ]; // back

  mesh = new THREE.Mesh(geometry, material);

  scene.add( mesh );
  renderer = new THREE.WebGLRenderer({ antialias: true, stencil: true, alpha: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  byId('box').insertBefore(renderer.domElement, byId('box').childNodes[0]);
  window.addEventListener( 'resize', onWindowResize, false );

  // texture.minFilter = THREE.LinearFilter;
  const maxAnisotropy = renderer.getMaxAnisotropy();
  texture.anisotropy = maxAnisotropy;

  mesh.castShadow = true;
  mesh.position.z = -60;
  mesh.overdraw = true;
  mesh.rotation.y = 0;
  mesh.rotation.z = 0;
  targetRotation = -0.45;
  return true;
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
  requestAnimationFrame( animate );
  if (targetRotation !== -1) {
    const oldRotation = mesh.rotation.y;
    mesh.rotation.y -= ( targetRotation + mesh.rotation.y ) * 0.1;
    camera.rotation.y -= (targetCRotation + camera.rotation.y ) * 0.1;
    if (oldRotation == mesh.rotation.y) { targetRotation = -1; }
  }
  if (autoRotate && targetRotation === -1) {
    mesh.rotation.y += 0.001;
  }

  renderer.render( scene, camera );
}


function onDocumentMouseDown( event ) {
  event.preventDefault();
  byId('box').addEventListener( 'mousemove', onDocumentMouseMove, false );
  byId('box').addEventListener( 'mouseup', onDocumentMouseUp, false );
  byId('box').addEventListener( 'mouseout', onDocumentMouseOut, false );
  mouseXOnMouseDown = event.clientX - windowHalfX;
  mouseYOnMouseThreshold = event.clientY;
  targetRotationOnMouseDown = targetRotation;
}
function onDocumentMouseMove( event ) {
  byId('box').style.cursor = '-webkit-grabbing';
  mouseX = event.clientX - windowHalfX;
  targetRotation = targetRotationOnMouseDown - ( mouseX - mouseXOnMouseDown ) * 0.01;

  if (zoomable == 1 && (zooming == 1 || (mouseYOnMouseDown / mouseYOnMouseThreshold < 0.8 || mouseYOnMouseDown / mouseYOnMouseThreshold > 1.2))) {
    zooming = 1;
    if (mouseYOnMouseDown < event.clientY) {
      camera.position.z *= 0.99;
    } else {
      camera.position.z *= 1.01;
    }
    if (camera.position.z < zoomMin) { camera.position.z = zoomMin; }
    if (camera.position.z > zoomMax) { camera.position.z = zoomMax; }
  }
  mouseYOnMouseDown = event.clientY;
}

function onDocumentMouseUp( event ) {
  zooming = 0;
  byId('box').removeEventListener( 'mousemove', onDocumentMouseMove, false );
  byId('box').removeEventListener( 'mouseup', onDocumentMouseUp, false );
  byId('box').removeEventListener( 'mouseout', onDocumentMouseOut, false );
  byId('box').style.cursor = '-webkit-grab';
}
function onDocumentMouseOut( event ) {
  zooming = 0;
  byId('box').removeEventListener( 'mousemove', onDocumentMouseMove, false );
  byId('box').removeEventListener( 'mouseup', onDocumentMouseUp, false );
  byId('box').removeEventListener( 'mouseout', onDocumentMouseOut, false );
  byId('box').style.cursor = '-webkit-grab';
}
function onDocumentTouchStart( event ) {
  event.preventDefault();
  byId('box').addEventListener( 'touchmove', onDocumentTouchMove, false );
  byId('box').addEventListener( 'touchend', onDocumentTouchEnd, false );
  mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
  mouseYOnMouseThreshold = mouseYOnMouseDown = event.touches[0].pageY;
  targetRotationOnMouseDown = targetRotation;
}
function onDocumentTouchMove( event ) {
  event.preventDefault();
  mouseX = event.touches[0].pageX - windowHalfX;
  targetRotation = targetRotationOnMouseDown - ( mouseX - mouseXOnMouseDown ) * 0.02;
  if (zoomable == 1 && (zooming == 1 || (mouseYOnMouseDown / mouseYOnMouseThreshold < 0.8 || mouseYOnMouseDown / mouseYOnMouseThreshold > 1.2))) {
    zooming = 1;
    if (mouseYOnMouseDown < event.touches[0].pageY) {
      camera.position.z *= 0.98;
    } else {
      camera.position.z *= 1.02;
    }
    if (camera.position.z < zoomMin) { camera.position.z = zoomMin; }
    if (camera.position.z > zoomMax) { camera.position.z = zoomMax; }
  }
  mouseYOnMouseDown = event.touches[0].pageY;
}
function onDocumentTouchEnd( event ) {
  zooming = 0;
  byId('box').removeEventListener( 'touchmove', onDocumentTouchMove, false );
  byId('box').removeEventListener( 'touchend', onDocumentTouchEnd, false );
}


