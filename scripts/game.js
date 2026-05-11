let rocket=document.getElementById("rocket")
let gameArea=document.getElementById("gameArea")
let timeText=document.getElementById("time")

let x=190
let y=440
let keys={}
let meteors=[]
let playing=false
let time=0
let score = 0;
let scoreText = document.getElementById("scoreText");
let targetTime = 50;

document.addEventListener("keydown",e=>{
    keys[e.key.toLowerCase()]=true
})

document.addEventListener("keyup",e=>{
    keys[e.key.toLowerCase()]=false
})

function startCountdown() {
    document.getElementById("countdownText").innerText = 3;
    document.getElementById("storyOverlay").style.display = "none";
    document.getElementById("countdownOverlay").style.display = "flex";
    let count = 3;
    let timer = setInterval(() => {
        count--;
        document.getElementById("countdownText").innerText = count;
        if (count <= 0) {
            clearInterval(timer);
            document.getElementById("countdownOverlay").style.display = "none";
            startGame();
        }
    }, 1000);
}

function startGame() {
    playing = true;
    time = 0;
    score = 0;
    meteors = [];
    x = 110; 
    y = 440;
    
    scoreText.innerText = score;
    document.querySelectorAll(".meteor, .star").forEach(el => el.remove());

    let gameClock = setInterval(() => {
        if (!playing) { clearInterval(gameClock); return; }
        time++;
        document.getElementById("time").innerText = time;
        if (time >= targetTime) winGame();
    }, 1000);

    gameLoop();
    meteorLoop();
    starLoop();
}


function gameLoop(){

    if(!playing)return

    if(keys["arrowleft"]) x-=1
    if(keys["arrowright"]) x+=1

    x=Math.max(-85,Math.min(300,x))
    y=Math.max(0,Math.min(300,y))
 

    rocket.style.left=x+"px"
    rocket.style.top=y+"px"

    checkCollision()

    requestAnimationFrame(gameLoop)
}

function meteorLoop(){
    speed = Math.floor(Math.random() * (50 - 20 + 1)) + 20;

    if(!playing)return

    let m=document.createElement("div")
    m.className="meteor"
    m.innerHTML = `<img src="img/meteor.png">`;
    m.style.left=Math.random()*380+"px"
    m.style.top="-30px"

    gameArea.appendChild(m)
    meteors.push(m)

    let fall=setInterval(()=>{
        if(!playing){
            clearInterval(fall)
            return
        }

        let top=parseInt(m.style.top)
        top+=4
        m.style.top=top+"px"

        if(top>520){
            clearInterval(fall)
            m.remove()
        }
    },speed)

 setTimeout(meteorLoop,700)
}

function checkCollision() {
    let r1 = rocket.getBoundingClientRect();
    
    let paddingSide = 125;  
    let paddingFront = 20; 

    document.querySelectorAll(".meteor").forEach(m => {
        let r2 = m.getBoundingClientRect();

        if (
            r1.left + paddingSide < r2.right &&
            r1.right - paddingSide > r2.left &&
            r1.top + paddingFront < r2.bottom &&
            r1.bottom - paddingFront > r2.top
        ) {
            loseGame();
        }
    });
}

function starLoop() {
    if (!playing) return;
    let s = document.createElement("div");
    s.className = "star";
    s.innerHTML = "⭐";
    s.style.left = Math.random() * 380 + "px";
    s.style.top = "-30px";
    gameArea.appendChild(s);

    let paddingSide = 90;
    let paddingFront = 20;

    let fall = setInterval(() => {
        if (!playing) { clearInterval(fall); s.remove(); return; }
        let top = parseInt(s.style.top);
        top += 3;
        s.style.top = top + "px";
        
        let r1 = rocket.getBoundingClientRect();
        let r2 = s.getBoundingClientRect();
        if (
            r1.left + paddingSide < r2.right &&
            r1.right - paddingSide > r2.left &&
            r1.top + paddingFront < r2.bottom &&
            r1.bottom - paddingFront > r2.top
        ) {
            score += 10;
            scoreText.innerText = score;
            s.remove();
            clearInterval(fall);
        }
        if (top > 500) { clearInterval(fall); s.remove(); }
    }, 30);
    setTimeout(starLoop, 2000);
}

function loseGame() {
    playing = false;
    document.getElementById("gameOverOverlay").style.display = "flex";
    document.getElementById("finalStatus").innerText = "MISSION FAILED";
    document.getElementById("finalScore").innerText = score;
}

function winGame() {
    playing = false;
    document.getElementById("gameOverOverlay").style.display = "flex";
    document.getElementById("finalStatus").innerText = "MISSION SUCCESS";
    document.getElementById("finalScore").innerText = score;
}

function resetGame() {
    document.getElementById("gameOverOverlay").style.display = "none";
    document.getElementById("storyOverlay").style.display = "flex";
    document.getElementById("time").innerText = 0;
}

