	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	canvas.style.background = "#F5EAD5";


    var restartButton = document.querySelector('#restart');
    restartButton.style.display = "none";

	var scoreCount = 0;
	var gameover = document.querySelector('#gameover');
	var score = document.querySelector('#score');
	var displayScore = document.querySelector('#displayScore');

	var platformHeight = 10;
	var platformWidth = 64;
	var platformX = (canvas.width-platformWidth)/2;

	var rightArrowPressed = false;
	var leftArrowPressed = false;

	var x = canvas.width/2;
	var y = canvas.height-16;
	var deltaX = 2;
	var deltaY = -2;
	var ballRadius = 6;

	var RowCount = 9;
	var ColumnCount = 5;
	var blockWidth = 70;
	var blockHeight = 20;
	var blockPadding = 10;
	var blockOffsetTop = 30;
	var blockOffsetLeft = 30;
    
    restartButton.addEventListener("click", function() {
        window.location.reload();
    })

	var random = function(){
	return 'rgb(' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ')';
}

	var blocks = [];
	for(c=0; c<ColumnCount; c++) {
    	blocks[c] = [];
    for(r=0; r<RowCount; r++) {
        blocks[c][r] = { x: 0, y: 0, visible: 1, color : random()};
    }
}

	function drawBall(ballColor) {
		ctx.beginPath();
		ctx.arc(x, y, ballRadius, 0, Math.PI*2);
		ctx.fillStyle = ballColor;
		ctx.fill();
		ctx.closePath();
	}

	function drawplatform() {
    ctx.beginPath();
    ctx.rect(platformX, canvas.height-platformHeight, platformWidth, platformHeight);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
	}


function drawblocks() {
    for(c=0; c<ColumnCount; c++) {
      for(r=0; r<RowCount; r++) {
        if(blocks[c][r].visible === 1) {
            var blockX = (15 + c*(blockWidth+blockPadding))+blockOffsetLeft;
            var blockY = (15 + r*(blockHeight+blockPadding))+blockOffsetTop;
            blocks[c][r].x = blockX;
            blocks[c][r].y = blockY;
            ctx.beginPath();
            ctx.rect(blockX, blockY, blockWidth, blockHeight);
            ctx.fillStyle = blocks[c][r].color;
            ctx.fill();
            ctx.closePath();
        	}
        }
    }
}

	function keyDownHandler(e) {
    if(e.keyCode === 39) {
        rightArrowPressed = true;
    }
    else if(e.keyCode === 37) {
        leftArrowPressed = true;
    	}
	}

function keyUpHandler(e) {
    if(e.keyCode === 39) {
        rightArrowPressed = false;
    }
    else if(e.keyCode === 37) {
        leftArrowPressed = false;
    }
}

function collisionDetection() {
    for(c=0; c<ColumnCount; c++) {
        for(r=0; r<RowCount; r++) {
            var b = blocks[c][r];
            if(b.visible === 1) {
            	if(x > b.x && x < b.x+blockWidth && y > b.y && y < b.y+blockHeight) {
					drawBall("red");
                	deltaY = -deltaY;
                	b.visible = 0;
                	scoreCount += 5;
                	displayScore.innerHTML = "Score:" +' '+ scoreCount;
                }	
            }
        }
    }
}

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawblocks();
		drawBall("green");
		drawplatform();
		collisionDetection();

		
    if(x + deltaX > canvas.width-ballRadius || x + deltaX < ballRadius) {
    	drawBall("red");
        deltaX = -deltaX;
    }
    if(y + deltaY < ballRadius) {
    	drawBall("red");
        deltaY = -deltaY;
    }
    else if(y + deltaY > canvas.height-ballRadius) {
        if(x > platformX && x < platformX + platformWidth) {
        	drawBall("red");
           
            deltaY = -1.09*deltaY;
        }
        else {
            return displayScore.innerHTML ="",
        	gameover.innerHTML = "GAME OVER!",
        	score.innerHTML = "You scored" +' ' + scoreCount +' ' + 'points!',
            restartButton.style.display = "inline";
        }
    }	

		if(rightArrowPressed && platformX < canvas.width-platformWidth) {
    	platformX += 4;
		}
		else if(leftArrowPressed && platformX > 0) {
    	platformX -= 4;
		}
		
		x += deltaX;
    	y += deltaY;

	}
	  
    draw();

    var start = function(){
        setInterval(draw, 10);   
    }

    setTimeout(start, 1500);
