let block;
let blocks;
let canvasWidth;
let canvasHeight;
let dropX;
let num;
let tempo;
let sound;
let set1;
let set2;
let set3;
let point;
let minus;
let gameState = "start";

let img_pancake;
let img_bread;
let img_potato;
let img_grey_pancake;
let img_grey_bread;
let img_grey_potato;
let img_solt;
let img_maple;
let img_butter;
let img_oko;
let img_egao;
let img_bts

let first_s;
let last_s;
let push_s;
let gameover_s;
let great_s


/**アイコンの選択 "パンケーキ"か"じゃがいも"か"食パン"を入れるものとする(高橋)*/
let icons;


// **********************
//-------画像読み込み (高橋)--------
function preload() {
    img_pancake = loadImage('./pictures/pancake.jpg');
    img_bread = loadImage('./pictures/bread.jpg');
    img_potato = loadImage('./pictures/potato.jpg');
    img_grey_pancake = loadImage('./pictures/grey_pancake.jpg');
    img_grey_bread = loadImage('./pictures/grey_bread.jpg');
    img_grey_potato = loadImage('./pictures/grey_potato.jpg');
    img_solt = loadImage('./pictures/solt.jpg');
    img_maple = loadImage('./pictures/maple.jpg');
    img_butter = loadImage('./pictures/butter.jpg');
    img_how = loadImage("./pictures/howtoplay.png");
    img_oko = loadImage("./pictures/oko.jpg");
    img_egao = loadImage("./pictures/egao.jpg");
    img_bts = loadImage("./pictures/bts.jpg");

    sound = loadSound("./music/Butter.mp3");
    cheer_s = loadSound("./music/cheer.mp3")
    last_s = loadSound("./music/last.mp3");
    poon = loadSound("./music/dram.mp3");
    gameover_s = loadSound("./music/gameover.mp3");
    great_s = loadSound("./music/greate.mp3");
}



// ------------- setup, draw ---------------

function setup() {
  resetGame();
  
}

function draw() {
  print(time);
  checkGameState();
  if(S===1){
    time = time + pathTime;
  }
  if(time>103&& gameState!="gameover"){
    gameState="clear";
    drawClear();
  }
}

//****************************************************** */
// ----------------- メイン関数定義 --------------------

// ----------------- マウスクリック関数 ----------------
function mousePressed(){
  if(gameState=="gameover"){
    gameover_s.play();
  }
  else if(gameState=="clear"){
    cheer_s.play();
    great_s.play();
  }
}

// ---------- reset 関数 --------------------
function resetGame(){
  last_s.play();
  canvasWidth = 900;
  canvasHeight = 800;
  createCanvas(canvasWidth + 200, canvasHeight);
  rectMode(CENTER);
  button_pancake = createButton("パンケーキ");
  button_potato = createButton("じゃがいも");
  button_bread = createButton("食パン");
  drawFirst();

  tempo = [];
  set1 = [];
  set2 = [];
  set3 = [];
  point=0;
  minus=0;
}

// ---------- gameState分岐関数 --------------
function checkGameState(){
  if(gameState=="start"){
    button_pancake.mousePressed(clicked_pancake);
    button_potato.mousePressed(clicked_potato);
    button_bread.mousePressed(clicked_bread);
  } 
  else if(gameState=="play"){  
    timeCount();
    if(time>4.7){
      rhythm();
      userIcon();
  } 
}
  else if(gameState=="gameover"){ 
     
    drawGameover();
    sound.pause();
  }
  else if(gameState=="clear"){
    drawClear();
    sound.pause();
  }
}

// ----------- ゲーム内容のupdateをする関数 --------------
function updatePosition(entity) {
  entity.x += entity.vx;
  entity.y += entity.vy;
  if(entity.y==800) {
    minusLife();
  }
  if(minus==15){
    gameState="gameover";
  }
}

