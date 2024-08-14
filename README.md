# web-face-status

A face detection module for the browser that finds the best face and status using [get-face-status](https://github.com/Melon-Technologies/get-face-status)

## Installation

| Method           | Install                                           | Import                                                                                    |
| ---------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| CDN (html)       | N/A                                               | `<script src="https://cdn.jsdelivr.net/npm/@melon-technologies/web-face-status"</script>` |
| CDN (module)     | N/A                                               | `import "https://cdn.jsdelivr.net/npm/@melon-technologies/web-face-status";`              |
| npm              | `npm install @melon-technologies/web-face-status` | `import * as mt from "@melon-technologies/web-face-status";`                           |
| source           | `npm install && npm run build`                    | `import "./dist/web_face_status.js";`                                                     |

## Usage

```
const video = document.getElementById("video");
const options = { checkFaceMinSize: 0.3, checkFaceMaxSize: 0.4 };
const detector = new mt.FaceDetector(options);
await detector.initialize();

...

// Camera loop
{
    const { status, face } = await detector.run(video);

    ...
}
```

See [examples/](examples/) for a full working example using the webcam

## More Information

For more details, refer to the get-face-status [project wiki](https://github.com/Melon-Technologies/get-face-status/wiki).