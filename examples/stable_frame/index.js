import "../../dist/web_face_status.js";

(async () => {
  const fps = 25;
  const distThreshold = 5;
  const nStableFrames = 100;
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const text = document.getElementById("text");
  const ctx = canvas.getContext("2d");

  const options = { checkFaceMinSize: 0.2, checkFaceMaxSize: 0.5 };
  const detector = new mt.FaceDetector(options);
  await detector.initialize();

  function getCenterPt(face) {
    const x = (face.box.xMin + face.box.xMax) / 2;
    const y = (face.box.yMin + face.box.yMax) / 2;
    return { x, y };
  }

  function getDist(pt1, pt2) {
    return Math.sqrt((pt1.x - pt2.x) ** 2 + (pt1.y - pt2.y) ** 2);
  }

  function drawFace(face) {
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "blue";
    ctx.rect(
      face.box.xMin,
      face.box.yMin,
      face.box.xMax - face.box.xMin,
      face.box.yMax - face.box.yMin
    );
    ctx.stroke();
    ctx.fillStyle = "red";
    face.landmarks.forEach((pt) => {
      ctx.fillRect(pt.x, pt.y, 5, 5);
    });
  }

  try {
    const constraints = { video: true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
  } catch (error) {
    console.error(error);
  }

  video.addEventListener("loadeddata", async () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let centroid = { x: 0, y: 0, count: 0 };
    setInterval(async () => {
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const { status, face } = await detector.run(video);
        text.innerHTML = status.text;

        if (status != mt.FaceStatus.OK || face == null) {
          centroid = { x: 0, y: 0, count: 0 };
          return;
        }

        const pt = getCenterPt(face);
        centroid.x += (pt.x - centroid.x) / (centroid.count + 1);
        centroid.y += (pt.y - centroid.y) / (centroid.count + 1);

        if (getDist(pt, centroid) > distThreshold) {
          centroid = { x: 0, y: 0, count: 0 };
          return;
        }

        centroid.count++;
        text.innerHTML = text.innerHTML + " (" + centroid.count+ ")";

        if (centroid.count > nStableFrames) {
          drawFace(face);
        }
      } catch (error) {
        console.log(error);
      }
    }, 1 / fps);
  });
})();
