const startButton = document.querySelector("#start");

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

  videos.forEach((video, index) => {
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