// ---------- リズムテンポBlock(バター)生成関数 -----------------------
function rhythm() { // ゲームのメインとなる関数

  background(0);  

  // 1テンポ目  
  for (let block of set1) updatePosition(block);
  for (let block of set1)  applyGravity(block);
  if(frameCount % 32 === 1) makeSet1(); // ブロック等間隔で作成
  set1 = set1.filter(blockAlive); // 範囲外のブロック削除

// 2テンポ目
if(time > 33){
  for (let block of set2) updatePosition(block);
  for (let block of set2)  applyGravity(block);
  if(frameCount % 32 === 1) makeSet2();
  set2 = set2.filter(blockAlive);
  set2 = set2.filter(deleteSet2);
}; 


// 3テンポ目
if(time > 80){
  for (let block of set3) updatePosition(block);
  for (let block of set3)  applyGravity(block);
  if(frameCount % 32 === 1) makeSet3();
  set3 = set3.filter(blockAlive);
}

// 衝突判定・キー判定
collKey(set1);
collKey(set2);
collKey(set3);

// 全エンティティの描画

  drawPointSpace();
  createPlayerLine();
  for (let block of set1) drawBlock(block);
  for (let block of set2) drawBlock(block);
  for (let block of set3) drawBlock(block);

  for (let pointGage of pointGages) drawGage(pointGage); 
  for (let lifeGage of lifeGages) drawGage2(lifeGage);

}


// ***********************************************************
// gameState別の画面描画関数 ↓↓↓ 

// ----------- 初期画面 -----------------------
function drawFirst(){
  background(255, 250, 200);
  fill(0);
  textSize(80);
  textAlign(CENTER,CENTER);
  text("Butter Music Game", width/2, height/5);

  image(img_butter,320,550,img_butter.width/1.1,img_butter.height/1.1);

  button_start = createButton("スタート");
  button_start.style("background", "#FFD700");
  button_start.size(300,80)
  button_start.position(width/2-150, height/2-100);
  button_start.style("font-size", "30")
  button_start.style("border-radius", "5px");
  button_start.mousePressed(drawStart);

  button_how = createButton("遊び方");
  button_how.style("background", "#FFD700")
  button_how.size(300,80)
  button_how.position(width/2-150, height/2);
  button_how.style("font-size", "30")
  button_how.style("border-radius", "5px");
  button_how.mousePressed(drawHow);
}

// -------------- 遊び方画面 ---------------
function drawHow(){
  button_start.remove();
  button_how.remove();
  background(176, 196, 222);
  fill(0);
  textSize(40);
  text("遊び方", width/2, height/15);

  image(img_how, 20, 100, img_how.width/2.3, img_how.height/2.3);

  button_start2 = createButton("スタート");
  button_start2.style("background", "#FFD700");
  button_start2.size(120,40)
  button_start2.position(width/2+350, height/2+200);
  button_start2.style("font-size", "20")
  button_start2.style("border-radius", "5px");
  button_start2.mousePressed(goStart);
}

function goStart(){
  drawStart();
  button_start2.remove();
}

//------------ スタート画面(マツモト) ------------------------
function drawStart() {
  button_start.remove();
  button_how.remove();
  background(255,250,205);
    fill(0);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("どのアイコンにしますか？ボタンを押してください", width / 2, height / 2.7);
    image(img_pancake, 200, 450, img_pancake.width / 4, img_pancake.height / 4);
    image(img_potato, 400, 450, img_pancake.width / 4, img_pancake.height / 4);
    image(img_bread, 600, 450, img_pancake.width / 4, img_pancake.height / 4);
    button_pancake.size(100, 30);
    button_potato.size(100, 30);
    button_bread.size(100, 30);
    button_pancake.position(238, 415);
    button_potato.position(438, 415);
    button_bread.position(638, 415);
    button_pancake.mousePressed(clicked_pancake);
    button_potato.mousePressed(clicked_potato);
    button_bread.mousePressed(clicked_bread);
}

