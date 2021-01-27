const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const left = 1,
      right = 2,
      up = 3,
      down = 4;
const block = 30;
var speed = 0.5;
let pause = false;

window.addEventListener('keydown', this.moveSnake, false);

var maxx = block;
var maxy = block;

while (window.innerWidth > maxx) {
    maxx += block;
}
while (window.innerHeight - 2 * block > maxy) {
    maxy += block;
}

maxx -= 2 * block;
maxy - +2 * block;
canvas.width = maxx;
canvas.height = maxy;

let midx = maxx / 2;
let midy = maxy / 2;

let coordinate = function(x, y) { return { x: x, y: y }; };

let generateFood = function(tailArray) {
    let p = coordinate(Math.random() * ((maxx - block) / block), Math.random() * ((maxy - block) / block));
    p.x = Math.floor(p.x) * block;
    p.y = Math.floor(p.y) * block;
    for (let i = 0; i < tailArray.length; ++i) {
        if (tailArray[i].x === p.x && tailArray[i].y === p.y) {
            return generateFood(tailArray);
        }
    }
    return p;
};

let arr = [];
let fp = generateFood(arr);

function Snake(x, y, direction, head_color, tail_color) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.head_color = head_color;
    this.tail_color = tail_color;
    this.tail = [];

    let foodEated = false;

    this.addCoordianateOnFoodEat = function(){
        //eat food
        if (fp.x === this.x && fp.y === this.y) {
            if (this.tail.length === 0) {
                if (this.direction === left) this.tail.push(coordinate(fp.x + block, fp.y));
                else if (this.direction === right) this.tail.push(coordinate(fp.x - block, fp.y));
                else if (this.direction === up) this.tail.push(coordinate(fp.x, fp.y + block));
                else if (this.direction === down) this.tail.push(coordinate(fp.x, fp.y - block));
            }
            else foodEated = true;
            fp = generateFood(this.tail);
        }
    }

    this.leftClick = function() {
        if (this.direction != right && this.direction != left) {
            this.direction = left;
            this.x -= speed * block;
            this.addCoordianateOnFoodEat();
        }
    };
    this.upClick = function() {
        if (this.direction != down && this.direction != up) {
            this.direction = up;
            this.y -= speed * block;
            this.addCoordianateOnFoodEat();
        }
    };
    this.rightClick = function() {
        if (this.direction != left && this.direction != right ) {
            this.direction = right;
            this.x += speed * block;
            this.addCoordianateOnFoodEat();
        }
    };
    this.downClick = function() {
        if (this.direction != up && this.direction != down ) {
            this.direction = down;
            this.y += speed * block;
            this.addCoordianateOnFoodEat();
        }
    };
    this.draw = function() {
        c.beginPath();
        c.ellipse(this.x + (block / 2), this.y + (block / 2), block / 2, block / 1.5, 0, 0, 2 * Math.PI, false);
        c.fillStyle = this.head_color;
        c.fill();
        c.stroke();
    };

    this.update = function() {
        let lastCordinate;
        //tail coordinates
        if (foodEated === true && this.tail.length > 0) {
            let lastIndex = this.tail.length - 1;
            let x = this.tail[lastIndex].x;
            let y = this.tail[lastIndex].y;
            lastCordinate = { x, y };
        }

        for (let i = this.tail.length - 2; i >= 0; i--) {
            this.tail[i + 1].x = this.tail[i].x;
            this.tail[i + 1].y = this.tail[i].y;
        }

        if (this.tail.length > 0) {
            this.tail[0].x = this.x;
            this.tail[0].y = this.y;
        }
        if (foodEated === true) {
            this.tail.push(lastCordinate);
            foodEated = false;
        }

        if (this.direction === left) this.x -= speed * block;
        else if (this.direction === right) this.x += speed * block;
        else if (this.direction === up) this.y -= speed * block;
        else if (this.direction === down) this.y += speed * block;

        this.addCoordianateOnFoodEat();
        if (this.x >= maxx) {
            this.x = 0;
        }
        else if (this.x < 0) {
            this.x = maxx;
        }

        if (this.y < 0) {
            this.y = maxy;
        }
        else if (this.y >= maxy) {
            this.y = 0;
        }
        this.addCoordianateOnFoodEat();

        //self touch check
        for (let i = 0; i < this.tail.length; ++i) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                while (this.tail.length > 0) this.tail.pop();
            }
        }
        //add tail
        for (let i = 0; i < this.tail.length; ++i) {
            c.beginPath();
            c.arc(this.tail[i].x + (block / 2), this.tail[i].y + (block / 2), block / 2, 0, Math.PI * 2);
            c.fillStyle = this.tail_color;
            c.fill();
        }
        this.draw();
    };
}

let s1p = coordinate((midx + (maxx / 3)) / block, midy / block);
s1p.x = block * (Math.floor(s1p.x));
s1p.y = block * (Math.floor(s1p.y));

let s2p = coordinate((maxx / 3) / block, midy / block);
s2p.x = block * (Math.floor(s2p.x));
s2p.y = block * (Math.floor(s2p.y));

let snakeA = new Snake(s1p.x, s1p.y, right, 'red', 'grey');
let snakeB = new Snake(s2p.x, s2p.y, up, 'green', 'cyan');

function moveSnake(e) {
    var code = e.keyCode;
    switch (code) {
        case 37:
            snakeA.leftClick();
            break; //Left key
        case 38:
            snakeA.upClick();
            break; //Up key
        case 39:
            snakeA.rightClick();
            break; //Right key
        case 40:
            snakeA.downClick();
            break; //Down key
        case 65:
            snakeB.leftClick();
            break; //A key
        case 87:
            snakeB.upClick();
            break; //W key
        case 68:
            snakeB.rightClick();
            break; //D key
        case 83:
            snakeB.downClick();
            break; //S key
        case 32:
            if (pause) {
                pause = false;
                screen();
            }
            else { pause = true; }
            break; //Space key
    }
}

let fps = 15;
let now;
let then = Date.now();
let interval = 1000 / fps;
let delta;

function screen() {
    if (!pause) {
        requestAnimationFrame(screen);
    }
    now = Date.now();
    delta = now - then;

    if (delta > interval) { //Used to set the frame rate...
        then = now - (delta % interval);
        c.clearRect(0, 0, maxx, maxy);

        //snake
        c.beginPath();
        c.fillStyle = '#f44198';
        c.arc(fp.x + (block / 2), fp.y + (block / 2), block / 2, 0, Math.PI * 2);
        c.fill();
        c.stroke();
        c.fillStyle = 'rgba(0,70,100,255)';
        snakeA.update();
        snakeB.update();
    }
}
screen();
// apache50 start directory