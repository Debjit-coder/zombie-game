var PLAY = 1;
var END = 0;
var gameState = PLAY;

var man, Man;
var ground, invisibleGround, groundImage;
var dead

var bg
var bgImg

var score=0;

var gameOver, restart;
localStorage["HighestScore"] = 0;

function preload(){
  man_running= loadAnimation("man1.png","man2.png", "man3.png", "man4.png", "man5.png","man6.png","man7.png", "man8.png", "man9.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  dead = loadAnimation("dead.png");

  bgImg = loadImage("bg.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  bg= createSprite(300,100,300,200);
  bg.addImage(bgImg);
  bg.velecityX=-5;

  man= createSprite(90,180,20,50);
  
 man.addAnimation("man_running",man_running);
 man.addAnimation("dead",dead);
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  

  gameOver.scale = 0.1;
  restart.scale = 0.2;
  man.scale= 0.5;
  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,200,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() 
{
  //man.debug = false;
  background("white");
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY)
 {
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    man.changeAnimation("man_running",man_running);
    if(bg.x<400)
    {
      bg.x=300
    }

    if(keyDown("space")&& man.y>100) 
    {
      man.velocityY = -12;
    }
  
    man.velocityY = man.velocityY + 0.8
  
    if (ground.x < 0)
    {
      ground.x = ground.width/2;
    }
  
    man.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(man))
    {
        gameState = END;
 
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    man.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    man.y= 190;
    man.changeAnimation("dead",dead);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(550,100,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = man.depth;
    man.depth = cloud.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(570,165,10,40);
    //obstacle.debug = false;
    obstacle.velocityX = -(6.6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;     
      case 4: obstacle.addImage(obstacle4);
              break;  
      case 5: obstacle.addImage(obstacle5);
              break;      
      case 6: obstacle.addImage(obstacle6);
              break;               
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
 
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  

  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}