//---- パンケーキが選択されたら(高橋)-----
function clicked_pancake() {
    icons = "パンケーキ";
    gameState="play"
    button_pancake.remove();
    button_bread.remove();
    button_potato.remove();
    sound.play(); 
    last_s.pause();
}

//----じゃがいもが選択されたら(高橋)----
function clicked_potato() {
    icons = "じゃがいも";
    gameState="play"
    button_potato.remove();
    button_bread.remove();
    button_pancake.remove();
    sound.play();
    last_s.pause()
}

//----食パンが選択されたら(高橋)----
function clicked_bread() {
    icons = "食パン";
    gameState="play"
    button_bread.remove();
    button_potato.remove();
    button_pancake.remove();
    sound.play();
    last_s.pause();
}

// ------------ ゲームオーバー画面 ---------------

function drawGameover(){
  score = point*100 - minus*100;
  background(255,30,30);
    fill(255);
    textSize(75);
    textAlign(CENTER, CENTER);
    text("ゲームオーバー！", width / 2, height / 12);
    image(img_oko, 600,400, img_oko.width / 1.1, img_oko.height /1.1);

    fill(0);
    textSize(30);
    textAlign(LEFT);
    text("バターポイント："+ point*100, 50, 300);
  
    fill(0);
    textSize(30);
    textAlign(LEFT);
    text("ミス："+ minus*100,  50, 400);
  
    fill(255,255,0);
    stroke(0)
    textSize(40);
    textAlign(LEFT);
    textStyle(BOLD);
    text("SCORE："+ score,  50, 600);
    noStroke();
  }

// ------------- クリア画面 ---------------------

let score;

function drawClear(){
  score = point*100 - minus*100;

  background(255,250,100);
  fill(0);
  textSize(50);
  textAlign(CENTER,CENTER);
  text("ゲームクリア！",  width / 2, height / 12);

  fill(0);
  textSize(30);
  textAlign(LEFT);
  text("バターポイント："+ point*100, 50, 300);

  fill(0);
  textSize(30);
  textAlign(LEFT);
  text("ミス："+ minus*100,  50, 400);

  fill(0);
  textSize(50);
  textAlign(RIGHT);
  text(point*100 + " - " + minus*100 +  " = " + score, 1000, 350);

  image(img_egao, 800, 450, img_egao.width/0.9, img_egao.height/0.9);

  fill(255,0,0);
  stroke(0)
  textSize(60);
  textAlign(LEFT);
  textStyle(BOLD);
  text("SCORE："+ score,  50, 600);
  noStroke();

}

// **********************************************
// -------------　メインエンティティの生成とその処理 -----------------

// ユーザー生成 ↓↓↓
// ------- ユーザーアイコン設定 ----------------
let a

function userIcon(){
  image(img_bts, 705,500,img_bts.width, img_bts.height);
  if(icons=="パンケーキ"){
    image(img_grey_pancake, 123, 620, img_grey_pancake.width / 7, img_grey_pancake.height / 7);
    image(img_grey_pancake, 323, 620, img_grey_pancake.width / 7, img_grey_pancake.height / 7);
    image(img_grey_pancake, 523, 620, img_grey_pancake.width / 7, img_grey_pancake.height / 7);
    if (keyCode == RIGHT_ARROW) {
      a = 523;
  } else if (keyCode == LEFT_ARROW) {
      a = 123;
  } else if (keyCode == UP_ARROW) {
      a = 323;
  }
  image(img_pancake, a, 620, img_grey_pancake.width / 7, img_grey_pancake.height / 7);
  
  }
  else if(icons=="じゃがいも"){
    image(img_grey_potato, 123, 620, img_grey_potato.width / 7, img_grey_potato.height / 7);
    image(img_grey_potato, 323, 620, img_grey_potato.width / 7, img_grey_potato.height / 7);
    image(img_grey_potato, 523, 620, img_grey_potato.width / 7, img_grey_potato.height / 7);
    if (keyCode == RIGHT_ARROW) {
      a = 523;
  } else if (keyCode == LEFT_ARROW) {
      a = 123;
  } else if (keyCode == UP_ARROW) {
      a = 323;
  }
  image(img_potato, a, 620, img_grey_potato.width / 7, img_grey_potato.height / 7);
  
  }
  else if(icons=="食パン"){
    image(img_grey_bread, 130, 620, img_grey_bread.width / 8, img_grey_bread.height / 8);
    image(img_grey_bread, 330, 620, img_grey_bread.width / 8, img_grey_bread.height / 8);
    image(img_grey_bread, 530, 620, img_grey_bread.width / 8, img_grey_bread.height / 8);
    if (keyCode == RIGHT_ARROW) {
      a = 530;
  } else if (keyCode == LEFT_ARROW) {
      a = 130;
  } else if (keyCode == UP_ARROW) {
      a = 330;
  }
  image(img_bread, a, 620, img_grey_bread.width / 8, img_grey_bread.height / 8);
  
  }
}


