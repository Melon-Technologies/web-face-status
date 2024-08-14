import "@mediapipe/face_detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as faceDetection from "@tensorflow-models/face-detection";
import * as mt from "@melon-technologies/get-face-status";

export class FaceDetector {
  constructor(options = {}) {
    this.options = { ...options, ...{ detectorType: "mediapipe" } };
    this.detector = null;
  }

  async initialize() {
    const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
    const detectorConfig = {
      runtime: "mediapipe",
      maxFaces: 1,
      modelType: "short",
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection",
    };
    this.detector = await faceDetection.createDetector(model, detectorConfig);
  }

  async run(video, flip = false) {
    const estimationConfig = { flipHorizontal: flip };
    const faces = await this.detector.estimateFaces(video, estimationConfig);
    const shape = { width: video.videoWidth, height: video.videoHeight };
    return mt.getFaceStatus(faces, shape, this.options);
  }
}

if (typeof window !== "undefined") {
  window.mt = {
    FaceDetector: FaceDetector,
    FaceStatus: mt.FaceStatus,
  };
}
