import "../../dist/web_face_status.js";

(async () => {
  const fps = 25;
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const text = document.getElementById("text");
  const ctx = canvas.getContext("2d");

  const options = { checkFaceMinSize: 0.3, checkFaceMaxSize: 0.4 };
  const detector = new mt.FaceDetector(options);
  await detector.initialize();

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
    setInterval(async () => {
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const { status, face } = await detector.run(video);
        text.innerHTML = status.text;

        if (status != mt.FaceStatus.OK || face == null) {
          return;
        }

        drawFace(face);
      } catch (error) {
        console.log(error);
      }
    }, 1 / fps);
  });
})();
