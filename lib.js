const showWebcamStream = (videoElement) => {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
      .then(function (stream) {
        videoElement.srcObject = stream;
      })
      .catch(function (err) {
        console.log("Something went wrong!", err);
      });
  }
}

const takePicture = (videoElement, canvasElement) => {
  // This is a side effect
  canvasElement.getContext('2d').drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

  return canvasElement.toDataURL('image/jpeg')
}

const createTakePictureHandler = (canvasElements, onSecondPicture) => {
  let counter = 0;
  const images = Array(canvasElements.length).fill(null);

  return () => {
    const idx = counter % 2;
    const canvas = canvasElements[idx];

    images[idx] = takePicture(video, canvas);
    counter++;

    if (images.every(i => i)) {
      onSecondPicture(images);
    }
  }
}

const diffImages = (image1, image2, callback) => {
  resemble.outputSettings({useCrossOrigin: false});
  resemble(image1)
    .compareTo(image2)
    .ignoreColors()
    .onComplete((data) => {
      callback(data);
    })
}

const handleComparedImages = (images) => {
  diffImages(images[0], images[1], (data) => {
    const image = document.querySelector('#diffImage');

    image.src = data.getImageDataUrl();

    if(data.rawMisMatchPercentage > 10) {
      image.classList.add('highlight');
    } else {
      image.classList.remove('highlight');
    }
    console.log(data);
  });
}

