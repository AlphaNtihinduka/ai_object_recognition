function buttonChangeText(){
    var initialMessage = "Initializing Setup";
    var initialSpeakSetup = new SpeechSynthesisUtterance(initialMessage);
    window.speechSynthesis.speak(initialSpeakSetup);
   };
   var classifier; var video; var resultsP; var msg1; var prevmsg;

   function setup() {
    noCanvas();
    video = createCapture(VIDEO);
    classifier = ml5.imageClassifier('MobileNet', video, modelReady);
    resultsP = createP('Loading model and video...');
   }
   function modelReady() {
    console.log('Model Ready');
    classifyVideo();
   }
   function classifyVideo() {
    classifier.classify(gotResult);
   }
   async function gotResult(err, results) {
    resultsP.html(results[0].label + ' ' + nf(results[0].confidence, 0, 2));
    if(nf(results[0].confidence, 0, 2) > 0.35){
    if(results[0].label != prevmsg){
    msg1 = new SpeechSynthesisUtterance(results[0].label);
    window.speechSynthesis.speak(msg1);
    prevmsg = results[0].label;
    }
    }
    setTimeout(classifyVideo, 5000);
   }

   function toggleCamera() {
    // Stop the current video capture
    video.stop();
  
    // Determine the current facing mode
    const currentFacingMode = video.getVideoTracks()[0].getSettings().facingMode;
  
    // Define the new facing mode based on the current one
    const newFacingMode = currentFacingMode === "user" ? "environment" : "user";
  
    // Create a new video capture with the updated facing mode
    video = createCapture({ video: { facingMode: { exact: newFacingMode } } }, function(stream) {
      // Replace the video element with the new capture stream
      const newVideoElement = stream.getVideoTracks()[0].stop();
      video.elt.srcObject = stream;
    });
  
    // Re-initialize the image classifier with the new video capture
    classifier = ml5.imageClassifier('MobileNet', video, modelReady);
  }