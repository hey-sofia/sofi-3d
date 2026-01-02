import "./style.css";

import {
  WebGLRenderer as threeWebGLRenderer,
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from "three";

import {
  Container,
  Graphics,
  WebGLRenderer as pixiWebGLRenderer,
  Ticker,
} from "pixi.js";

(async () => {
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  const threeRenderer = new threeWebGLRenderer({
    antialias: true,
    stencil: true, // so masks work in pixijs
  });

  threeRenderer.setSize(WIDTH, HEIGHT);
  threeRenderer.setClearColor(0xdddddd, 1);
  document.body.appendChild(threeRenderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(70, WIDTH / HEIGHT);
  camera.position.z = 50;
  scene.add(camera);

  const boxGeometry = new BoxGeometry(10, 10, 10);
  const basicMaterial = new MeshBasicMaterial({ color: 0x0095dd });
  const cube = new Mesh(boxGeometry, basicMaterial);
  cube.rotation.set(0.4, 0.2, 0);
  scene.add(cube);

  const pixiRenderer = new pixiWebGLRenderer();
  await pixiRenderer.init({
    context: threeRenderer.getContext() as WebGL2RenderingContext,
    width: WIDTH,
    height: HEIGHT,
    clearBeforeRender: false,
  });
  const stage = new Container();
  const ui = new Graphics()
    .roundRect(20, 80, 100, 100, 5)
    .roundRect(220, 80, 100, 100, 5)
    .fill(0xffff00);
  stage.addChild(ui);

  function render() {
    threeRenderer.resetState();
    threeRenderer.render(scene, camera);

    pixiRenderer.resetState();
    pixiRenderer.render({ container: stage });
  }

  const ticker = new Ticker();
  ticker.add((t) => {
    const x = cube.rotation.x;
    const y = cube.rotation.y;
    const z = cube.rotation.z;

    const newX = Math.min((x * 1.05) % 10);
    const newY = Math.min((y * 1.05) % 10);
    const newZ = Math.min((z * 1.05) % 10);
    cube.rotation.set(newX, newY, newZ);
    render();
  });

  ticker.start();
})();
