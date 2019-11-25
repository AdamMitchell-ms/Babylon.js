type XRSessionMode =
    | "inline"
    | "immersive-vr"
    | "immersive-ar";

type XRReferenceSpaceType =
    | "viewer"
    | "local"
    | "local-floor"
    | "bounded-floor"
    | "unbounded";

type XREnvironmentBlendMode =
    | "opaque"
    | "additive"
    | "alpha-blend";

type XRVisibilityState =
    | "visible"
    | "visible-blurred"
    | "hidden";

type XRHandedness =
    | "none"
    | "left"
    | "right";

type XRTargetRayMode =
    | "gaze"
    | "tracked-pointer"
    | "screen";

type XREye =
    | "none"
    | "left"
    | "right";

interface XRSpace extends EventTarget {

}

interface XRRenderState {
    depthNear?: number;
    depthFar?: number;
    inlineVerticalFieldOfView?: number;
    baseLayer?: XRWebGLLayer;
}

interface XRInputSource {
    handedness: XRHandedness;
    targetRayMode: XRTargetRayMode;
    targetRaySpace: XRSpace;
    gripSpace: XRSpace | undefined;
    gamepad: Gamepad | undefined;
    profiles: Array<string>;
}

//interface XRPoint {
//    x: number;
//    y: number;
//    z: number;
//}
//
//interface XRPlane {
//    planeSpace: XRSpace;
//    polygon: Array<XRPoint>;
//}
//
////TODO: I made up this type name
//interface XRPlaneDetectionState {
//    enabled: boolean;
//}
//
////TODO: I made up this type name
//interface XRWorldTrackingState {
//    planeDetectionState : XRPlaneDetectionState;
//}
//
////TODO: I made up this type name
//interface XRWorldInformation {
//    detectedPlanes: Array<XRPlane>;
//}

// https://github.com/immersive-web/hit-test/blob/master/hit-testing-explainer.md#appendix-a-proposed-partial-idl
interface XRHitTestSource {
    cancel(): void;
}

type XRHitTestTrackableType =
    | "plane"
    | "point";

interface XRRay {
    origin: DOMPointReadOnly;
    direction: DOMPointReadOnly;
    matrix: Float32Array;
}

interface XRHitTestOptionsInit {
    space: XRSpace;
    entityTypes?: Array<XRHitTestEntitXRHitTestTrackableTypeyType>;
    offsetRay?: XRRay
}

interface XRHitTestResult {
    getPose(baseSpace: XRSpace): XRPose | undefined;
}

interface XRSession {
    addEventListener: Function;
    requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace> | undefined;
    updateRenderState(XRRenderStateInit: XRRenderState): Promise<void>;
    //updateWorldTrackingState(trackingState: XRWorldTrackingState): void;
    requestHitTestSource(options: XRHitTestOptionsInit): Promise<XRHitTestSource>;
    requestAnimationFrame: Function;
    end(): Promise<void>;
    renderState: XRRenderState;
    inputSources: Array<XRInputSource>;

}

interface XRReferenceSpace extends XRSpace {
    getOffsetReferenceSpace(originOffset: XRRigidTransform): XRReferenceSpace;
    onreset: any;
}

interface XRFrame {
    session: XRSession;
    getViewerPose(referenceSpace: XRReferenceSpace): XRViewerPose | undefined;
    getPose(space: XRSpace, baseSpace: XRSpace): XRPose | undefined;
    getHitTestResults(hitTestSource: XRHitTestSource): Array<XRHitTestResult> | undefined;
    //worldInformation: XRWorldInformation;
}

interface XRViewerPose extends XRPose {
    views: Array<XRView>;
}

interface XRPose {
    transform: XRRigidTransform;
    emulatedPosition: boolean;
}

interface XRWebGLLayerOptions {
    antialias ?: boolean;
    depth ?: boolean;
    stencil ?: boolean;
    alpha ?: boolean;
    multiview ?: boolean;
    framebufferScaleFactor ?: number;
}

declare var XRWebGLLayer: {
    prototype: XRWebGLLayer;
    new(session: XRSession, context: WebGLRenderingContext | undefined, options?: XRWebGLLayerOptions): XRWebGLLayer;
};
interface XRWebGLLayer {
    framebuffer: WebGLFramebuffer;
    framebufferWidth: number;
    framebufferHeight: number;
    getViewport: Function;
}

interface XRRigidTransform {
    position: DOMPointReadOnly;
    orientation: DOMPointReadOnly;
    matrix: Float32Array;
    inverse: XRRigidTransform;
}

interface XRView {
    eye: XREye;
    projectionMatrix: Float32Array;
    transform: XRRigidTransform;
}

interface XRInputSourceChangeEvent {
    session: XRSession;
    removed: Array<XRInputSource>;
    added: Array<XRInputSource>;
}