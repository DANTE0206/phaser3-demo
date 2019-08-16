// 游戏主逻辑
'use strict';

import Phaser from "phaser";
import sky from "./assets/sky.png";
import logo from "./assets/logo.png";
import ground from "./assets/platform.png";
import star from "./assets/star.png";
import baddie from "./assets/baddie.png";
import diamond from "./assets/diamond.png";

var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;

// let welcomeScene = new Phaser.Class({
//   Extends: Phaser.Scene,
//   initialize: function welcomeScene() {
//     Phaser.Scene.call(this, { key: 'welcomeScene' });
//   },
//   // 预加载资源
//   preload: function () {
//     this.load.image("logo", logo);
//   },
//   create: function () {
//     const logo = this.add.image(400, 150, 'logo');
//     this.tweens.add({
//       targets: logo,
//       y: 450,
//       duration: 2000,
//       ease: "Power2",
//       yoyo: true,
//       loop: -1
//     });
//     this.add.image(200, 300, diamond, function () {
//       this.scene.start('gameScene');
//     }, this);
//   }
// });

function collectStar(player, star) {
  star.kill();

  score += 10;
  scoreText.text = 'Score: ' + score;
}

let gameScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function gameScene() {
    Phaser.Scene.call(this, { key: 'gameScene' });
  },
  preload: function () {
    this.load.image('sky', sky);
    this.load.image('ground', ground);
    this.load.image('star', star);
    this.load.spritesheet('baddie', baddie, { frameWidth: 32, frameHeight: 24 })
  },
  create: function () {
    console.log('=======')
    console.log(this)
    console.log('=======')
    // this.physics.startSystem(Phaser.Physics.ARCADE);
    this.add.sprite(0, 0, 'sky');
    platforms = this.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, this.game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    player = this.add.sprite(32, this.world.height - 150, 'baddie');
    this.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.add.group();
    stars.enableBody = true;
    for (var i = 0; i < 12; i++) {
      var star = stars.create(i * 70, 0, 'star');
      star.body.gravity.y = 300;
      star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
  },
  update: function () {
    this.physics.arcade.collide(player, platforms);
    this.physics.arcade.collide(stars, platforms);
    this.physics.arcade.overlap(player, stars, collectStar, null, this);

    player.body.velocity.x = 0;
    if (cursors.left.isDown) {
      player.body.velocity.x = -150;
      player.animations.play('left');
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 150;
      player.animations.play('right');
    } else {
      player.animations.stop();
      player.frame = 4;
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.body.velocity.y = -350;
    }
  }
})

let config = {
  type: Phaser.CANVAS,
  width: 800,
  height: 600,
  scene: [gameScene]
}

new Phaser.Game(config);
// window.customGame.scene.add('gameScene', gameScene)