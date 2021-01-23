const startButton = document.querySelector("#start");
const recordButton = document.querySelector("#record");
const stopButton = document.querySelector("#stop");

startButton.addEventListener("click", () => {
  startCameras();
});

async function startCameras() {
  await navigator.mediaDevices.getUserMedia({ video: true });
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videos = devices.filter((device) => {
    return device.kind === "videoinput";
  });

  document.querySelector("#cameras").innerHTML = `${videos
    .map((video, index) => {
      return `<div>
          <video style="width: 100%;" id="video${index}"></video>
        </div>`;
    })
    .join("")}`;

  videos.slice(0, 1).forEach((video, index) => {
    navigator.mediaDevices
      .getUserMedia({ video: { deviceId: video.deviceId } })
      .then(function (mediaStream) {
        let videoElement: HTMLVideoElement = document.querySelector(
          "#video" + index
        );
        videoElement.setAttribute("playsinline", "true");
        videoElement.srcObject = mediaStream;
        videoElement.onloadedmetadata = function (e) {
          videoElement.play();
        };
        let chunks = [];
        let type = "";
        const mediaRecorder = new MediaRecorder(mediaStream);
        recordButton.addEventListener("click", () => {
          console.log("recording");
          mediaRecorder.start();
        });
        stopButton.addEventListener("click", () => {
          console.log("stoping");
          mediaRecorder.stop();
        });
        mediaRecorder.ondataavailable = function (e) {
          console.log(e);
          chunks.push(e.data);
          let video = document.createElement("video");
          document.querySelector("#playback").appendChild(video);
          var blob = new Blob(chunks);
          const videoUrl = URL.createObjectURL(blob);
          video.src = videoUrl;
          video.onloadedmetadata = function (e) {
            video.play();
          };
        };

        document.querySelector("#devices").innerHTML = JSON.stringify(
          devices,
          null,
          2
        );
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
        alert(err);
      });
  });

  setTimeout(() => {
    var supportedConstraints = navigator.mediaDevices.getSupportedConstraints();

    document.querySelector("#constraints").innerHTML = JSON.stringify(
      supportedConstraints,
      null,
      2
    );
  }, 2000);
}
