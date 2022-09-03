async function init(){
    model=await tf.loadLayersModel('./models/model.json');
    console.log('load success');
}



function findMaxIndex(result){
    let max=0;
    for(let i=1;i<result.length;i++){
        if(result[i]>result[max]){
            max=i;
        }
    }
    
    console.log(max);
    console.log(result[max]);
    if(result[max]<0.5){
        max='無法辨識';
    }
    return {predNum:max,prob:result[max]};
}

function predict(imgElement){
    // 將HTML <img> 轉換成矩陣tensor
    const tfImg=tf.browser.fromPixels(imgElement,1);
    // 強制將圖片縮小到28*28像素
    const smallImg=tf.image.resizeBilinear(tfImg,[28,28]);
    // 將tensor設為浮點型態 且將張量攤平至一維矩陣 此時shape為[1, 784]
    let tensor =smallImg.reshape([1,-1])
    // 將所有數值除以255
    tensor=tensor.div(tf.scalar(255));
    // 預測
    const pred=model.predict(tensor);
    const result=pred.dataSync();
    console.log(result);
    // 取得one hot encoding陣列中最大的索引
    const {predNum, prob}=findMaxIndex(result);
    document.querySelector('#result').innerHTML='預測結果: '+predNum;
}


let state=0; // 0:筆刷
let penType=0 // 0:筆 1:橡皮擦


let body=document.querySelector('body');
let canvas=document.querySelector('#drawing')
let canvasw=canvas.width;
let canvash=canvas.height;
let ctx=canvas.getContext('2d');
ctx.strokeStyle="rgba(255,255,255,1)";
ctx.lineWidth=20;
ctx.lineCap='round';
ctx.lineJoin='round';
let hasClicked=false;
function getMousePos(e){
    let rect=canvas.getBoundingClientRect();
    scalex=canvas.width/rect.width
    scaley=canvas.height/rect.height
    let x=canvas.getBoundingClientRect().left;
    let y=canvas.getBoundingClientRect().top;
    let mousex=e.pageX;
    let mousey=e.pageY;
    let canvasx=(mousex-x)*scalex;
    let canvasy=(mousey-y)*scaley;
    return [canvasx,canvasy];
}
canvas.addEventListener('mousemove',function(e){
    if(hasClicked==true){
        // console.log('move');
        
        var canvasPos;
        canvasPos=getMousePos(e)
        // console.log(canvasPos[0]);
        // console.log(canvasPos[1]);

        if(state==0){
            ctx.lineTo(canvasPos[0],canvasPos[1]);
            ctx.stroke();
        }
    }
})
canvas.addEventListener('mousedown',function(e){
    console.log('start');
    var canvasPos;
    canvasPos=getMousePos(e)

    if(state==0){
        ctx.lineTo(canvasPos[0],canvasPos[1]);

        console.log('begin');
        hasClicked=true;
        ctx.beginPath();
        ctx.moveTo(canvasPos[0],canvasPos[1]);
    }
})
body.addEventListener('mouseup',function(e){
    hasClicked=false;
    if(state==0){
        ctx.closePath();
    }
})
canvas.addEventListener('mouseout',function(e){
    if(state==0){
        if(penType==0){
            pen.style.display='none';
            hasClicked=false;
            ctx.closePath();
        }
        else if(penType==1){
            pen.style.display='none';
        }
    }
})
canvas.addEventListener('mousemove',function(e){
    if(state==0){
        if(penType==0){
            pen.style.display='block';
        }
        else if(penType==1){
            pen.style.display='block';
        }
    }
})

function clearCvs(){
    console.log('clear');
    ctx.clearRect(0, 0, canvasw, canvash);
    document.querySelector('#result').innerHTML='';
}

function submit(){
    dataUrl=canvas.toDataURL();
    let img=document.createElement('img');
    img.src=dataUrl;
    img.width=canvas.width;
    img.height=canvas.height;
    img.onload=()=>{
        predict(img);
    }
}

// 控制筆頭粗細
let pen=document.querySelector('#pen');
body.addEventListener('keyup',function(e){
    console.log(e.key);
    if(e.key=='['){
        if(ctx.lineWidth>5){
            ctx.lineWidth-=2;
            pen.style.width=(pen.offsetWidth-2)+'px';
            pen.style.height=(pen.offsetHeight-2)+'px';
            console.log(pen.style.width);
            console.log(pen.style.height);
        }
    }
    else if(e.key==']'){
        if(ctx.lineWidth<70){
            ctx.lineWidth+=2;
            pen.style.width=(pen.offsetWidth+2)+'px';
            pen.style.height=(pen.offsetHeight+2)+'px';
            console.log(pen.style.width);
            console.log(pen.style.height);
        }
    }
})

// 調整筆頭圖案粗細
body.addEventListener('mousemove',function(e){
    var x=e.pageX;
    var y=e.pageY;
    pen.style.left=(x)-(ctx.lineWidth/2)+'px';
    pen.style.top=(y)-(ctx.lineWidth/2)+'px';
})




// 橡皮擦功能
body.addEventListener('keyup',function(e){
    if(e.key=='e'||e.key=='E'){
        tab.lis[1].click();
    }
})


// 畫筆功能
body.addEventListener('keyup',function(e){
    if(e.key=='p'||e.key=='P'){
        tab.lis[0].click();
    }
})


function changeType(type){
    switch(type){
        case 0:{
            penType=0;
            ctx.strokeStyle="rgba(255,255,255,1)";
            break;
        }
        case 1:{
            penType=1;
            ctx.strokeStyle="rgba(0,0,0,1)";
            break;
        }
    }
}