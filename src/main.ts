import "./style.css";

import {
  WebGLRenderer as ThreeRenderer,
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  TextureLoader,
  LinearFilter,
  SRGBColorSpace,
  ClampToEdgeWrapping,
} from "three";

import {
  Container,
  Graphics,
  WebGLRenderer as PixiRenderer,
  Ticker,
} from "pixi.js";

(async () => {
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  // three.js
  const three = new ThreeRenderer({
    antialias: true,
    stencil: true, // so masks work in pixijs
  });

  three.setSize(WIDTH, HEIGHT);
  three.setClearColor(0xdddddd, 1);
  document.body.appendChild(three.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(70, WIDTH / HEIGHT);
  camera.position.z = 50;
  scene.add(camera);

  const cubeGeom = new BoxGeometry(10, 10, 10);
  const cubeMat = new MeshBasicMaterial({ color: 0x95a4e2 });
  const cube = new Mesh(cubeGeom, cubeMat);

  const edgesGeometry = new EdgesGeometry(cube.geometry);
  const edgesMaterial = new LineBasicMaterial({
    color: 0x546ac1,
  });
  const cubeEdges = new LineSegments(edgesGeometry, edgesMaterial);
  cube.add(cubeEdges);
  scene.add(cube);

  const loader = new TextureLoader();
  loader.load("/assets/sofia-logo.svg", (texture) => {
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;
    texture.magFilter = LinearFilter;
    texture.wrapS = texture.wrapT = ClampToEdgeWrapping;

    const logoMat = new MeshBasicMaterial({
      map: texture,
      transparent: true,
    });

    const logoGeom = new BoxGeometry(10.01, 10.01, 10.01);
    const logoCube = new Mesh(logoGeom, logoMat);
    cube.add(logoCube);
  });

  const pixi = new PixiRenderer();
  await pixi.init({
    context: three.getContext() as WebGL2RenderingContext,
    width: WIDTH,
    height: HEIGHT,
    clearBeforeRender: false,
  });
  const stage = new Container();
  const ui = new Graphics()
    .roundRect(20, 80, 100, 100, 5)
    .roundRect(220, 80, 100, 100, 5)
    .fill(0x5bcc81);
  stage.addChild(ui);

  const ticker = new Ticker();
  ticker.add((t) => {
    const dt = t.deltaTime / t.FPS;

    cube.rotation.x += 0.7 * dt;
    cube.rotation.y += 1.2 * dt;

    // render
    three.resetState();
    three.render(scene, camera);

    pixi.resetState();
    pixi.render({ container: stage });
  });

  ticker.start();
})();
