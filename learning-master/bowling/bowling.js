var BABYLON;
(function (BABYLON) {
    var Bowling = /** @class */ (function () {
        /**
         * Constructor.
         * @param _canvas the canvas where to draw the scene
         */
        function Bowling(_canvas) {
            this._canvas = _canvas;
            this.cylindre = [];
            this._init();
            this._initGeometries();
            this._initPhysics();
            this._initInteractions();
        }
        /**
         * Runs the interactions game.
         */
        Bowling.prototype.run = function () {
            var _this = this;
            this.engine.runRenderLoop(function () {
                _this.scene.render();
            });
        };
        /**
         * Inits the interactions.
         */
        Bowling.prototype._init = function () {
            this.engine = new BABYLON.Engine(this._canvas);
            this.scene = new BABYLON.Scene(this.engine);
            this.camera = new BABYLON.FreeCamera('freeCamera', new BABYLON.Vector3(62, 10, 200), this.scene);
            this.camera.attachControl(this._canvas);
        };
        Bowling.prototype._initGeometries = function () {
            //Create texture for ground
            var groundTexture = new BABYLON.StandardMaterial('groundTexture', this.scene);
            groundTexture.diffuseTexture = new BABYLON.Texture('../assets/Lava.jpg', this.scene);
            //Create ground and affect texture
            this.ground = BABYLON.Mesh.CreateGround('ground', 512, 512, 1, this.scene);
            this.ground.isPickable = true;
            this.ground.material = groundTexture;
            //Create boule
            this.boule = BABYLON.Mesh.CreateSphere("boule", 10, 10, this.scene);
            this.boule.position.y = 5;
            this.boule.position.x = 50;
            this.boule.position.z = 100;
            //Create texture for cylindre
            var cylindreTexture = new BABYLON.StandardMaterial('cylindreTexture', this.scene);
            cylindreTexture.diffuseTexture = new BABYLON.Texture('../assets/Quille.png', this.scene);
            //Create lighting
            new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
            for (var i = 1; i < 10; i++) {
                //Create cylindre with different x position
                var cylindre = BABYLON.Mesh.CreateCylinder('cylindre', 10, 5, 5, 5, 5, this.scene);
                cylindre.position.y = 5;
                cylindre.position.x = i * 5;
                cylindre.material = cylindreTexture;
                this.cylindre.push(cylindre);
                //Create cylindre with same x position and higther y position
                for (var y = 1; y < 10; y++) {
                    var cylindre_1 = BABYLON.Mesh.CreateCylinder('cylindre', 10, 5, 5, 5, 5, this.scene);
                    cylindre_1.position.y = 5 + y * 10;
                    cylindre_1.position.x = i * 5;
                    cylindre_1.material = cylindreTexture;
                    this.cylindre.push(cylindre_1);
                }
            }
            //Set camera position
            this.camera.setTarget(this.boule.position);
            //Create skyfall
            var skybox = BABYLON.Mesh.CreateSphere('skybox', 32, 1000, this.scene);
            //Set options for the skyfall
            var skyboxMaterial = new BABYLON.StandardMaterial('skybox', this.scene);
            skyboxMaterial.disableLighting = true;
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('../assets/skybox2', this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            //Affect options to skyFall
            skybox.material = skyboxMaterial;
            skybox.infiniteDistance = true;
        };
        Bowling.prototype._initPhysics = function () {
            this.scene.enablePhysics(new BABYLON.Vector3(0, -500.0, 0), new BABYLON.CannonJSPlugin());
            this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.BoxImpostor, {
                mass: 0
            });
            this.boule.physicsImpostor = new BABYLON.PhysicsImpostor(this.boule, BABYLON.PhysicsImpostor.SphereImpostor, {
                mass: 1
            });
        };
        Bowling.prototype._initInteractions = function () {
            var _this = this;
            this.scene.onPointerObservable.add(function (data) {
                if (data.type !== BABYLON.PointerEventTypes.POINTERUP)
                    return;
                if (data.pickInfo.pickedMesh === _this.boule) {
                    _this.cylindre.forEach(function (element) {
                        element.physicsImpostor = new BABYLON.PhysicsImpostor(element, BABYLON.PhysicsImpostor.CylinderImpostor, {
                            mass: 0.5
                        });
                    });
                    _this.boule.applyImpulse(data.pickInfo.ray.direction.multiplyByFloats(700, 700, 700), data.pickInfo.pickedPoint);
                }
            });
        };
        return Bowling;
    }());
    BABYLON.Bowling = Bowling;
})(BABYLON || (BABYLON = {}));
//# sourceMappingURL=bowling.js.map