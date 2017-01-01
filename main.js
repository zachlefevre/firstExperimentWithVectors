console.log("main.js loaded");

class Pvector{
    constructor(x_, y_){
        this.x = x_;
        this.y = y_;
    }
    add(pToAdd){
        this.x += pToAdd.x;
        this.y += pToAdd.y
    }
    sub(pToSub){
        this.x -= pToSub.x;
        this.y -= pToSub.y;
    }
    multiply(numToMult){
        this.x *= numToMult;
        this.y *= numToMult; 
    }
    divide(numToDiv){
        this.x /= numToDiv;
        this.y /= numToDiv;
    }
    magnitude(){
        return sqrt((this.x * this.x) + (this.y * this.y))
    }
    normalize(){
        var mag = this.magnitude();
        this.divide(mag);
    }

}

class Mover{
    constructor({x_,y_, vx, vy, ax, ay, topSpeed}){
        this.location = new Pvector(x_, y_);
        this.velocity = new Pvector(vx, vy);
        this.acceleration = new Pvector(ax, ay);
        this.topSpeed = topSpeed;
    }
    display(){
        stroke(0);
        fill(175);
        ellipse(this.location.x, this.location.y, 16, 16);
    }
    update(){
        this.location.add(this.velocity);
        this.velocity.add(this.acceleration);
    }
    checkForWalls(){
        if(this.location.x > width){
            this.velocity.x *= -1;
        }else if(this.location.x < 0){
            this.velocity.x *= -1;
        }

        if(this.location.y > height){
            this.velocity.y *=-1;
        }else if(this.location.y < 0){
            this.velocity.y *=-1;
        }
    }
    limit(max){
        if(this.velocity.magnitude() > this.topSpeed){
            this.velocity.normalize();
            this.velocity.multiply(this.topSpeed);
        }
    }
}

var ball;
var ballArr;

function setup(){

    var config = {
        apiKey: "AIzaSyAZodbztfznL2m-GychnIoUUM1eTtLfhgY",
        authDomain: "testproject-46fa0.firebaseapp.com",
        databaseURL: "https://testproject-46fa0.firebaseio.com",
        storageBucket: "testproject-46fa0.appspot.com",
        messagingSenderId: "895774418380"
    };
    firebase.initializeApp(config);

    createCanvas(innerWidth, innerHeight);
    ballArr = [];
    ball = new Mover(1,1, 3, -4, 0.1, 0.001, 13);
    background(0);
}

function draw(){
    var ref = firebase.database().ref('ballArr');
    if(mouseIsPressed){
        var moveInfo = {
            x_: mouseX,
            y_: mouseY,
            vx: random(-2,2),
            vy: random(-3,3),
            ax: random(-0.1,0.1),
            ay: random(-0.1,0.1),
            topSpeed: random(11)
        }
        ballArr.push(new Mover(moveInfo));
        ref.push(moveInfo);
    }
    for(var i = 0; i < ballArr.length; i++){
        ballArr[i].display();
        ballArr[i].update();
        ballArr[i].checkForWalls();
        ballArr[i].limit();
    }
}