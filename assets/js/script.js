// Constantes de interface

const menuScreen = document.getElementById("menuScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const interfaceGameScreen = document.getElementById("interfaceGameScreen");
const html = document.getElementsByTagName("html")[0];
const score = document.getElementById("score");
const life = document.getElementById("life");
const finalScore = document.getElementById("finalScore");
const highScore = document.getElementById("highScore");

// Constantes de sons

const laserSound = document.getElementById("laserSound");
const explosionSound = document.getElementById("explosionSound");
const damageSound = document.getElementById("damageSound");

// Constantes de controle

const ASG_SCORE = 10;    // Pontuacao por asteriode destruido
const INIT_LIFE = 3;     // Numero inicial de vidas
const RED_VELOCITY = 30; // Constante de aumento da velocidade do asteroid
const TIME_CREATE = 350; // Constante de criação de asteroides

// Variaveis de controle

var laserIndex = 0;
var asteroidIndex = 0;
var lifeCounter = INIT_LIFE;
var scoreCounter = 0;
var blackListAsteroid = []; 
var asteriodIntervalGenerate;
var asteroidVelocity = 6000;

// Classes dos elementos criados em tela durante o game

class Laser {
    constructor(index, startLaserX, startLaserY) {
        this.index = index.toString();
        this.startLaserX = startLaserX;
        this.startLaserY = startLaserY;
        this.laserBottom = parseInt($("#viewport").css("height").replace("px","")) - startLaserY;
    }

    laserShot() {        
        if (this.index != null && this.startLaserX != null && this.startLaserY != null){   
            this.laserCreate();

            const laser = document.getElementById("laser" + this.index);
            var laserColliderInterval = window.setInterval(laserColider, 8);

            function laserColider(){
                const laserLocation = laser.getBoundingClientRect();
                
                if(laserLocation.top < 0){
                    window.clearInterval(laserColliderInterval);
                    $(laser).remove();
                }
            }

        } else {
            if (this.index == null){
                throw "Invalid index value | class Laser"
            } else if (this.startLaserX == null){
                throw "Invalid startLaserX value | class Laser"
            } else if (this.startLaserY == null){
                throw "Invalid startLaserY value | class Laser"
            }
        }
    }

    laserCreate(){
        $("#viewport").append("<div class='laser' id= laser" + this.index + "></div>");
        $("#laser" + this.index).css("left", this.startLaserX);
        $("#laser" + this.index).css("bottom", this.laserBottom);
        laserSound.play();    
    }
}

class Asteroid {
    constructor(index, startAsteroidX, finishAsteroidY){
        this.index = index;
        this.startAsteroidX = startAsteroidX;
        this.finishAsteroidY = finishAsteroidY;
    }

    asteroidRender(){
        if(this.index != null && this.startAsteroidX != null && this.finishAsteroidY != null){
            this.asteroidCreate();
    
            const asteroid = document.getElementById("asteroid" + this.index);
            var translateasteroidY = parseInt(this.finishAsteroidY.replace("px",""));
            var asteroidColliderInterval = window.setInterval(asteroidColider, 8);
    
            
            function asteroidColider(){
                const asteroidLocation = asteroid.getBoundingClientRect();
                var colliderLaser = collider(asteroid, ".laser", 20);

                if(colliderLaser) {
                    updateScore();
                    explosionSound.play();
                }
               
                if(asteroidLocation.top > translateasteroidY - 60 || colliderLaser){
                    window.clearInterval(asteroidColliderInterval);
                    $(asteroid).remove();
                }
            }
        } else {
            if(this.index == null){
                throw "Invalid index value | class asteroid"
            } else if (this.startAsteroidX == null){
                throw "Invalid startAsteroidX value | class asteroid"
            } else if (this.finishAsteroidY == null){
                throw "Invalid finishAsteroidY value | class asteroid"
            }
        }
    }

    asteroidCreate(){
        $("#viewport").append("<div class='asteroid' id='asteroid" + this.index + "'></div>");
        $("#asteroid" + this.index).css("left", this.startAsteroidX);
    }
}

class Player {
    playerRender(){
        this.playerCreate();

        const player = document.getElementById("player");
        var playerColliderInterval = window.setInterval(playerColider, 8);

        addEventListener("mousemove", ({clientX}) => {
            player.style.transform = `rotate(270deg)`;
            $("#player").css("left", clientX);
        });

        function playerColider(){
            if(collider(player, ".asteroid", 40, blackListAsteroid)){
                damageSound.play();
                lifeCounter--;
                setLife();

                if(lifeCounter <= 0){
                    $(player).remove();
                    window.clearInterval(playerColliderInterval);
                }
            }
        }
    }

    playerCreate(){
        $('#viewport').append("<div class= 'box__player' id='player'> <div class='player' id='playerCharacter'></div> <div class='player__laser' id='startLaser'> </div> </div>");
    }
}

// Collisor de multiplos elementos

function collider(object, selectedClass, offsetBoxCollider = 0, blackList = null){
    const objectBoxCollider = object.getBoundingClientRect();
    
    const topCollider = objectBoxCollider.top - offsetBoxCollider;
    const bottomCollider = objectBoxCollider.bottom + offsetBoxCollider;
    const leftCollider = objectBoxCollider.left - offsetBoxCollider;
    const rightCollider = objectBoxCollider.right + offsetBoxCollider;

    var elementList = document.querySelectorAll(selectedClass);

    if(elementList.length > 0){
        for (element of elementList){
            const laserObject = document.getElementById(element.id);
            const laserValues = laserObject.getBoundingClientRect();
            if(
                laserValues.top >= topCollider && 
                laserValues.bottom <= bottomCollider &&
                laserValues.left >= leftCollider &&
                laserValues.right <= rightCollider &&
                !blackListCheck(blackList, element.id)
            ){
                return true;
            }
        }
    } 
    return false; 
}

function blackListCheck(blackList, objectID){
    if(blackList != null){
        if(blackList.length > 0){
            for(element of blackList){
                if(element == objectID){
                    return true;
                } 
            }
        }  
        blackList.push(objectID);  
    }
    return false;
}

// Criação aleatoria de asteroides 

function generateAsteroid(){
    var maxAsteroidPositionX = parseInt($("#viewport").css("width").replace("px", ""));
    var maxTranslateAsteroidY = $("#viewport").css("height");

    var asteroidPositionX = Math.floor(Math.random() * maxAsteroidPositionX);

    var asteroid = new Asteroid(asteroidIndex++, asteroidPositionX, maxTranslateAsteroidY );
    asteroid.asteroidRender();
}

// Elimina todos os asteroides

function destroyAsteroid(){
    var asteroidList = document.querySelectorAll(".asteroid");
    
    for(asteroid of asteroidList){
        const asteroidObject = document.getElementById(asteroid.id);
        $(asteroidObject).remove();
    }

    window.clearInterval(asteriodIntervalGenerate);
}

// Atualiza velocidade do asteroid

function updateAsteroidVel(){
    asteroidVelocity -= RED_VELOCITY;
    var newVelocity = (asteroidVelocity.toString()) + "ms";

    html.style.setProperty("--asteroidVelocity", newVelocity);
}

// Controle de vida e pontuacao

function setScore(){
    score.innerHTML = scoreCounter;
}

function updateScore(){
    scoreCounter += ASG_SCORE;
    setScore();
    updateAsteroidVel();
}

function setLife(){
    life.innerHTML = lifeCounter;

    if(lifeCounter == 0){
        gameOver();
    }
}

function resetValues(){
    laserIndex = 0;
    steroidIndex = 0;
    lifeCounter = INIT_LIFE;
    scoreCounter = 0;
    blackListAsteroid = [];
    asteriodIntervalGenerate;
    asteroidVelocity = 6000; 
}

// Salva a maior pontuação no game e retorna seu valor 

function getHighScore(currentScore){
    var highScore = localStorage.getItem("HighScore");
    
    if (highScore == null){
        localStorage.setItem("HighScore", currentScore);
        return currentScore; 
    } else if (currentScore >= highScore){
        localStorage.setItem("HighScore", currentScore);
        return currentScore; 
    } else {
        return highScore;
    }
}

// Gatilho do disparo de lasers
// Dispara um laser quando o botao esquerdo do mouse é clicado

$('#viewport').mousedown(function(e){
    if(e.which == 1){ 
        const playerLaser = document.getElementById("startLaser");
        var laserPosition = playerLaser.getBoundingClientRect();
        
        var laser = new Laser(laserIndex++, laserPosition.left, laserPosition.top);
        laser.laserShot();
    }
});

// Alterna a visibilidade das telas

function toggleMenu(element){
    for(let view of element){
        var property = $(view).css('display') == 'flex' ? "none" : "flex";
        view.style.setProperty("display", property);
    }
}

// Alterna a visibilidade do mouse

function toggleViewMouse(){
    var property = $("body").css("cursor") == "auto" ? "none" : "auto";
    $("body").css("cursor", property);
}

// Gerenciamento de telas de Inicio, Game e GameOver

function play(){
    destroyAsteroid();
    resetValues();
    setLife();
    
    toggleMenu([interfaceGameScreen, menuScreen]);
    toggleViewMouse();
    
    var maxTranslateLaserY = "-" + ($("#viewport").css("height"));
    var maxTranslateAsteroidY = $("#viewport").css("height");
    html.style.setProperty("--maxTranslateLaserY", maxTranslateLaserY);
    html.style.setProperty("--maxTranslateAsteroidY", maxTranslateAsteroidY);
    
    var player = new Player();
    player.playerRender();

    html.style.setProperty("--asteroidVelocity", asteroidVelocity.toString() + "ms");
    asteriodIntervalGenerate = window.setInterval(generateAsteroid, TIME_CREATE);
}

function retry(){
    resetValues();
    toggleMenu([gameOverScreen, menuScreen]);
}

function gameOver(){
    destroyAsteroid();
    $("#player").remove();

    finalScore.innerHTML = scoreCounter;
    highScore.innerHTML = getHighScore(scoreCounter);

    toggleMenu([gameOverScreen, interfaceGameScreen]);
    toggleViewMouse();
}


// Estado inicial da pagina

$(document).ready(() => {
    toggleMenu([gameOverScreen, interfaceGameScreen]);
});




// incluir funções de som
