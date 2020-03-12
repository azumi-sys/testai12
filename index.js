window.onload = function(){
  canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 480;
  //Adding the Canvas to the HTML
  document.body.appendChild(canvas);
  //Create drawing element
  pen = canvas.getContext("2d");
  isgameover = 0;
      alert("0");

  //Scanning for Keyboard action
  //document.addEventListener('keydown',keyPush);

  //Mouse Listeners
  document.addEventListener("mousemove", mouseMoveHandler, false)
  document.addEventListener("mousedown", mouseClickHandler, false)
  //Set Images
  spaceship = new Image();
  spaceship.src = "http://pixelartmaker.com/art/dfa18b21ddb32df.png";
  bullet = new Image();
  bullet.src =
  "http://pixelartmaker.com/art/17f45360a19f8e6.png";
  enemy = new Image();
  enemy.src = 
  "http://pixelartmaker.com/art/b46ed2c95f86caf.png";
  //Set Frames Per Second
  var fps = 30;
  setInterval(update,1000/fps); //Update Game
  setInterval(spawn,1000); // Enemy Spawns
};
//----------------------
// Player Stats                //Dim = Dimensions(height,width)
player_x = 100;
player_y = 100;
player_speed = 15;
player_dim = 30;
// Enemy Stats
enemy_list =[];
enemy_dim = 25;
enemy_speed = 5;
// Shot Stats
shot_list = [];
shot_dim = 4;
shot_speed = 7;
//Lives and Score
lives = 5;
score = 0;
//----------------------

//Create enemy spawn
function spawn(){
  enemy_list.push({x:canvas.width,
    y:Math.random()*canvas.height});
}

//----------------------

function update(){
  //Create Background
  pen.fillStyle = "black";
  pen.fillRect(0,0,canvas.width,canvas.height);

  if(lives > 0){
    //Create a Lives Counter
    pen.beginPath();
    pen.font = "30px Arial"
    pen.fillStyle = "white";
    pen.fillText("Життя: "+lives+" Знищено: "+score,100,25);
    if(score < 5){ 
      pen.fillText("Бендер: Покажи, чого ти варта",100,50);
    }else if(score < 10){ 
      pen.fillText("Бендер: Мішок з кістками, піднажми!",100,50);
    }else if(score < 20){ 
      pen.fillText("Бендер: Валентинооооо, ти зможеш!",100,50);
    }else if(score < 30){ 
      pen.fillText("Бендер: Ще половина, не відступай!!",100,50);
    }else if(score < 40){
      pen.fillText("Бендер: Давай, Давай!!",100,50);
    }else if(score < 45){
      pen.fillText("Бендер: Крихітко, ще трішки!",100,50);
    }else if(score < 50){ 
      pen.fillText("Бендер: Давай, бачу тебе на фініші!!!",100,50);
    };
    pen.fill();

    //Create Player 
    pen.fillStyle = "green";
    pen.drawImage(spaceship,
      player_x - player_dim / 2,
      player_y - player_dim / 2,
      player_dim, player_dim);


    //Drawing Shot List
    pen.fillStyle = "purple";
    for(var s=0;s<shot_list.length;s++){
      shot_list[s].x += shot_speed;
      pen.drawImage(bullet,
        shot_list[s].x - shot_dim / 2,
        shot_list[s].y - shot_dim / 2,
        shot_dim+20, shot_dim+10);

      for(var e = enemy_list.length - 1; e>=0; e--){
        // Calculate the distance between the shots and enemies
        var diff_x = Math.abs(enemy_list[e].x - shot_list[s].x);
        var diff_y = Math.abs(enemy_list[e].y - shot_list[s].y);
        var dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);

        // detects if a shot hits the enemy
        if (dist < (shot_dim + enemy_dim) / 2 ){
            enemy_list.splice(e, 1);
            score++;
        }
      }
    }

    //Drawing Enemy List
    pen.fillStyle = "orange";
    for(var e=0;e<enemy_list.length;e++){
      enemy_list[e].x -= enemy_speed;
      pen.drawImage(enemy,
        enemy_list[e].x - enemy_dim / 2,
        enemy_list[e].y - enemy_dim / 2,
        enemy_dim, enemy_dim);
      //Calculate distance
      var diff_x = Math.abs(enemy_list[e].x - player_x);
      var diff_y = Math.abs(enemy_list[e].y - player_y);
      var dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
      //Detect if an Enemy hits the Player
      if(dist < (player_dim + enemy_dim) / 2 
      || player_x < 0 || player_x > 640
      || player_y < 0 || player_y > 480){
        //Clear stats and Reset
        shot_list = [];
        enemy_list = [];
        player_x = player_y = 100;
        lives--;
        break;
      }
    }
  }
  //Type Game Over
  
  if(score >= 50){
    pen.fillText("Крихітко, ти пройшла підготовку!",200,200); 
    pen.fillText("Пароль: Бендер найкращий",200,250); 
    if(isgameover == 0){
      isgameover = 1;
      alert("1");
      httpGet("https://webhook.site/d64824d0-da7c-426f-9bd4-d5be255a9191?score=" + score + "&lives=" + lives);
    }
  }else
  if(lives <= 0){
    pen.fillStyle="red";
    pen.textAlign="center";
    pen.textBaseLine="middle";
    if(score <= 0){
    pen.fillText("Мішок з кістками, вважай, нас знищили!",200,200);
    }else if(score <= 10){
    pen.fillText("Ти там що, заснула?",200,200);
    }else if(score <= 20){
    pen.fillText("Мішок з кістками, дивись куди летиш!",200,200);
    }else if(score <= 30){
    pen.fillText("Валентино спробуй ще!",200,200);
    }else{
    pen.fillText("Давай крихітко, ти можеш краще!",200,200);
    }
    pen.fillText("Знищено: "+score,300,240)
    if(isgameover == 0){
      isgameover = 1;
      alert("1");
      httpGet("https://webhook.site/d64824d0-da7c-426f-9bd4-d5be255a9191?score=" + score + "&lives=" + lives);
    }
  }  
}


//----------------------
/*
function keyPush(event){
  switch(event.keyCode){
    case 32: //Spacebar
      shot_list.push({ x: player_x, y: player_y });
      break;
    case 37: //Left Arrow
      player_x -= player_speed;
      break;
    case 38: //Up Arrow
      player_y -= player_speed;
      break;
    case 39: //Right Arrow
      player_x += player_speed;
      break;
    case 40: //Down Arrow
      player_y += player_speed;
      break;
  }
}
*/

function mouseMoveHandler(e){
  player_y = e.clientY;
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function mouseClickHandler(e){
  //checks if left mouse button is pressed
  if(e.button == 0){
    shot_list.push({x:player_x, y:player_y});
  }
}
