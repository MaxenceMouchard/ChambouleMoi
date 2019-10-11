module BABYLON {
    export interface IBowling {
        run(): void;
    }

    export class Bowling implements IBowling {
        public engine: Engine;
        public scene: Scene;
        public camera: FreeCamera;
        public ground: Mesh;
        public cylindre: Mesh[] = [];
        public boule: Mesh;

        /**
         * Constructor.
         * @param _canvas the canvas where to draw the scene
         */
        public constructor(private _canvas: HTMLCanvasElement) {
            this._init();
            this._initGeometries();
            this._initPhysics();
            this._initInteractions();
        }

        /**
         * Runs the interactions game.
         */
        public run(): void {
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        }

        /**
         * Inits the interactions.
         */
        private _init(): void {
            this.engine = new Engine(this._canvas);
            this.scene = new Scene(this.engine);
            this.camera = new FreeCamera('freeCamera', new Vector3(62, 10, 200), this.scene);
            this.camera.attachControl(this._canvas);
        }

        private _initGeometries(): void {
            //Create texture for ground
            const groundTexture = new StandardMaterial('groundTexture', this.scene);
            groundTexture.diffuseTexture = new Texture('../assets/Lava.jpg', this.scene); 

            //Create ground and affect texture
            this.ground = Mesh.CreateGround('ground', 512, 512, 1, this.scene);
            this.ground.isPickable = true;
            this.ground.material = groundTexture;

            //Create boule
            this.boule = Mesh.CreateSphere("boule", 10, 10, this.scene);
            this.boule.position.y = 5;
            this.boule.position.x = 50;
            this.boule.position.z = 100;

            //Create texture for cylindre
            const cylindreTexture = new StandardMaterial('cylindreTexture', this.scene);
            cylindreTexture.diffuseTexture = new Texture('../assets/Quille.png', this.scene);

            //Create lighting
            new BABYLON.HemisphericLight("light", new Vector3(0, 1, 0), this.scene);

            for(var i=1; i<10; i++) {
                //Create cylindre with different x position
                const cylindre = Mesh.CreateCylinder('cylindre', 10, 5, 5, 5, 5, this.scene);
                cylindre.position.y = 5;
                cylindre.position.x = i * 5;
                cylindre.material = cylindreTexture;
                this.cylindre.push(cylindre);
                
                //Create cylindre with same x position and higther y position
                for(var y=1; y<10; y++) {
                    const cylindre = Mesh.CreateCylinder('cylindre', 10, 5, 5, 5, 5, this.scene);
                    cylindre.position.y = 5 + y * 10;
                    cylindre.position.x = i * 5;
                    cylindre.material = cylindreTexture;
                    this.cylindre.push(cylindre);
                }
            }
            
            //Set camera position
            this.camera.setTarget(this.boule.position);

            //Create skyfall
            const skybox = Mesh.CreateSphere('skybox', 32, 1000, this.scene);

            //Set options for the skyfall
            const skyboxMaterial = new StandardMaterial('skybox', this.scene);
            skyboxMaterial.disableLighting = true;
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new CubeTexture('../assets/skybox2', this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;

            //Affect options to skyFall
            skybox.material = skyboxMaterial;
            skybox.infiniteDistance = true;
        }

        private _initPhysics(): void {
            this.scene.enablePhysics(new Vector3(0, -500.0, 0), new CannonJSPlugin());

            this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, {
                mass: 0
            });

            this.boule.physicsImpostor = new PhysicsImpostor(this.boule, PhysicsImpostor.SphereImpostor, {
                mass: 1
            });
        }

        private _initInteractions(): void {
            this.scene.onPointerObservable.add((data) => {
                if (data.type !== PointerEventTypes.POINTERUP)
                    return;
                if (data.pickInfo.pickedMesh === this.boule) {
                    this.cylindre.forEach(function(element) {
                        element.physicsImpostor = new PhysicsImpostor(element, PhysicsImpostor.CylinderImpostor, {
                            mass: 1
                        });
                    });
                    this.boule.applyImpulse(data.pickInfo.ray.direction.multiplyByFloats(500, 500, 500), data.pickInfo.pickedPoint);
                }
            });
        }
    }
}
