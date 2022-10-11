const faceapi = require("face-api.js")  
const canvas = require("canvas")  
const fs = require("fs")  
const path = require("path")

//const url = "./face.jpg";

// mokey pathing the faceapi canvas
const { Canvas, Image, ImageData } = canvas  
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

const faceDetectionNet = faceapi.nets.ssdMobilenetv1
//console.log("worked up to here"); //just some really advanced dev stuff you wouldn't understand
// SsdMobilenetv1Options
const minConfidence = 0.5

// TinyFaceDetectorOptions
const inputSize = 408  
const scoreThreshold = 0.5

// MtcnnOptions
const minFaceSize = 50  
const scaleFactor = 0.8

function getFaceDetectorOptions(net) {  
    return net === faceapi.nets.ssdMobilenetv1
        ? new faceapi.SsdMobilenetv1Options({ minConfidence })
        : (net === faceapi.nets.tinyFaceDetector
            ? new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
            : new faceapi.MtcnnOptions({ minFaceSize, scaleFactor })
        )
}

const faceDetectionOptions = getFaceDetectorOptions(faceDetectionNet)

//console.log("worked up to here");


// simple utils to save files
const baseDir = path.resolve(__dirname, './out')  
function saveFile(fileName, buf) {  
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir)
    }
    // this is ok for prototyping but using sync methods
    // is bad practice in NodeJS
    fs.writeFileSync(path.resolve(baseDir, fileName), buf)
  }


getPromise = (data) => {
  return new Promise(async function(resolve, reject) {
    url = data.url
    await faceDetectionNet.loadFromDisk('./face-api.js/weights')
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./face-api.js/weights')

    // load the image
    const img = await canvas.loadImage(url)
    var hair = await canvas.loadImage('./hair.png')
    hair = faceapi.createCanvasFromMedia(hair);
    hairimage = hair.getContext("2d");

    // detect the faces with landmarks
    const results = await faceapi.detectAllFaces(img, faceDetectionOptions).withFaceLandmarks()
    
    // create a new canvas and draw the detection and landmarks
    const out = faceapi.createCanvasFromMedia(img)

    output = out.getContext("2d");

      const boxesWithText = results.map((bestMatch, i) => {
        const box = results[i].detection.box
        output.drawImage(hair, box.x-(box.width*1.15), box.y-(box.height/3.25), box.width*3, box.height*1.5)
        const text = bestMatch.toString()
        const boxWithText = new faceapi.LabeledBox(box);
        return boxWithText
      })
        

    
    //faceapi.draw.drawDetections(out, boxesWithText)
    //faceapi.draw.drawFaceLandmarks(out, results, { drawLines: true, color: 'red' })

    
    url = url.split('/');
    // save the new canvas as image
    saveFile(`${url[url.length-1]}`, out.toBuffer('image/jpeg'))
    //console.log(`done, saved results to out/${url[url.length-1]}`)
    resolve('Success!');
});
}

exports.getFace = (data) => {
  return new Promise(function(resolve, reject) {
    promise1 = getPromise(data);
    promise1.then(()=>{
      setTimeout(() => {
        resolve('Success!');
      }, 2000);
    });
  });
  

}