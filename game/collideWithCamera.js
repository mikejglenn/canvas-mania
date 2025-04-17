Phaser.Physics.Arcade.Body.prototype.checkCameraBounds = function() {
  var pos = this.position;
  var bounds = {
    x: this.game.camera.x,
    y: this.game.camera.y,
    right: this.game.camera.x + this.game.width,
    bottom: this.game.camera.y + this.game.height
  };
  var check = this.game.physics.arcade.checkCollision;

  if (this.velocity.x !== 0) {
    if (pos.x < bounds.x && check.left) {
      pos.x = bounds.x;
      this.velocity.x *= -this.bounce.x;
      this.blocked.left = true;
    } else if (this.right > bounds.right && check.right) {
      pos.x = bounds.right - this.width;
      this.velocity.x *= -this.bounce.x;
      this.blocked.right = true;
    }
  }
  /*
  //if (this.velocity.y !== 0) {
    if (pos.y < bounds.y && check.up) {
      pos.y = bounds.y;
      this.velocity.y *= -this.bounce.y;
      this.blocked.up = true;
    } /*else if (this.bottom > bounds.bottom && check.down) {
      pos.y = bounds.bottom - this.height;
      this.velocity.y *= -this.bounce.y;
      this.blocked.down = true;
    }*/
  //}*/
};