//------------- 矢印キーを離した時 --------------
function greyDraw(){
    switch (icons) {
        case "パンケーキ":
          if(keyCode==""){
            image(img_grey_pancake, 123, 620, img_grey_pancake.width / 7, img_grey_pancake.height / 7);
            image(img_grey_pancake, 323, 620, img_grey_pancake.width / 7, img_grey_pancake.height / 7);
            image(img_grey_pancake, 523, 620, img_grey_pancake.width / 7, img_grey_pancake.height / 7);
          }
            break;

        case "じゃがいも":
          if(keyCode==""){
            image(img_grey_potato, 123, 620, img_grey_potato.width / 7, img_grey_potato.height / 7);
            image(img_grey_potato, 323, 620, img_grey_potato.width / 7, img_grey_potato.height / 7);
            image(img_grey_potato, 523, 620, img_grey_potato.width / 7, img_grey_potato.height / 7);
          }
            break;

        case "食パン":
          if(keyCode==""){
            image(img_grey_bread, 130, 620, img_grey_bread.width / 8, img_grey_bread.height / 8);
            image(img_grey_bread, 330, 620, img_grey_bread.width / 8, img_grey_bread.height / 8);
            image(img_grey_bread, 530, 620, img_grey_bread.width / 8, img_grey_bread.height / 8);
          }
            break;
    }
}


// ******************************************
// Blockの関数　↓↓↓ 
// ------------- ブロックの生成　---------------
function createBlock(y) { 

    num = random(0, 3);　// 乱数とブロック落下レーンの生成
    if (num < 1) {
        dropX = 200;
    } else if (num < 2) {
        dropX = 400;
    } else if (num < 3) {
        dropX = 600;
    }

    return {
        x: dropX,
        y,
        vx: 0,
        vy: 0,
        g: 0.05
    }
}

// -------------- ブロック描画 ----------------
function drawBlock(entity) { 
  image(img_butter, entity.x-90,entity.y-88, img_butter.width / 3, img_butter.height /3);
}

// ------------ ブロックの重力生成 ---------------
function applyGravity(entity) {
    entity.y += 10;
}

// -------------- 範囲外・画面外ブロックの判定 ------------
function blockAlive(entity) {
    return 1000 > entity.y;  // 1000以内はtrue
}

// ------------- 範囲外ブロックの削除 --------------
function blockDelete(entity) {
    entity.y = 1000;
}

// リズムテンポを時間別で処理　↓↓↓　
function deleteSet1() {
  return time < 35;
}

function deleteSet2(entity) {
    return time < 54; // 開始55秒までset2テンポ
}

function deleteSet3(){
    return time < 1000
}


// ----------- timeカウント作成　--------------------
let time = 0;
let pathTime = 0.035;
let S = 0;

function timeCount(){
  if(S===0){
    S = 1;
  } else {
    S = 0;
  }
}


