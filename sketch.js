let block;
let blocks;
let canvasWidth;
let canvasHeight;
let dropX;
let num;
let tempo;
let set1;
let set2;
let point;
let img_pancake;
let img_bread;
let img_potato;
let img_grey_pancake;
let img_grey_bread;
let img_grey_potato;
let img_solt;
let img_maple;
let img_butter;
let gameState = "start";
let minus=0;

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
    sound = loadSound("Butter.mp3");
}



// ------------- setup, draw ---------------
//drawStartを付けたし（マツモト）
function setup() {
    canvasWidth = 900;
    canvasHeight = 800;
    createCanvas(canvasWidth + 200, canvasHeight);
    rectMode(CENTER);
    button_pancake = createButton("パンケーキ");
    button_potato = createButton("じゃがいも");
    button_bread = createButton("食パン");
    drawStart();

    tempo = [];
    set1 = [];
    set2 = [];
    point=0;
}

function draw() {
  print(time);
  if(gameState=="start"){
    button_pancake.mousePressed(clicked_pancake);
    button_potato.mousePressed(clicked_potato);
    button_bread.mousePressed(clicked_bread);
  } 
  else if(gameState=="play"){
    timeCount();
    if(time>5){
    rhythm();
    userIcon();
  } 
}
  else if(gameState=="gameover"){
    drawGameover();
  }
}

function rhythm() {
 
  background(0);  

// 1テンポ目  
  for (let block of set1) updatePosition(block);
  for (let block of set1)  applyGravity(block);

  if(frameCount % 32 === 1) makeSet1(); // ブロック等間隔で作成
  set1 = set1.filter(blockAlive); // 範囲外のブロック削除
  set1 = set1.filter(deleteSet1); // 35秒後にset1のブロック配列削除
  //print(time)

// 2テンポ目
if(time > 33){
  for (let block of set2) updatePosition(block);
  for (let block of set2)  applyGravity(block);

  if(frameCount % 32 === 1) makeSet2();
  set2 = set2.filter(blockAlive);
  set2 = set2.filter(deleteSet2);
}; 

// 衝突判定・キー判定
collKey(set1);
collKey(set2);

// 全エンティティの描画

  drawPointSpace();
  createPlayerLine();
  for (let block of set1) drawBlock(block);
  for (let block of set2) drawBlock(block);
  for (let pointGage of pointGages) drawGage(pointGage); 
  for (let lifeGage of lifeGages) drawGage2(lifeGage);
}

//スタート画面(マツモト)
function drawStart() {
    background(176, 196, 222, 192);
    fill(255);
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

// ------------ サウンド　------------------

let sound;


// *********************************
//-------------アイコン選択後 setup(高橋)------------

//----パンケーキが選択されたら(高橋)-----
function clicked_pancake() {
    icons = "パンケーキ";
    gameState="play"
    button_pancake.remove();
    button_bread.remove();
    button_potato.remove();
    sound.play();
}

//----じゃがいもが選択されたら(高橋)----
function clicked_potato() {
    icons = "じゃがいも";
    gameState="play"
    button_potato.remove();
    button_bread.remove();
    button_pancake.remove();
    sound.play();

}

//----食パンが選択されたら(高橋)----
function clicked_bread() {
    icons = "食パン";
    gameState="play"
    button_bread.remove();
    button_potato.remove();
    button_pancake.remove();
    sound.play();
}


// ------- ユーザーアイコン設定 ----------------
let a

function userIcon(){
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
  ;
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
  ;
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
  ;
  }
}


//矢印キーを離した時
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



function updatePosition(entity) {
    entity.x += entity.vx;
    entity.y += entity.vy;
    if(entity.y==800) {
      minusLife();
    }
    if(minus==15){
      gameState="gameover"
    }
}

// -------------　プレイヤーLINE -----------------

function createPlayerLine() {
    fill(0, 255, 0, 190);
    rect(400, 700, 600, 40);
}


// ------------- ブロック　---------------

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


function drawBlock(entity) {
    fill(712, 255, 30);
    rect(entity.x, entity.y, 200, 30);
}

function applyGravity(entity) {
    entity.y += 10;
}

function blockAlive(entity) {
    return 1000 > entity.y;  // 1000以内はtrue
}

function blockDelete(entity) {
    entity.y = 1000;
}


function deleteSet1() {
    return time < 35;　// 開始35秒はset1テンポ
}

function deleteSet2() {
    return time < 1000; // 開始100秒までset2テンポ
}

// ----------- リズム作成　--------------------

let time;

function timeCount() {
    time = millis() // タイム測定
    time = int(time / 1000); // 秒数
}

function makeSet1() { // テンポ１作成
    set1.push(createBlock(-100));
}

function makeSet2() { // テンポ２作成
    set2.push(createBlock(-100));
    set2.push(createBlock(-250));
}

// ----------- 衝突判定set　-------------

function colling(
    entity,
    collisionDistanceX,
    collisionDistanceY
) {

    let currentDistanceX = abs(400 - entity.x);
    if (collisionDistanceX <= currentDistanceX) return false;

    let currentDistanceY = abs(700 - entity.y);
    if (collisionDistanceY <= currentDistanceY) return false;

    return true;
}

function collKey(setNum){
  for(let block of setNum) {
    if(block.x == 200){
      if(colling(block, 300+100, 20+15-10) && keyCode == LEFT_ARROW){
        blockDelete(block);
        pointPlus();
        keyCode=""
      }
    }
    if(block.x == 400){
      if(colling(block, 300+100, 20+15-10) && keyCode == UP_ARROW){
        blockDelete(block);
        pointPlus();
        keyCode=""
      }
    }
    if(block.x == 600){
     if(colling(block, 300+100, 20+15-10) && keyCode == RIGHT_ARROW){
       blockDelete(block);
       pointPlus();
       keyCode=""
     }
   }
  }
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

function drawGage(entity){
  fill(255);
  rect(entity.x,255,20,50);
}

function addGage(){
  pointGages.push(createGageBlock(gagePosition));
  gagePosition += 25;
}

function pointPlus(){
  point += 1;
  if(point%5==0){
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
// ----------- ゲームオーバー　------------------

function drawGameover(){
  print("a")
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