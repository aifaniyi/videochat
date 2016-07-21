var controllers = {};

controllers.welcome = function($scope, socket){
  $scope.oncall, $scope.makingcall;
  var canvas, context, video, vendorUrl,
      startCall, stopCall, acceptCall, rejectCall,
      media, WIDTH, HEIGHT,
      call, accepted, ringing;

  function init(){
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    video = document.getElementById('video');
    vendorUrl = window.URL || window.webkitURL;
    startCall = document.getElementById("startCall");
    stopCall = document.getElementById("stopCall");
    acceptCall = document.getElementById("accept");
    rejectCall = document.getElementById("reject");
    image.src = "images/chat-app.png"
    WIDTH = 600;
    HEIGHT = 450;
    $scope.oncall = false;
    accepted = false;

    navigator.getMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia;

    /* setup videostream */

    /* intialize socket events */
    socket.on('videodata', function(videostream){
      $scope.oncall ? (image.src = lzw_decode(videostream)) : (image.src = "images/chat-app.png");
    });

    socket.on('call', function(data){
      $scope.makingcall = true;
      console.log("new call received")
      ringing = setInterval(function(){playSound("ringing");console.log("ringing...")}, 2000);
    });

    socket.on('accept', function(data){
      console.log("call accepted; stop ringing and transmit")
      clearInterval(ringing);
      $scope.makingcall = false; $scope.oncall = true;
      draw(video, context, WIDTH, HEIGHT);
    });

    socket.on('reject', function(data){
      console.log("call rejected")
      clearInterval(ringing);
      $scope.makingcall = false;
      //drop
    });

    socket.on('endCall', function(data){
      $scope.oncall = false;
      image.src = "images/chat-app.png";
    });

    startMediaView();
  }

  /* utility functions */
  $scope.makeCall = function(){
    if(!$scope.makingcall){
      $scope.makingcall = true;
      console.log("makeCall")
      ringing = setInterval(function(){playSound("ringing");console.log("ringing...")}, 2000);
      socket.emit('call')
    }
  }

  $scope.endCall = function(){
    console.log("endCall")
    $scope.oncall = false;
    image.src = "images/chat-app.png";
    socket.emit('endCall')
  }

  $scope.pickCall = function(){
    console.log("pickCall and stop ringing")
    clearInterval(ringing);
    $scope.makingcall = false; $scope.oncall = true;
    socket.emit('accept')
    draw(video, context, WIDTH, HEIGHT);
  }

  $scope.denyCall = function(){
    console.log("denyCall")
    if($scope.makingcall) clearInterval(ringing);
    $scope.makingcall = false;
    socket.emit('reject')
  }

  /* get media (i.e vodeo and/or audio);
  on success call successCallback and on
  failure errorCallback */
  var startMediaView = function(){
    if (navigator.getMedia){
      navigator.getMedia({
        video: true
        //audio: true
       }, successCallback, errorCallback);
    }
  }

  var successCallback = function(stream){
    //media = stream.getTracks();
    video.src = vendorUrl.createObjectURL(stream);
    video.play();
  }

  var errorCallback = function(error){
    console.log(error);
  }

  /* draw video on canvas then transmit*/
  function draw(video, context, width, height){
    if ($scope.oncall){
      context.drawImage(video, 0, 0, width, height);
      socket.emit('videodata', lzw_encode(canvas.toDataURL('image/webp', 1.0)));
      setTimeout(draw, 50, video, context, width, height);
    }
  }

  // LZW-compress a string
  function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
  }

  // Decompress an LZW-encoded string
  function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
  }

  function playSound(soundObj) {
    var sound = document.getElementById(soundObj);
    sound.play();
  }

  init();
}

app.controller(controllers);