// ----------- リズムテンポset別の配列生成 ---------------
function makeSet1() { // テンポ１作成
    set1.push(createBlock(-100));
}

function makeSet2() { // + テンポ２作成
    set2.push(createBlock(-250));
}

function makeSet3(){
  set3.push(createBlock(-250));
}

// ----------- 衝突判定set　-------------

function colling(
    entity,
    collisionDistanceX,
    collisionDistanceY
) {

    let currentDistanceX = abs(400 - (entity.x-90));
    if (collisionDistanceX <= currentDistanceX) return false;

    let currentDistanceY = abs(700 - (entity.y-88));
    if (collisionDistanceY <= currentDistanceY) return false;

    return true;
}

// ------------ set別での衝突判定生成　---------------
function collKey(setNum){
  for(let block of setNum) {
    if(block.x == 200){
      if(colling(block, 300+100, 20+15-8) && keyCode == LEFT_ARROW){
        blockDelete(block);
        pointPlus();
        getEffect(200);
        keyCode=""
        poon.play();
      }
    }
    if(block.x == 400){
      if(colling(block, 300+100, 20+15-8) && keyCode == UP_ARROW){
        blockDelete(block);
        pointPlus();
        getEffect(400);
        keyCode=""
        poon.play();
      }
    }
    if(block.x == 600){
     if(colling(block, 300+100, 20+15-8) && keyCode == RIGHT_ARROW){
       blockDelete(block);
       pointPlus();
       getEffect(600);
       keyCode=""
       poon.play();
     }
   }
  }
}

// ----------- pointgetで光る ----------------
function getEffect(x){
  fill(255,255,0);
  circle(x, 700, 200, 50);
}

// -------------　プレイヤーLINE -----------------

function createPlayerLine() {　// ゲームの判定バー
  fill(0, 255, 0, 190);
  rect(400, 700, 600, 40);
}


// ----------- ポイントゲージ ------------------
let gagePosition=720;
let pointGage;
let pointGages=[]
function createGageBlock(x){
  return {
    x: gagePosition,
    y: 300,
    vx:0,
    vy:0
  }
}

let yellowCode =200;

function drawGage(entity){
  fill(255,255,yellowCode);
  rect(entity.x,255,20,50);
}

function addGage(){
  pointGages.push(createGageBlock(gagePosition));
  gagePosition += 25;
}

function pointPlus(){
  point += 1;
  yellowCode -= 30;
  if(point%15==0){
    addGage(pointGages);
  } 
}

// ---------- ライフゲージ　-----------------

let gagePosition2=1070;
let lifeGage;
let lifeGages=[];
function createLifeBlock(x){
  return {
    x: gagePosition2,
    y: 200,
    vx:0,
    vy:0
  }
}

function drawGage2(entity){
  fill(0);
  rect(entity.x,150,20,50);
}

function addGage2(){
  lifeGages.push(createLifeBlock(gagePosition2));
  gagePosition2 -= 25;
}

function minusLife(){
  minus += 1;
  addGage2(lifeGages);
}

// ----------- ポイントスペース描画　-------------

function drawPointSpace() { // ポイントスペース描画　x:600~900, y:800
    stroke(255);
    strokeWeight(5);
    line(100, 0, 100, canvasHeight);
    noStroke();

    stroke(255);
    strokeWeight(5);
    line(300, 0, 300, canvasHeight); // 線
    noStroke();

    stroke(255);
    strokeWeight(5);
    line(500, 0, 500, canvasHeight);
    noStroke();

    stroke(255);
    strokeWeight(5);
    line(700, 0, 700, canvasHeight);
    noStroke();

    // LIFE GAGE
    fill(150, 255, 0, 250);
    rect(900, 150, 350, 50); 　// 四角
    fill(255);
    textSize(30);
    text("LIFE GAGE", 800, 100);

    // POINT GAGE
    fill(255);
    textSize(30);
    text("POINT GAGE", 820, 200);

}

