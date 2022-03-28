status="";
objects=[];

function setup(){
    canvas=createCanvas(480,380);
    canvas.center();
    video=createCapture(VIDEO);
    video.hide();
}

function start(){
    objectDetector=ml5.objectDetector('cocossd',modelLoaded);
    document.getElementById("status").innerHTML="status: detecting objects";
    objectName=document.getElementById("input").value;
}

function modelLoaded(){
    console.log("Model is loaded");
    status=true;
}

function gotResult(error,results){
    if(error){
        console.log(error);
    }
    else{
        console.log(results);
        objects=results;
    }
}

function draw(){
    image(video,0,0,480,380);
    if(status!=""){
        objectDetector.detect(video,gotResult);
        for(i=0;i<objects.length;i++){
            document.getElementById("status").innerHTML="Status: Objects Detected";
            fill("#fc6fbd");
            percent=floor(objects[i].confidence*100);
            text(objects[i].label+" "+percent+"% ",objects[i].x,objects[i].y);
            noFill();
            stroke("#fc6fbd");
            rect(objects[i].x,objects[i].y,objects[i].width,objects[i].height);
            if(objects[i].label==objectName){
                video.stop();
                objectDetector.detect(gotResult);
                document.getElementById("object").innerHTML=objectName+" Found";
                synth=window.speechSynthesis;
                utterThis=new SpeechSynthesisUtterance(objectName+"Found");
                synth.speak(utterThis);
            }
            else{
                document.getElementById("object").innerHTML=objectName+" Not Found";
            }
        }
    }
}