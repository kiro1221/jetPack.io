/** @type {HTMLCanvasElement}*/
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width = window.innerWidth
const canvasHeight = canvas.height = window.innerHeight
//player images
const playerImage = new Image();
playerImage.src = 'jetpack.png'
//coin
const coins = new Image();
coins.src = 'Coins.png'
//background images
const bgImage1 = new Image();
bgImage1.src = 'space.bg.jpeg'
const bgImage2 = new Image();
bgImage2.src = 'space.bg.jpeg'
//missile
const missileImg = new Image();
missileImg.src = 'missile.png'
//Health
const healthImg = new Image();
healthImg.src = 'Health.png'
let score = 0;
let numberOfCoins = 15
let allCoins =[]
class Bg{
    constructor(){
        this.x = 0
        this.y = 0
        this.width = canvasWidth
        this.height = canvasHeight
        this.image = bgImage1
        this.speed = 10
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
    }
    update(){   
    this.draw()
    if (this.x <= -this.width) {
            this.x = 0;
        }
        this.x = Math.floor(this.x - this.speed);
    }    
}
const layer1 = new Bg(bgImage1)  
const layer2 = new Bg(bgImage2)
const allLayer = [layer1, layer2]
class Player {
    constructor(){
        this.x = 400
        this.y = 0
        this.velocityY = 100
        this.gravity = 0.5
        this.speed = 10
        this.width = 160
        this.height = 200
        this.image = playerImage
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    update(){
        this.draw()
        this.y += this.velocityY
        if(this.y + this.height + this.velocityY <= canvasHeight){
            this.velocityY += this.gravity
        } else this.velocityY = 0  
        if(this.y + this.velocityY <= 0){
            this.velocityY = 0 + 2
        }
    }
}
const player = new Player()
addEventListener('keydown', ({keyCode}) => {
    switch(keyCode){
        case 32: //up
            player.velocityY -= player.speed
        break;
    }
})
class Missile{
    constructor(){ 
        this.width = 90
        this.height = 60
        this.x =  screen.width - 100
        this.y = Math.floor(Math.random() * screen.height)
        this.image = missileImg
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    update(){
        this.draw()
        this.x -= 15
	}
}
const missile = new Missile()
function regenerateMissiles() {
    if(missile.x < 0){
        missile.x = screen.width - 100
        missile.y = Math.random() * screen.height - missile.height
    }
}
class Coin{
    constructor(){ 
        this.x =  800
        this.y =  500
        this.width = 30
        this.height = 35
        this.image = coins
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    update(){
        this.x -= 8
	}
}
let coin = new Coin()  
function regenerateCoins(){
    let pos = [0,100.150,200,250,300,350,400,450,500,550,600,650,700,750,800,850,900]
    let random = pos[Math.floor(Math.random() * pos.length)];
    for(let i = 0; i < numberOfCoins; i++){
        allCoins.push(new Coin())
        allCoins.forEach(coin => {
            coin.y = random
        })
        allCoins.forEach(coin =>{
            coin.x += 40
        })
    }
}
function collision() {
    allCoins.forEach((coin, index) => {
        if(player.x + player.width >= coin.x &&
            player.x + player.width <= coin.x + coin.width&&
			player.y + player.height >= coin.y &&
            coin.y >= player.y){
            score += 1
			allCoins.splice(index, 1)
        }
		if (coin.x <= 0){
			allCoins.splice(index, 1)
		}
    })  
    if(player.x + player.width === missile.x - missile.width + 150&&
        player.y + player.height >= missile.y &&
        missile.y >= player.y){
            alert(`You lost with a score of ${score}`)
            document.location.reload();
    }
}
function drawScore() {
    ctx.font = "23px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 15, 40);
} 
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    allLayer.forEach(layer => {
        layer.update()
    })
    allCoins.forEach(coin => {   
        coin.draw()
        coin.update()
    })
    if(allCoins.length == 0){
        regenerateCoins()     
    }
    missile.update()
    player.update()    
    collision();
    regenerateMissiles()
    drawScore();            
    requestAnimationFrame(animate)
}
animate()
