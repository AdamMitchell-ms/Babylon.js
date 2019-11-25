import { Scene } from "../scene";
import { Engine, Mesh, StandardMaterial, DirectionalLight, Vector3, ArcRotateCamera, Color3, ShadowGenerator, WebXRState } from '..';

export class SceneCreator {
    async create(engine: Engine, canvas: HTMLElement): Promise<Scene> {
        var scene = new Scene(engine);

        // Create simple sphere
        var sphere = Mesh.CreateIcoSphere("sphere", {radius:0.2, flat:true, subdivisions: 1}, scene);
        sphere.position.y = 1;
        sphere.material = new StandardMaterial("sphere material",scene)
    
        // Lights and camera
        var light = new DirectionalLight("light", new Vector3(0, -0.5, 1.0), scene);
        light.position = new Vector3(0, 5, -2);
        var camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 3, new Vector3(0, 1, 0), scene);
        camera.attachControl(canvas, true);
        //if (scene.activeCamera) {
        //    scene.activeCamera.beta += 0.8;
        //}
    
        // Default Environment
        var environment = scene.createDefaultEnvironment({ enableGroundShadow: true });
        if (environment) {
            environment.setMainColor(Color3.FromHexString("#74b9ff"))
            if (environment.ground) {
                environment.ground.position.y = 0
                if (environment.ground.parent) {
                    //environment.ground.parent.position.y = 0;
                }
            }
        }
        
        // Shadows
        var shadowGenerator = new ShadowGenerator(1024, light);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 32;
        shadowGenerator.addShadowCaster(sphere, true);
    
        let xrSessionMode: XRSessionMode = "immersive-ar";
    
        if (environment && environment.ground && environment.skybox) {
            // Enable XR
            var xr = await scene.createDefaultXRExperienceAsync({sessionMode: xrSessionMode, floorMeshes: [environment.ground], backgroundMeshes: [environment.ground, environment.skybox]})
            xr.baseExperience.onStateChangedObservable.add((state)=>{
                if(state === WebXRState.IN_XR){
                    // When entering webXR, position the user's feet at 0,0,-1
                    xr.baseExperience.setPositionOfCameraUsingContainer(new Vector3(0,xr.baseExperience.camera.position.y,-1))
                }
            })

            let sessionManager = xr.baseExperience.sessionManager;
            let session =  sessionManager.session;
            
            let viewerSpace = await session.requestReferenceSpace("viewer");
            let localSpace = await session.requestReferenceSpace("local");
            if (viewerSpace) {
                let hitTestSource = await session.requestHitTestSource({ space: viewerSpace});

                //xr.baseExperience.
                sessionManager.onXRFrameObservable.add(() => {
                    if (sessionManager.currentFrame) {
                        let hitResults = sessionManager.currentFrame.getHitTestResults(hitTestSource);
                        if (hitResults) {
                            hitResults.forEach((hit) => {
                                if (localSpace) {
                                    let pose = hit.getPose(localSpace);
                                    if (pose) {
                                        sphere.position.x = pose.transform.position.x;
                                        sphere.position.y = pose.transform.position.y;
                                        sphere.position.z = pose.transform.position.z;
                                    }
                                }
                            })
                        }
                    }
                });
            }
        }
    
        // Runs every frame to rotate the sphere
        scene.onBeforeRenderObservable.add(()=>{
            //sphere.rotation.y += 0.0001*scene.getEngine().getDeltaTime();
            //sphere.rotation.x += 0.0001*scene.getEngine().getDeltaTime();
        })
    
        return scene;
        }
}

