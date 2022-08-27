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

const getVideoElement = () => {
  return document.querySelector('#videoElement');
}

const createCanvas = ({ width, height }) => {
  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  return canvas;
}

const takePicture = (videoElement, canvasElement) => {
  // This is a side effect
  let canvas;
  if(canvasElement) {
    canvas = canvasElement;
  } else {
    canvas = createCanvas({width: 640, height: 480});
  }

  canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);


  return canvas.toDataURL('image/jpeg')
}

const createTakePictureHandler = (canvasElements, onSecondPicture) => {
  let counter = 0;
  const images = Array(canvasElements.length).fill(null);

  return () => {
    const idx = counter % 2;
    const canvas = canvasElements[idx];

    images[idx] = takePicture(getVideoElement(), canvas);
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
      sendImageToServer(takePicture(getVideoElement()))
    } else {
      image.classList.remove('highlight');
    }
  });
}

const sendImageToServer = (data) => {
  return fetch('/store-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((resp) => {
    console.log(resp)
  }).catch((err) => {
    console.log('Error in fetch:', err);
  });
}

