var controllers = {};

controllers.welcome = function($scope, socket){
  /* declare variables */
  var canvas, context, video, vendorUrl,
      startCall, stopCall, acceptCall, rejectCall,
      media, WIDTH, HEIGHT,
      call, oncall, accepted, ringing;


  /* define init */
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
    oncall = false;
    accepted = false;

    navigator.getMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia;

    /* event handlers */
    startCall.onclick = function(){
      // send call event to other party
      console.log("calling other");
      call = true;
      socket.emit('call', call);
    };

    stopCall.onclick = endCall;

    acceptCall.onclick = function(){
      console.log("accepting");
      clearInterval(ringing);
      oncall = true;
      socket.emit('accept', oncall);
      draw(video, context, WIDTH, HEIGHT);
      // send accepted event to other party
      // sned draw event
    };

    /* socket events */
    socket.on('videodata', function(videostream){
      !image.src ? (image.src = "images/chat-app.png") : (image.src = videostream);
      /* draw video to canvas here and then transmit */
      //if (oncall) socket.emit('_newCall', canvas.toDataURL('image/webp', 1.0));
      _draw(video, context, WIDTH, HEIGHT);
    });

    socket.on('_videodata', function(videostream){
      //if (oncall) !image.src ? (image.src = "images/chat-app.png") : (image.src = videostream);
      !image.src ? (image.src = "images/chat-app.png") : (image.src = videostream);
    });

    socket.on('call', function(data){
      /* prompt for accept or reject
      if accept call draw to emit accept event
      else emit reject
      */
      ringing = setInterval(function(){console.log("ringing...")}, 2000);
    });

    socket.on('accept', function(data){
      /* On accept, take image data and render
      on image tag or canvas
      */
      console.log("accept received")
      oncall = true;
      draw(video, context, WIDTH, HEIGHT);
    });

    socket.on('reject', function(data){
      /* display call rejected */
    });

    socket.on('endCall', function(data){
      image.src = "images/chat-app.png";
      oncall = false;
    });

    media = null;
    startMediaView();
  }

  /* define functions */
  var successCallback = function(stream){
    media = stream.getTracks();
    video.src = vendorUrl.createObjectURL(stream);
    video.play();
  }

  var errorCallback = function(error){
    console.log(error);
  }

  /* draw video on canvas */
  function draw(video, context, width, height){
    console.log("drawing " + oncall)
    if (oncall){
      context.drawImage(video, 0, 0, width, height);
      socket.emit('videodata', canvas.toDataURL('image/webp', 1.0));
      setTimeout(draw, 50, video, context, width, height);
    }
  }

  function _draw(video, context, width, height){
    if (oncall){
      context.drawImage(video, 0, 0, width, height);
      socket.emit('_videodata', canvas.toDataURL('image/webp', 1.0));
      setTimeout(_draw, 50, video, context, width, height);
    }
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

  /* start drawing video content to canvas */
  var joinCall = function(){
    oncall = true;
    draw(video, context, WIDTH, HEIGHT);
  }

  var endCall = function(){
    console.log("ending other");
    oncall = false;
    //media.map(function(track){track.stop()});
    socket.emit('endCall', "images/chat-app.png");
  }

  init();

  /* run program */

  /* FUNCTIONS */
  var openApp = function(){
    // open local video
  }

  var callOther = function(){
    // send call event to other party
    console.log("calling other");
    call = true;
    socket.emit('call', call);
  }

  var accept = function(){
    console.log("accepting");
    /*clearInterval(ringing);
    oncall = true;
    socket.emit('accept', oncall);
    draw(video, context, WIDTH, HEIGHT);*/
    // send accepted event to other party
    // sned draw event
  }
}

app.controller(controllers);
