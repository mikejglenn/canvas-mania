(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _enemiesGenericEnemy = require('../enemies/GenericEnemy');

var _enemiesGenericEnemy2 = _interopRequireDefault(_enemiesGenericEnemy);

var Crawler = (function (_GenericEnemy) {
  _inherits(Crawler, _GenericEnemy);

  function Crawler(game, x, y, data) {
    _classCallCheck(this, Crawler);

    _get(Object.getPrototypeOf(Crawler.prototype), "constructor", this).call(this, game, x, y);
    //this.type = data.type;
    this.animations.add("zoomer", ["zoomer/yellow0", "zoomer/yellow1"], 10, true);
    this.animations.add("zoomerHard", ["zoomer/red0", "zoomer/red1"], 10, true);
    this.animations.add("zeela", ["zeela/blue0", "zeela/blue1"], 10, true);
    this.animations.add("zeelaHard", ["zeela/green0", "zeela/green1"], 10, true);

    this.defrostAnimation = this.animations.add("freeze", ["zoomer/frozen0", "zoomer/yellow0"], 25, true);
    this.body.setSize(16, 16, 0, 0);
    this.speed = 50;
    this.gridCoords = {
      x: 0,
      y: 0
    };
    this.tween = null;
  }

  _createClass(Crawler, [{
    key: "spawn",
    value: function spawn(x, y, enemy, data) {
      // Om knallröd: dö av missil eller skruvattack
      //  console.log(x,y);
      this.subtype = enemy.subtype ? "Hard" : "";
      this.type = enemy.type;
      this.play(enemy.type + this.subtype);

      console.log(enemy);
      //  debugger;

      this.stdReset(x, y);
      this.gridCoords = {
        x: Math.floor(this.x / 16),
        y: Math.floor(this.y / 16)
      };
      this.x = this.gridCoords.x * 16 + 8;
      this.y = this.gridCoords.y * 16 + 8;
      //  this.attach();
      this.clockWise = this.gridCoords.y % 2 === 0 ? -1 : 1;
      this.attach();
      this.tweenDelay = 16 / this.speed * 1000;
    }
  }, {
    key: "update",
    value: function update() {
      if (!this.stdUpdate()) {
        return;
      }
      /* Skjuta bort mark:
       Kolla hela tiden attached to tex (0,-1) och om borta, börja rotera tills 0,-1 finns eller annan träff
       */

      if (!this.tween || !this.tween.isRunning) {
        //    console.log(this.angle);
        this.checkDirection();
        switch (this.angle) {
          case 90:
            this.tween = this.game.add.tween(this).to({
              y: this.y + 16 * this.clockWise
            }, this.tweenDelay).start();
            break;
          case -180:
            this.tween = this.game.add.tween(this).to({
              x: this.x - 16 * this.clockWise
            }, this.tweenDelay).start();
            break;
          case -90:
            this.tween = this.game.add.tween(this).to({
              y: this.y - 16 * this.clockWise
            }, this.tweenDelay).start();
            break;
          case 0:
            this.tween = this.game.add.tween(this).to({
              x: this.x + 16 * this.clockWise
            }, this.tweenDelay).start();
            break;
        }
      }

      //this.angle++;
    }
  }, {
    key: "checkDirection",
    value: function checkDirection() {
      this.gridCoords = {
        x: Math.floor(this.x / 16),
        y: Math.floor(this.y / 16)
      };
      switch (this.angle) {
        case 90:
          if (!this.checkWall(-1, 0)) {
            // Tappat mark:
            this.angle += 90 * this.clockWise;
          } else if (this.checkWall(0, 1 * this.clockWise)) {
            // Krock:
            this.angle -= 90 * this.clockWise;
          }
          break;
        case -180:
          if (!this.checkWall(0, -1)) {
            // Tappat mark:
            this.angle += 90 * this.clockWise;
          } else if (this.checkWall(-1 * this.clockWise, 0)) {
            // Krock:
            this.angle -= 90 * this.clockWise;
          }
          break;
        case -90:
          if (!this.checkWall(1, 0)) {
            // Tappat mark:
            this.angle += 90 * this.clockWise;
          } else if (this.checkWall(0, -1 * this.clockWise)) {
            // Krock:
            this.angle -= 90 * this.clockWise;
          }
          break;
        case 0:
          if (!this.checkWall(0, 1)) {
            // Tappat mark:
            this.angle += 90 * this.clockWise;
          } else if (this.checkWall(1 * this.clockWise, 0)) {
            // Krock:
            this.angle -= 90 * this.clockWise;
          }
          break;

      }
    }
  }, {
    key: "attach",
    value: function attach() {
      this.gridCoords = {
        x: Math.floor(this.x / 16),
        y: Math.floor(this.y / 16)
      };

      if (this.checkWall(0, 1)) {
        // Attach down
        this.angle = 0;
      } else if (this.checkWall(-1, 0)) {
        // Attach left
        this.angle = 90;
      } else if (this.checkWall(1, 0)) {
        // Attach right
        this.angle = -90;
      } else if (this.checkWall(0, -1)) {
        // Attach up
        this.angle = -180;
      }
    }
  }, {
    key: "checkWall",
    value: function checkWall(x, y) {
      var tile = metroid.map.getTile(this.gridCoords.x + x, this.gridCoords.y + y, metroid.ground);
      if (tile !== null && tile.index > 1) {
        return true;
      }
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = metroid.blocks.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var block = _step.value;

          if (block.exists && block.x / 16 === this.gridCoords.x + x && block.y / 16 === this.gridCoords.y + y) {
            return true;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return false;
      //tile.index+=1;
      //metroid.map.putTile(tile, this.gridCoords.x+x,this.gridCoords.y+y, metroid.ground);
    }
  }]);

  return Crawler;
})(_enemiesGenericEnemy2["default"]);

exports["default"] = Crawler;
module.exports = exports["default"];

},{"../enemies/GenericEnemy":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GenericEnemy = (function (_Phaser$Sprite) {
  _inherits(GenericEnemy, _Phaser$Sprite);

  function GenericEnemy(game, x, y) {
    _classCallCheck(this, GenericEnemy);

    _get(Object.getPrototypeOf(GenericEnemy.prototype), "constructor", this).call(this, game, x + 3, y, "sprites");
    this.exist = false;
    this.alive = false;
    this.anchor.setTo(0.5, 0.5);

    // Body
    this.game.physics.enable(this);
    this.body.allowGravity = false;
    this.body.immovable = true;
    // Vulnerabilities
    this.vulnerabilities = {
      normal: 1,
      icebeam: 1,
      wave: 1,
      bomb: 1,
      missile: 1000,
      screwattack: 1000
    };

    // Explosions
    var anim = this.animations.add("stdBoom", ["boom/boom0", "boom/boom1", "boom/boom2"], 15, false);
    anim.onComplete.add(this.death, this);
    // Frozen stuff
    this.noUnfreeze = false;
    this.noFreeze = false;
    this.frozen = false;
    this.freezeData = {
      /*velocity: {
        x: 0,
        y: 0
      },*/
      animation: {
        name: null,
        frame: null
      },
      defrostAnimation: null,
      event: false,
      defrostCnt: -1
    };

    // Other stuff
    this.maxEnergy = 1;
    this.energy = 0;
    this.customEvent = null;
    this.dying = false;
    this.damage = 8;

    this.hurtSound = 1;
    this.tween = null;

    this.adjust = null;

    this.ignorant = true; // Känner inte till om att röra sig.
  }

  _createClass(GenericEnemy, [{
    key: "stdReset",
    value: function stdReset(x, y) {
      x += this.body.width / 2;
      y -= this.body.height / 2;

      if (this.adjust) {
        var tmpCoords = this.adjustPosition(x, y);
        x = tmpCoords.x;
        y = tmpCoords.y;
      }
      if (this.freezeData.event) {
        this.game.time.events.remove(this.freezeData.event);
      }
      this.freezeEvent = null;
      if (this.customEvent) {
        this.game.time.events.remove(this.customEvent);
      }
      this.customEvent = null;
      if (this.tween && this.tween.isRunning) {
        this.tween.stop();
      }

      this.reset(x, y);
      /*this.x = x;
      this.y = y;
      this.body.position.x = x;
      this.body.position.y = y;*/

      this.frozen = false;
      this.body.immovable = true; // ???
      this.body.moves = true; // ???
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
      this.body.acceleration.x = 0;
      this.body.acceleration.y = 0;
      this.energy = this.maxEnergy;
      this.exists = true;
      this.alive = true;
      this.dying = false;
      this.hurtTimer = 0;
      this.ignorant = true;
    }
  }, {
    key: "stdUpdate",
    value: function stdUpdate() {

      if (!this.exists || !this.alive || this.dying || this.game.physics.arcade.isPaused) {
        return false;
      }

      if (this.ignorant) {
        // Om inte sett samus
        if (this.inCamera) {
          this.ignorant = false;
        } else {
          return false;
        }
      }

      if (this.freezeData.defrostCnt >= 0) {
        //    console.log(this.freezeData.defrostCnt);

        this.defrost();
        return false; //No need to check, not frozen or defrosting
      }

      if (this.frozen) {
        return false;
      }

      if (this.hurtTimer > this.game.time.now) {
        this.play("hurt");
        this.body.moves = false;
        return;
      }
      if (this.hurtTimer !== 0) {
        this.play("fly0");
        this.body.moves = true;
        this.hurtTimer = 0;
      }

      return true; // Continue update-loop
    }
  }, {
    key: "hit",
    value: function hit(bullet, overrideIce) {
      if (this.dying) {
        return;
      }
      if (bullet.type === "icebeam" && !this.noFreeze && !overrideIce) {
        this.freeze(bullet);
      }
      this.energy -= this.vulnerabilities[bullet.type];
      if (this.vulnerabilities[bullet.type] === 0) {
        this.game.sound.play('ricochetShort');
      } else {
        this.hurtTimer = this.game.time.now + 100;
        metroid.soundEffects["enemyHurt" + this.hurtSound].play();
      }
      if (this.energy < 1) {
        //  console.log("died:",this);
        this.dying = true;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        if (this.tween && this.tween.isRunning) {
          this.tween.stop();
        }
        this.body.allowGravity = false;
        if (this.freezeData.event) {
          this.game.time.events.remove(this.freezeData.event);
        }
        this.freezeEvent = null;
        if (this.customEvent) {
          this.game.time.events.remove(this.customEvent);
        }
        this.customEvent = null;
        this.play("stdBoom");
      }
    }
  }, {
    key: "freeze",
    value: function freeze(bullet) {
      var F = this.freezeData;
      var anim = undefined;
      //  console.log(this.noFreeze, this.frozen, this.noUnfreeze);
      if (this.noFreeze || this.frozen && this.noUnfreeze) {
        if (this.frozen) {
          this.game.sound.play('ricochetShort');
        }
        return;
      }
      if (this.frozen) {
        this.defrost(bullet);
        return;
      }
      /*F.velocity = {
        x: (this.body.velocity.x !== 0) ? this.body.velocity.x : F.velocity.x,
        y: (this.body.velocity.y !== 0) ? this.body.velocity.y : F.velocity.y
      };*/
      //this.body.moves = false;

      F.animation = this.animations.currentAnim.name;
      if (F.event) {
        this.game.time.events.remove(F.event);
      }
      F.event = this.game.time.events.add(Phaser.Timer.SECOND * 10, function () {
        //this.frozen = false;
        this.play("freeze"); // START?
        F.defrostCnt = 0;
        this.defrost();
      }, this);
      anim = this.play("freeze");
      anim.restart();
      anim.stop();
      //    console.log(anim);
      this.frozen = true;
      this.energy += this.vulnerabilities[bullet.type]; // UNDO Damage...
      //this.body.immovable = true;
      this.body.moves = false; // kan ersätta manipulerad hastighet???
      if (this.tween && this.tween.isRunning) {
        this.tween.pause();
      }
    }
  }, {
    key: "defrost",
    value: function defrost(bullet) {
      var F = this.freezeData;
      if (!bullet && F.defrostCnt++ < 25) {
        return;
      }
      this.play(F.animation);
      this.body.moves = true;
      if (this.tween && this.tween.isRunning) {
        this.tween.resume();
      }
      //  console.log(F);
      //this.body.velocity.x = F.velocity.x;
      //this.body.velocity.y = F.velocity.y;
      if (F.event) {
        //    console.log(F.event);
        this.game.time.events.remove(F.event);
      }
      F.event = false;
      this.frozen = false;
      F.defrostCnt = -1;
      /*F.velocity.x = 0;
      F.velocity.y = 0;*/
      //this.body.immovable = false; // ONÖDIG?
      this.body.moves = true; // ONÖDIG?
      if (bullet && bullet.type === "icebeam") {
        this.hit(bullet, true);
      }
      //    console.log(this.animations.frame);
    }
  }, {
    key: "death",
    value: function death() {
      if (!this.dying) {
        return;
      }

      metroid.pickups.createNew(this.x, this.y, "random");
      this.exists = false;
      this.alive = false;
    }
  }, {
    key: "adjustPosition",
    value: function adjustPosition(x, y) {
      //  console.log(y,this.body.height);
      y += this.body.height - 16;

      return { x: x, y: y };
    }
  }]);

  return GenericEnemy;
})(Phaser.Sprite);

exports["default"] = GenericEnemy;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _enemiesGenericEnemy = require('../enemies/GenericEnemy');

var _enemiesGenericEnemy2 = _interopRequireDefault(_enemiesGenericEnemy);

var Kraid = (function (_GenericEnemy) {
  _inherits(Kraid, _GenericEnemy);

  function Kraid(game, x, y, data) {
    _classCallCheck(this, Kraid);

    _get(Object.getPrototypeOf(Kraid.prototype), "constructor", this).call(this, game, x, y);
    //this.type = data.type;
    this.animations.add("walk", ["kraid/walk0", "kraid/walk1"], 5, true);
    this.animations.add("fake", ["kraid/fake0", "kraid/fake1"], 5, true);
    this.animations.add("hurt", ["kraid/hurt0", "kraid/hurt1"], 5, true);
    this.noFreeze = true;
    console.log("KON KRAID");
    this.maxEnergy = 100;
  }

  _createClass(Kraid, [{
    key: "spawn",
    value: function spawn(x, y, type, data) {
      // Om knallröd: dö av missil eller skruvattack

      this.stdReset(x, y);
      console.log("spawn KRAID");
      this.vulnerabilities = {
        normal: 1,
        icebeam: 1,
        wave: 1,
        bomb: 1,
        missile: 5,
        screwattack: 0
      };

      this.play("walk");

      if (this.subType === "fake") {
        this.energy = 2;
        this.vulnerabilities.missile = 1000;
        this.vulnerabilities.screwattack = 1000;
        this.play("fake");
      }

      if (this.x < metroid.samus.x) {
        this.scale.x = 1;
      } else {
        this.scale.x = -1;
      }

      this.speed = 20;
      this.body.velocity.x = this.scale.x * this.speed;

      this.basePosition = x;
    }
  }, {
    key: "update",
    value: function update() {
      if (!this.stdUpdate()) {
        return;
      };
      this.game.physics.arcade.collide(this, metroid.ground);
      this.game.physics.arcade.collide(this, metroid.doors);

      if (this.body.velocity.x > 0) {
        if (this.body.blocked.right || this.body.touching.right || this.x - this.basePosition > 32) {
          this.body.velocity.x = -this.speed;
          if (this.x < metroid.samus.x) {
            this.scale.x = 1;
          } else {
            this.scale.x = -1;
          }
          metroid.weapons.fire(this, "left", "horn");
        }
      } else {
        if (this.body.blocked.left || this.body.touching.left || this.x - this.basePosition < -32) {
          this.body.velocity.x = this.speed;
          if (this.x < metroid.samus.x) {
            this.scale.x = 1;
          } else {
            this.scale.x = -1;
          }
          metroid.weapons.fire(this, "right", "horn");
        }
      }
    }
  }]);

  return Kraid;
})(_enemiesGenericEnemy2["default"]);

exports["default"] = Kraid;
module.exports = exports["default"];

},{"../enemies/GenericEnemy":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _enemiesGenericEnemy = require('../enemies/GenericEnemy');

var _enemiesGenericEnemy2 = _interopRequireDefault(_enemiesGenericEnemy);

var Mellow = (function (_GenericEnemy) {
  _inherits(Mellow, _GenericEnemy);

  function Mellow(game, x, y, data) {
    _classCallCheck(this, Mellow);

    _get(Object.getPrototypeOf(Mellow.prototype), "constructor", this).call(this, game, x, y);
    this.animations.add("fly", ["mellow/mellow0", "mellow/mellow0"], 5, true);
    this.defrostAnimation = this.animations.add("freeze", ["mellow/mellow0", "mellow/mellow0"], 25, true);
    this.baseCoordinates = {
      x: 0,
      y: 0
    };
    this.vulnerabilities = {
      normal: 1,
      icebeam: 1,
      wave: 1,
      bomb: 1,
      missile: 1,
      screwattack: 1
    };
    this.state = 0; // 0 = hovering, 1 = attack
  }

  _createClass(Mellow, [{
    key: "spawn",
    value: function spawn(x, y, type, data) {

      console.log("mellwo was born");
      this.stdReset(x, y);
      this.baseCoordinates = {
        x: x,
        y: y
      };
      this.play("fly");
      this.state = 0;
      this.nextAction = 0;
      if (Math.random() < 0.5) {
        this.body.velocity.x = -this.speed;
      } else {
        this.body.velocity.x = this.speed;
      }
      if (data !== "child") {
        // Spawna fler!!! där data = "child"
        for (var tot = Math.floor(5 * Math.random()) + 7, n = 0; n < tot; n++) {
          metroid.mellows.createNew(x + 32 - 64 * Math.random(), y + 32 - 64 * Math.random(), null, "child");
        }
      }
    }
  }, {
    key: "update",
    value: function update() {
      if (!this.stdUpdate()) {
        return;
      }
      switch (this.state) {
        case 0:
          this.x = this.baseCoordinates.x + 2 - 4 * Math.random();
          this.y = this.baseCoordinates.y + 2 - 4 * Math.random();
          if (Math.abs(this.x - metroid.samus.x) < 64 && Math.abs(this.y - metroid.samus.y) < 64) {
            if (this.nextAction < this.game.time.now) {
              this.baseCoordinates = {
                x: metroid.samus.x,
                y: metroid.samus.y
              };
              this.state = 1;
            }
          }
          break;
        case 1:
          var stillMoving = false;
          if (Math.abs(this.x - this.baseCoordinates.x) > 2) {
            this.body.velocity.x = 75 * (this.x < this.baseCoordinates.x ? 1 : -1);
            stillMoving = true;
          }
          if (Math.abs(this.y - this.baseCoordinates.y) > 2) {
            this.body.velocity.y = 75 * (this.y < this.baseCoordinates.y ? 1 : -1);
            stillMoving = true;
          }
          if (!stillMoving) {
            this.state = 0;
            this.body.velocity.setTo(0, 0);
            this.nextAction = this.game.time.now + 2000;
          }
          break;

      }
    }
  }]);

  return Mellow;
})(_enemiesGenericEnemy2["default"]);

exports["default"] = Mellow;
module.exports = exports["default"];

},{"../enemies/GenericEnemy":2}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _enemiesGenericEnemy = require('../enemies/GenericEnemy');

var _enemiesGenericEnemy2 = _interopRequireDefault(_enemiesGenericEnemy);

var Rio = (function (_GenericEnemy) {
  _inherits(Rio, _GenericEnemy);

  function Rio(game, x, y, data) {
    _classCallCheck(this, Rio);

    _get(Object.getPrototypeOf(Rio.prototype), "constructor", this).call(this, game, x, y);
    this.animations.add("fixed0", ["rio/rioYellow0"]);
    this.animations.add("fly0", ["rio/rioYellow0", "rio/rioYellow1"], 15, true);
    this.animations.add("hurt", ["rio/rioHurt0", "rio/rioFrozen0"], 30, true);

    this.defrostAnimation = this.animations.add("freeze", ["rio/rioFrozen0", "rio/rioYellow0"], 25, true);

    this.body.setSize(24, 19);
    this.maxEnergy = 5;

    this.attacking = false;
    this.speed = 50;
    this.damage = 16;
    this.state = 0; // 0 = vara ej aktiverad.
    this.hurtSound = 2;
    this.adjust = Phaser.UP;
  }

  _createClass(Rio, [{
    key: "spawn",
    value: function spawn(x, y, type, data) {
      metroid.debugRio = this;
      this.stdReset(x, y);
      this.play("fixed0");
      this.body.allowGravity = false;
      this.attacking = false;
    }
  }, {
    key: "update",
    value: function update() {
      if (!this.stdUpdate()) {
        return;
      }

      this.game.physics.arcade.collide(this, metroid.ground);

      switch (this.state) {
        case 0:
          // Ceiling
          if (this.body.touching.up || this.body.blocked.up) {
            this.play("fixed0");
          }
          if (Math.abs(this.x - metroid.samus.x) < 60) {
            this.play("fly0");
            this.state = 1;
          }
          break;
        case 1:
          // attacking
          this.body.velocity.y = 0;
          this.body.velocity.x = 0;
          if (this.y < metroid.samus.y + 20) {
            this.body.velocity.y = this.speed * 2;
          }
          if (this.x < metroid.samus.x - 10) {
            this.body.velocity.x = this.speed;
          } else if (this.x > metroid.samus.x + 10) {
            this.body.velocity.x = -this.speed;
          }
          if (this.y > metroid.samus.y + 24) {
            this.state = 2;
          }
          break;
        case 2:
          // widthdraw
          this.body.velocity.y = -this.speed;
          if (metroid.samus.y - this.y > 64 || this.body.touching.up || this.body.blocked.up) {
            this.state = 0;
          }
          break;
      }

      return;

      if (!this.attacking && this.body.velocity.x == 0 && this.body.velocity.y == 0) {
        return;
      }
      this.game.physics.arcade.collide(this, metroid.ground);

      if (this.y > metroid.samus.y - 12) {
        this.body.allowGravity = false;
      }
      if (this.x < metroid.samus.x) {
        this.body.velocity.x = this.speed;
      }
      if (this.x > metroid.samus.x) {
        this.body.velocity.x = -this.speed;
      }
      if (this.y > metroid.samus.y + 12) {
        this.body.allowGravity = false;
        this.body.velocity.y = -20;
        this.attacking = false;
      }

      if (this.body.touching.down) {
        this.body.allowGravity = false;
        this.body.velocity.y = -20;
      }
      /*if(this.body.blocked.up){
        this.attacking = false;
        this.body.velocity.y = 0;
        this.play("fixed0");
      }*/
    }
  }]);

  return Rio;
})(_enemiesGenericEnemy2["default"]);

exports["default"] = Rio;
module.exports = exports["default"];

},{"../enemies/GenericEnemy":2}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _enemiesGenericEnemy = require('../enemies/GenericEnemy');

var _enemiesGenericEnemy2 = _interopRequireDefault(_enemiesGenericEnemy);

var Ripper = (function (_GenericEnemy) {
  _inherits(Ripper, _GenericEnemy);

  function Ripper(game, x, y, data) {
    _classCallCheck(this, Ripper);

    _get(Object.getPrototypeOf(Ripper.prototype), "constructor", this).call(this, game, x, y);
    //this.type = data.type;
    this.animations.add("ripper0", ["ripper/ripper0"]);
    this.animations.add("ripperRed", ["ripper/ripperRed"]);

    this.defrostAnimation = this.animations.add("freeze", ["ripper/ripperFreezed", "ripper/ripper0"], 25, true);

    this.speed = 20;
    this.noUnfreeze = true;
    this.vulnerabilities = {
      normal: 0,
      icebeam: 0,
      wave: 0,
      bomb: 0,
      missile: 0,
      screw: 0
    };
  }

  _createClass(Ripper, [{
    key: "spawn",
    value: function spawn(x, y, data) {
      // Om knallröd: dö av missil eller skruvattack
      this.stdReset(x, y);
      this.subType = data.subtype; // Borde vara i standard...

      this.vulnerabilities = {
        normal: 0,
        icebeam: 0,
        wave: 0,
        bomb: 0,
        missile: 0,
        screw: 0
      };
      this.play("ripper0");

      if (this.subType === "red") {
        this.vulnerabilities.missile = 1000;
        this.vulnerabilities.screw = 1000;
        this.play("ripperRed");
      }

      //this.play("defrosting");
      if (Math.random() < 0.5) {
        this.body.velocity.x = -this.speed;
      } else {
        this.body.velocity.x = this.speed;
      }
    }
  }, {
    key: "update",
    value: function update() {
      if (!this.stdUpdate()) {
        return;
      };
      this.game.physics.arcade.collide(this, metroid.ground);
      this.game.physics.arcade.collide(this, metroid.doors);

      if (this.body.blocked.right || this.body.touching.right) {
        this.scale.x = -1;
        this.body.velocity.x = -this.speed;
      } else if (this.body.blocked.left) {
        this.scale.x = 1;
        this.body.velocity.x = this.speed;
      }
    }
  }]);

  return Ripper;
})(_enemiesGenericEnemy2["default"]);

exports["default"] = Ripper;
module.exports = exports["default"];

},{"../enemies/GenericEnemy":2}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _enemiesGenericEnemy = require('../enemies/GenericEnemy');

var _enemiesGenericEnemy2 = _interopRequireDefault(_enemiesGenericEnemy);

var Skree = (function (_GenericEnemy) {
  _inherits(Skree, _GenericEnemy);

  function Skree(game, x, y, data) {
    _classCallCheck(this, Skree);

    _get(Object.getPrototypeOf(Skree.prototype), "constructor", this).call(this, game, x, y);
    //this.type = data.type;
    this.animations.add("skree0", ["skree/skree01"]);
    this.animations.add("skreeDive0", ["skree/skree00", "skree/skree01", "skree/skree00", "skree/skre02"], 15, true);
    this.animations.add("hurt", ["skree/skreeHurt0", "skree/frozen", "skree/skreeHurt0"], 30);
    this.defrostAnimation = this.animations.add("freeze", ["skree/frozen", "skree/skree01"], 25, true);

    this.body.setSize(16, 24);
    this.maxEnergy = 3;
    //  this.anchor.setTo(0.5,0.5);

    //this.game = state.game;

    ////
    //this.game.physics.enable(this);
    //this.body.allowGravity = false;

    //  this.speed = 20;
    //this.body.setSize(16,16,0,0);
    //this.anchor.setTo(0.5,0.5);
    //this.game.add.existing(this);
    //  this.exist = false;
    //this.alive = false;
    //  this.customEvent = false;
    this.adjust = Phaser.UP;
  }

  _createClass(Skree, [{
    key: "spawn",
    value: function spawn(x, y, type, data) {
      metroid.skreeDebug = this;
      console.log("Skree 1", this.x, this.y);
      this.stdReset(x, y);
      this.body.allowGravity = false;
      console.log("Skree 2", this.x, this.y);
      this.play("skree0");
    }
  }, {
    key: "update",
    value: function update() {
      if (!this.stdUpdate()) {
        return;
      };

      if (Math.abs(this.x - metroid.samus.x) < 20) {
        this.play("skreeDive0");
        this.body.allowGravity = true;
      }

      this.game.physics.arcade.collide(this, metroid.ground);

      if (this.body.blocked.down && !this.customEvent) {
        this.startTimer(this);
      }
    }
  }, {
    key: "startTimer",
    value: function startTimer(that) {
      if (that.customEvent) {
        alert("!!!");
        return;
      }
      that.customEvent = that.game.time.events.add(Phaser.Timer.SECOND * 4, function () {
        metroid.weapons.fire(this, "upLeft", "skree");
        metroid.weapons.fire(this, "upRight", "skree");
        metroid.weapons.fire(this, "left", "skree");
        metroid.weapons.fire(this, "right", "skree");
        this.exists = false;
        this.alive = false;
      }, that);
    }
  }]);

  return Skree;
})(_enemiesGenericEnemy2["default"]);

exports["default"] = Skree;
module.exports = exports["default"];

},{"../enemies/GenericEnemy":2}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _enemiesGenericEnemy = require('../enemies/GenericEnemy');

var _enemiesGenericEnemy2 = _interopRequireDefault(_enemiesGenericEnemy);

var Waver = (function (_GenericEnemy) {
  _inherits(Waver, _GenericEnemy);

  function Waver(game, x, y, data) {
    _classCallCheck(this, Waver);

    _get(Object.getPrototypeOf(Waver.prototype), "constructor", this).call(this, game, x, y);
    //this.type = data.type;
    this.animations.add("waver", ["waver/waverGreen0", "waver/waverGreen1", "waver/waverGreen2", "waver/waverGreen1", "waver/waverGreen0"], 5, false);
    this.animations.add("hurt", ["waver/waverBlue0", "waver/waverFrozen0"], 30, true);

    this.defrostAnimation = this.animations.add("freeze", ["waver/waverFrozen0", "waver/waverGreen1"], 25, true);

    this.speed = 40;
    this.maxEnergy = 10;
    this.vulnerabilities = {
      normal: 2,
      ice: 3,
      wave: 3,
      bomb: 5,
      missile: 100,
      screwattack: 0
    };
    this.nextOpen = 0;
    this.damage = 14;
  }

  _createClass(Waver, [{
    key: "spawn",
    value: function spawn(x, y, type, data) {
      // Om knallröd: dö av missil eller skruvattack
      this.stdReset(x, y);
      this.body.acceleration.set(0, 70);

      this.x = x;
      this.y = y;
      this.play("waver");
      //this.play("defrosting");
      if (Math.random() < 0.5) {
        this.body.velocity.x = -this.speed;
      } else {
        this.body.velocity.x = this.speed;
      }
    }
  }, {
    key: "update",
    value: function update() {
      if (!this.stdUpdate()) {
        return;
      };

      if (this.nextOpen < this.game.time.now) {
        this.body.acceleration.y = -this.body.acceleration.y;
        this.animations.stop(null, true);
        this.play("waver");
        this.nextOpen = this.game.time.now + 1000 + 500 * Math.random();
      }

      this.game.physics.arcade.collide(this, metroid.ground);
      this.game.physics.arcade.collide(this, metroid.doors);

      if (this.body.blocked.right || this.body.touching.right) {
        this.scale.x = -1;
        this.body.velocity.x = -this.speed;
      } else if (this.body.blocked.left) {
        this.scale.x = 1;
        this.body.velocity.x = this.speed;
      }
    }
  }]);

  return Waver;
})(_enemiesGenericEnemy2["default"]);

exports["default"] = Waver;
module.exports = exports["default"];

},{"../enemies/GenericEnemy":2}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _enemiesGenericEnemy = require('../enemies/GenericEnemy');

var _enemiesGenericEnemy2 = _interopRequireDefault(_enemiesGenericEnemy);

var Zeb = (function (_GenericEnemy) {
  _inherits(Zeb, _GenericEnemy);

  function Zeb(game, x, y, data) {
    _classCallCheck(this, Zeb);

    _get(Object.getPrototypeOf(Zeb.prototype), "constructor", this).call(this, game, x, y);
    //this.type = data.type;
    this.animations.add("zebYellow", ["zeb/zebYellow0", "zeb/zebYellow1"], 25, true);
    this.animations.add("zebRed", ["zeb/zebRed0", "zeb/zebRed1"], 25, true);
    this.defrostAnimation = this.animations.add("freeze", ["zeb/zebFrozen0", "zeb/zebYellow0"], 25, true);
    this.speed = 120;
    this.origin = {
      x: x,
      y: y
    };
    this.pickup = false;
    this.body.setSize(16, 16, 0, 0);
    this.animation = "zebYellow";
    this.alertDistance = 16 * 8;
    this.nextSpawn = 0;
  }

  _createClass(Zeb, [{
    key: "spawn",
    value: function spawn(x, y, data) {
      this.subType = data.subtype;
      this.resetSubValues();
      this.play("zeb" + this.animationSuffix);
      this.stdReset(x, y);
      /*this.body.position.x = -20;
      this.body.position.y = -20;*/

      this.origin = {
        x: x - 8,
        y: y - 16
      };
      this.stage = 0;

      if (this.pickup) {
        this.pickup.exists = false;
      }
    }
  }, {
    key: "update",
    value: function update() {
      /*if(!this.inCamera && this.stage==3){
        this.body.position.x = -20;
        this.body.position.y = -20;
        if(Math.abs(this.origin.x - metroid.samus.x) > 48){
          console.log(this.origin.x - metroid.samus.x);
          return;
        }
      }
      this.stage = 0;*/
      if (this.pickup) {
        if (this.pickup.exists) {
          return;
        } else {
          this.pickup = false;
          //this.exists = true;
          //this.alive = true;
          this.stage = 0;
          this.resetSubValues();
        }
      }
      if (!this.inCamera) {
        this.stage = 0;
        //this.body.velocity.setTo(0, 0);
        this.resetSubValues();
      }
      if (this.nextSpawn > this.game.time.now) {
        return;
      }

      if (!this.stdUpdate()) {
        return;
      }
      if (this.stage < 2) {
        if (metroid.samus.x < this.x) {
          this.scale.x = -1;
        } else {
          this.scale.x = 1;
        }
      }

      switch (this.stage) {
        case 0:
          /// WAITING
          this.alpha = 0;
          if (Math.abs(this.origin.x - metroid.samus.x) < this.alertDistance && metroid.samus.y < this.origin.y) {
            this.body.position.x = this.origin.x;
            this.body.position.y = this.origin.y;
            this.body.velocity.y = -this.speed;
            this.stage++;
            this.game.sound.play('spawn');
          }
          break;
        case 1:
          /// RISING
          this.alpha = 1;

          if (metroid.samus.y > this.y) {
            this.body.velocity.y = 0;
            this.stage++;
          }
          break;
        case 2:
          /// attacking
          if (metroid.samus.x < this.x) {
            this.body.velocity.x = -this.speed;
          } else {
            this.body.velocity.x = this.speed;
          }
          this.stage++;
          break;
      }
    }
  }, {
    key: "death",
    value: function death() {
      if (!this.dying) {
        return;
      }
      this.pickup = metroid.pickups.createNew(this.x, this.y, "random");
      this.body.position.x = -20;
      this.body.position.y = -20;
      this.play("zeb" + this.animationSuffix);
      this.stage = 0;
      this.alpha = 1;
      this.dying = false;
      this.exists = false;
      this.alive = false;
      //this.resetSubValues();
    }
  }, {
    key: "resetSubValues",
    value: function resetSubValues() {
      switch (this.subType) {
        case "red":
          this.maxEnergy = 2;
          this.animationSuffix = "Red";
          break;
        default:
          this.maxEnergy = 1;
          this.animationSuffix = "Yellow";
          break;
      }
      this.body.velocity.setTo(0, 0);
      //////this.body.position.x = -20;
      ///    this.body.position.y = -20;
      this.alpha = 0;
      this.body.position.setTo(this.origin.x, this.origin.y);
      this.exists = true;
      this.alive = true;
      this.nextSpawn = this.game.time.now + 1000;
      this.energy = this.maxEnergy;
    }
  }]);

  return Zeb;
})(_enemiesGenericEnemy2["default"]);

exports["default"] = Zeb;
module.exports = exports["default"];

},{"../enemies/GenericEnemy":2}],10:[function(require,module,exports){
'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _statesGameState = require('./states/GameState');

var _statesGameState2 = _interopRequireDefault(_statesGameState);

var _statesPreload = require('./states/Preload');

var _statesPreload2 = _interopRequireDefault(_statesPreload);

var _statesTitle = require('./states/Title');

var _statesTitle2 = _interopRequireDefault(_statesTitle);

var _statesSelectGame = require('./states/SelectGame');

var _statesSelectGame2 = _interopRequireDefault(_statesSelectGame);

var _statesDrawMap = require('./states/DrawMap');

var _statesDrawMap2 = _interopRequireDefault(_statesDrawMap);

var Game = (function (_Phaser$Game) {
  _inherits(Game, _Phaser$Game);

  function Game() {
    _classCallCheck(this, Game);

    // DRM :-) You found it. Easy to find and easy to remove or alter to allow other adresses, but please don't.
    if (window.location.hostname.indexOf("localhost") === -1 && window.location.hostname.indexOf("niklasberg.se") === -1 && window.location.hostname.indexOf("192.168") === -1 && window.location.hostname.indexOf("niklasberg.se") === -1) {
      console.clear();
      console.error("The game is only allowed to be hosted on metroid.niklaberg.se.");
      return;
    } else {
      window.metroid = {
        inventory: {},
        enhancements: {
          itemlabels: false,
          minimap: false,
          snes: false,
          widescreen: false,
          twoplayer: false,
          quickelevators: true
        }
      };

      if (document.location.hostname.indexOf("localhost") === -1 && document.location.hostname.indexOf("192.168") === -1) {
        _get(Object.getPrototypeOf(Game.prototype), 'constructor', this).call(this, 256, 240, Phaser.WEBGL, "game", null, false, false); //426 = 16:9, 256x240 PAL, 256x224 with cropping NTSC
        this.isLive = true;
      } else {
        // _get(Object.getPrototypeOf(Game.prototype), 'constructor', this).call(this, 256, 240, Phaser.WEBGL, 'Metroid', null, false, false); //426 = 16:9, 256x240 PAL, 256x224 with cropping NTSC
        _get(Object.getPrototypeOf(Game.prototype), 'constructor', this).call(this, 256, 240, Phaser.WEBGL, "game", null, false, false); //426 = 16:9, 256x240 PAL, 256x224 with cropping NTSC
        this.isLive = false; this.isLive = true; ///MJG
      }

      this.state.add('Preload', _statesPreload2['default'], false);
      this.state.add('Title', _statesTitle2['default'], false);
      this.state.add('SelectGame', _statesSelectGame2['default'], false);

      this.state.add('GameState', _statesGameState2['default'], false);
      this.state.add('DrawMap', _statesDrawMap2['default'], false);

      this.state.start('Preload');
    }
  }

  return Game;
})(Phaser.Game);

new Game();

/*
game.samus
game.bullets (including energy dots and missiles)
game.enemies
game.objects (doors, half-tiles and pickups)
*/

},{"./states/DrawMap":13,"./states/GameState":14,"./states/Preload":15,"./states/SelectGame":16,"./states/Title":17}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Controls = (function () {
  function Controls(game) {
    _classCallCheck(this, Controls);

    this.game = game.game;
    this.gamepad = {
      justPressed: function justPressed(x) {},
      axis: function axis(x) {},
      isDown: function isDown(x) {}
    };
    Phaser.gamepad = {
      XBOX360_X: false,
      XBOX360_DPAD_UP: false,
      XBOX360_DPAD_DOWN: false,
      XBOX360_DPAD_LEFT: false,
      XBOX360_DPAD_RIGHT: false,
      XBOX360_STICK_LEFT_Y: 0,
      XBOX360_STICK_LEFT_X: 0

    };
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.wasPressed = {};
    this.isPressed = {};
    this.sister = {
      isPressed: {},
      wasPressed: {}
    };
  }

  _createClass(Controls, [{
    key: 'getPressedKeys',
    value: function getPressedKeys() {
      var pressedKeys = { sister: {} };

      if (metroid.stick.direction === Phaser.NONE) {
        /// BLÄ
        metroid.stick.multiDirections = {
          up: false,
          right: false,
          down: false,
          left: false
        };
      }

      this.wasPressed = this.isPressed;
      pressedKeys.fire = this.game.input.keyboard.isDown(Phaser.Keyboard.X) || this.gamepad.justPressed(Phaser.gamepad.XBOX360_X) || metroid.buttonB.isDown;
      pressedKeys.jump = this.gamepad.justPressed(Phaser.gamepad.XBOX360_A) || this.game.input.keyboard.isDown(Phaser.Keyboard.Z) || this.game.input.keyboard.isDown(Phaser.Keyboard.Y) || metroid.buttonA.isDown;
      pressedKeys.up = this.cursors.up.isDown || this.gamepad.isDown(Phaser.gamepad.XBOX360_DPAD_UP) || metroid.stick.multiDirections.up; // || this.gamepad.axis(Phaser.gamepad.XBOX360_STICK_LEFT_Y) < 0.1) || this.gamepad.axis(Phaser.gamepad.XBOX360_STICK_RIGHT_Y) < 0.1);
      pressedKeys.down = this.cursors.down.isDown || this.gamepad.isDown(Phaser.gamepad.XBOX360_DPAD_DOWN) || this.gamepad.axis(Phaser.gamepad.XBOX360_STICK_LEFT_Y) > 0.1 || this.gamepad.axis(Phaser.gamepad.XBOX360_STICK_RIGHT_Y) > 0.1 || metroid.stick.multiDirections.down;
      pressedKeys.left = this.cursors.left.isDown || this.gamepad.isDown(Phaser.gamepad.XBOX360_DPAD_LEFT) || this.gamepad.axis(Phaser.gamepad.XBOX360_STICK_LEFT_X) < -0.1 || this.gamepad.axis(Phaser.gamepad.XBOX360_STICK_RIGHT_X) < -0.1 || metroid.stick.multiDirections.left;
      pressedKeys.right = this.cursors.right.isDown || this.gamepad.isDown(Phaser.gamepad.XBOX360_DPAD_RIGHT) || this.gamepad.axis(Phaser.gamepad.XBOX360_STICK_LEFT_X) > 0.1 || this.gamepad.axis(Phaser.gamepad.XBOX360_STICK_RIGHT_X) > 0.1 || metroid.stick.multiDirections.right;
      pressedKeys.missile = this.game.input.keyboard.isDown(Phaser.Keyboard.C) || metroid.buttonM.isDown;
      pressedKeys.pause = this.game.input.keyboard.isDown(Phaser.Keyboard.P);
      pressedKeys.quit = this.game.input.keyboard.isDown(Phaser.Keyboard.ESC);
      pressedKeys.fullscreen = this.game.input.keyboard.isDown(Phaser.Keyboard.F);

      if (pressedKeys.jump) {
        pressedKeys.jumpTimer = this.wasPressed.jumpTimer + this.game.time.physicsElapsedMS;
      } else {
        pressedKeys.jumpTimer = 0;
      }

      if (metroid.samusSister) {
        this.sister.wasPressed = this.sister.isPressed;
        pressedKeys.sister.fire = this.game.input.keyboard.isDown(Phaser.Keyboard.B);
        pressedKeys.sister.jump = this.game.input.keyboard.isDown(Phaser.Keyboard.V);
        pressedKeys.sister.up = this.game.input.keyboard.isDown(Phaser.Keyboard.W);
        pressedKeys.sister.down = this.game.input.keyboard.isDown(Phaser.Keyboard.S);
        pressedKeys.sister.left = this.game.input.keyboard.isDown(Phaser.Keyboard.A);
        pressedKeys.sister.right = this.game.input.keyboard.isDown(Phaser.Keyboard.D);
        pressedKeys.sister.missile = this.game.input.keyboard.isDown(Phaser.Keyboard.N);
        if (pressedKeys.sister.jump) {
          pressedKeys.sister.jumpTimer = this.wasPressed.sister.jumpTimer + this.game.time.physicsElapsedMS;
        } else {
          pressedKeys.sister.jumpTimer = 0;
        }
      }

      if (pressedKeys.quit) {}

      if (pressedKeys.pause && !this.wasPressed.pause) {
        this.game.physics.arcade.isPaused = !this.game.physics.arcade.isPaused;
        if (this.game.physics.arcade.isPaused) {
          this.game.sound.play('pause');
        }
      }

      if (pressedKeys.fullscreen && !this.wasPressed.fullscreen) {
        if (this.game.scale.isFullScreen) {
          this.game.scale.stopFullScreen();
        } else {
          this.game.scale.startFullScreen(false);
        }
      }

      if (this.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
        metroid.inventory.marumari = !metroid.inventory.marumari;
      }
      this.isPressed = pressedKeys;
      metroid.keys = {
        isPressed: pressedKeys,
        wasPressed: this.wasPressed,
        sister: {
          isPressed: pressedKeys.sister,
          wasPressed: this.sister.wasPressed
        }
      };
    }
  }]);

  return Controls;
})();

exports['default'] = Controls;
module.exports = exports['default'];

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _stuffDoor = require('../stuff/Door');

var _stuffDoor2 = _interopRequireDefault(_stuffDoor);

var roomTransition = (function () {
  function roomTransition(state) {
    _classCallCheck(this, roomTransition);

    this.state = state;
    this.game = state.game;
    this.rooms = state.rooms;
    this.currentRoomIndex = -1;
    this.state.ongoingTransition = false;
    this.temporaryRoom = {
      x: 0,
      y: 0
    };
  }

  _createClass(roomTransition, [{
    key: "checkCurrentRoom",
    value: function checkCurrentRoom(x, y, elevator) {

      var rooms = this.state.rooms;
      var room = undefined;
      var adjustX = undefined;
      var sx = x;
      var sy = y;
      elevator = elevator ? elevator : false;
      x = Math.floor(x / (16 * 16));
      y = Math.floor(y / (16 * 15));
      //console.log(metroid.currentRoom);
      if (metroid.currentRoom.x * 16 * 16 + 8 <= sx && (metroid.currentRoom.x2 + 1) * 16 * 16 - 8 >= sx && metroid.currentRoom.y * 16 * 15 <= sy && (metroid.currentRoom.y2 + 1) * 16 * 15 >= sy) {
        //console.log("in bounds");
        return;
      }
      console.log("waste");

      // Kolla om inom currentRomm och återvänd
      /// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      for (var i in rooms) {
        room = rooms[i];

        //console.log(room);
        if ((metroid.currentRoom.x !== room.x || elevator) && room.x * 16 * 16 - 8 <= sx && (room.x2 + 1) * 16 * 16 + 8 >= sx && room.y * 16 * 15 <= sy && (room.y2 + 1) * 16 * 15 >= sy) {

          var side = -1;
          console.log("FOUND IT");
          /// TEMP ///
          if (room.y !== room.y2) {
            metroid.game.camera.follow(metroid.samus);
          } else if (metroid.samusSister.exists) {
            metroid.game.camera.follow([metroid.samus, metroid.samusSister]);
          }

          //this.game.world.setBounds(room.x * 16 * 16, room.y * 16 * 15, (room.x2 - room.x + 1) * 16 * 16, (room.y2 - room.y + 1) * 16 * 15);
          if (this.currentRoomIndex !== i) {
            adjustX = room.x === room.x2 ? 170 / 2 : 0;
            if (this.currentRoomIndex === -1) {
              adjustX = 0;
              this.game.world.setBounds(room.x * 16 * 16 - adjustX, room.y * 16 * 15, (room.x2 - room.x + 1) * 16 * 16 + adjustX * 2, (room.y2 - room.y + 1) * 16 * 15);
              this.updateMusic(room);
            } else {
              side = rooms[this.currentRoomIndex].x < room.x ? 0 : 1;
              if (elevator) {
                this.elevatorToRoom(i);
              } else {
                this.goToRoom(this.currentRoomIndex, i, y);
              }
              this.updateMusic(room);
            }
            this.loadRoom(room);
            this.currentRoomIndex = i;

            if (side > -1) {
              var wantedId = room.x + "." + room.y + (side === 0 ? "left" : "right") + y;
              console.log(room.doors, wantedId);
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = metroid.doors.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var doorObject = _step.value;

                  console.log(doorObject.id);
                  if (doorObject.id === room.x + "." + room.y + (side === 0 ? "left" : "right") + y) {
                    console.log("open door" + doorObject.id);
                    doorObject.open(null, true);
                    this.game.time.events.add(1500, doorObject.close, doorObject);
                  }
                }
                //debugger;
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              console.log(x, y, side);
              console.log(room);
              /*for (let door of room.doors) {
                console.log(door.x,door.y,door.side,x,y);
                if(door.side)
                if (door.x === x && door.y === y && door.side === side) {
                  console.log("Door"+door.id);
                  for (let doorObject of metroid.doors.children) {
                    console.log(doorObject.id, door.id, doorObject);
                    if (doorObject.id === door.id) {
                      console.log("open door" + door.id)
                      doorObject.open(null, true);
                      this.game.time.events.add(1000, doorObject.close, doorObject);
                     }
                  }
                }
              }*/
            }
            //  console.log("CURRENT ROOM" + i);
          }
          //console.log("SS")
          break;
        }
      }
      metroid.currentRoom = metroid.map.rooms[this.currentRoomIndex];
    }
  }, {
    key: "updateTransition",
    value: function updateTransition() {
      this.temporaryRoom.adjustX = 0;
      this.game.world.setBounds(this.temporaryRoom.x - this.temporaryRoom.adjustX, this.temporaryRoom.y, 256 + this.temporaryRoom.adjustX * 2, 240);
    }
  }, {
    key: "elevatorToRoom",
    value: function elevatorToRoom(to) {
      var adjustX = 0; // elevator rooms always vertical in the original
      var room = this.state.rooms[to];
      this.unloadRoom(room);
      this.game.world.setBounds(room.x * 16 * 16 - adjustX, room.y * 16 * 15, (room.x2 - room.x + 1) * 16 * 16 + adjustX * 2, (room.y2 - room.y + 1) * 16 * 15);
    }
  }, {
    key: "goToRoom",
    value: function goToRoom(from, to, y) {

      var rooms = undefined,
          game = undefined;
      var tween = undefined;
      //this.currentRoomIndex = to;

      game = this.game;
      rooms = this.state.rooms;
      from = rooms[from];
      /*to = {
        x: rooms[to].x,
        y: rooms[to].y,
        x2: rooms[to].x2,
        y2: rooms[to].y2
      };*/
      to = rooms[to];
      //  console.log()
      this.state.ongoingTransition = true;
      var adjustX = undefined;
      /*  if (metroid.settings.aspectRatio === "16:9"){
          adjustX = (this.game.width-256)/2;
        }*/
      adjustX = to.x === to.x2 ? 170 / 2 : 0;

      var samusTween = undefined;

      metroid.samus.appeared = false;
      metroid.samus.body.allowGravity = false;
      metroid.samus.body.velocity.setTo(0, 0);

      metroid.samus.animations.currentAnim.stop();
      if (from.x < to.x) {
        // Flytta höger
        this.temporaryRoom = {
          x: from.x2 * 16 * 16,
          y: y * 16 * 15,
          adjustX: to.x === to.x2 ? 170 / 2 : 0
        };
        tween = this.game.add.tween(this.temporaryRoom).to({
          x: to.x * 16 * 16
        });
        samusTween = this.game.add.tween(metroid.samus).to({
          x: to.x * 16 * 16 + 32
        });
        /*metroid.samus.body.moves = false;
        samusTween = this.game.add.tween(metroid.samus).to({
          x: to.x * 16 * 16+32
        });*/
        /*  tween.onComplete.add((function() {
            this.state.ongoingTransition = false;
            let room = this.state.rooms[this.currentRoomIndex];
            this.game.world.setBounds(room.x*16*16, room.y*16*15, (room.x2 - room.x + 1) * 16 * 16, (room.y2 - room.y + 1) * 16 * 15);
          }), this);
          tween.start();*/
      } else {
          this.temporaryRoom = {
            x: from.x * 16 * 16,
            y: y * 16 * 15,
            adjustX: to.x === to.x2 ? 170 / 2 : 0
          };
          tween = this.game.add.tween(this.temporaryRoom).to({
            x: to.x2 * 16 * 16
          });
          samusTween = this.game.add.tween(metroid.samus).to({
            x: to.x2 * 16 * 16 + 16 * 16 - 32
          });
        }
      tween.onComplete.add(function () {
        var adjustX = undefined;
        this.state.ongoingTransition = false;
        var room = this.state.rooms[this.currentRoomIndex];
        adjustX = room.x === room.x2 ? 170 / 2 : 0;
        /*if (metroid.settings.aspectRatio === "16:9" && (room.x2 - room.x + 1) * 16 * 16 < 300) {
          adjustX = (this.game.width-256)/2;
        }*/
        adjustX = 0;
        this.game.world.setBounds(room.x * 16 * 16 - adjustX, room.y * 16 * 15, (room.x2 - room.x + 1) * 16 * 16 + adjustX * 2, (room.y2 - room.y + 1) * 16 * 15);
        this.unloadRoom(room);
      }, this);
      tween.start();

      samusTween.onComplete.add(function () {
        metroid.samus.appeared = true;
        metroid.samus.body.allowGravity = true;
        metroid.samus.animations.currentAnim.play();
      });

      samusTween.start();

      //this.game.world.setBounds(room.x * 16 * 16, room.y * 16 * 15, (room.x2 - room.x + 1) * 16 * 16, (room.y2 - room.y + 1) * 16 * 15);
    }
  }, {
    key: "loadRoom",
    value: function loadRoom(room) {
      console.log("load room", room);
      // Check tiles to create doors, borde kanske flyttas till när karatan laddas och förändra objects. Den kan göra room[i].doors={x,y,type}
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = room.doors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var door = _step2.value;

          console.log("door", door);
          metroid.doors.createNew(null, door.y, door.type, {
            left: door.left,
            id: door.id,
            "class": 0,
            x: room.x,
            x2: room.x2
          });
        }

        // Loop objects in room
        /*  for (let block of room.blocks) {
            //  console.log("block", block.x, block.y);
            metroid.blocks.createNew(block.x, block.y, block.type);
          }*/
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (room.hasOwnProperty("elevator")) {
        metroid.doors.createNew(null, null, "elevator", {
          x: room.x,
          y: room.y,
          direction: room.elevator
        });
      }
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = room.breakable[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var breakable = _step3.value;

          for (var w = 0; w < breakable.width; w++) {
            for (var h = 0; h < breakable.height; h++) {
              metroid.blocks.createNew(breakable.x + w, breakable.y + h, "1");
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      console.log(room, room.items);
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = room.items[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var pickup = _step4.value;

          pickup.taken = false;

          //  console.log("block", block.x, block.y);
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = metroid.samus.takenItems[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var takenItem = _step6.value;

              if (takenItem === pickup.id) {
                pickup.taken = true;
                break;
              }
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
                _iterator6["return"]();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          if (!pickup.taken) {
            console.log("make new", pickup.type);
            metroid.pickups.createNew(pickup.x, pickup.y, pickup.type, pickup.id);
          }
        }
        // Override doors if object says so

        // Load enemy
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = room.enemies[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var enemy = _step5.value;

          //console.log(enemy);
          //  console.log("block", block.x, block.y);
          if (enemy.type) {
            //  console.log("enemy: " + enemy.name);
            if (!enemy.family) {
              // Hör hemma i mapparser!
              switch (enemy.type) {
                case "zoomer":
                case "zeela":
                case "nova":
                case "viola":
                  enemy.family = "crawlers";
                  break;
                /*case "mellow":
                case "memu":
                  enemy.family = "swarms";
                  break;
                case "zeb":
                case "geega":
                case "mella":
                case "gamet":
                case "zebbo":
                  enemy.family = "flies";
                  break;
                case "ripper":
                case "ripper2":
                case "multiviola":
                  enemy.family = "mindeless";
                  break;
                case "skree":
                  enemy.family = "divers";
                    break;
                case "waver":
                  enemy.family = "sinus";
                    break;
                case "rio":
                case "qerutha":
                case "holtz":
                  enemy.family = "birds";
                    break;  /// 19 so far, 11 kvar
                case "sidehopper":
                case "dessgega":
                  enemy.family = "jumpers";
                  break;
                case "zebetithe":
                case "motherbrain":
                  enemy.family = "static";
                  break;*/

                default:
                  // Kraid, Squeept, polyp ?== dragon, ridley, Rinka (fly?), Metroid, Zebetithe === Motherbrain
                  enemy.family = enemy.type + "s";
                  break;
              }
            }
            if (metroid.hasOwnProperty(enemy.family)) {
              metroid[enemy.family].createNew(enemy.x, enemy.y, enemy);
            } else {
              metroid.crawlers.createNew(enemy.x, enemy.y, enemy);
            }
          } else {
            console.log("NO NAME" + enemy.name);
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }, {
    key: "unloadRoom",
    value: function unloadRoom(room) {
      console.log(room);
      // Destroy all doors
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = metroid.doors.children[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var door = _step7.value;

          if (door.x < room.x * 16 * 16 || door.x > (room.x2 + 1) * 16 * 16 - 16) {
            // tog bort door.alive, det är väl onödigt???
            console.log("destroy", door.x, room.x);
            door.alive = false;
            door.exists = false;
          }
        }
        // Destroy all enemies
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
            _iterator7["return"]();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = metroid.enemies.children[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var enemyGroup = _step8.value;
          var _iteratorNormalCompletion10 = true;
          var _didIteratorError10 = false;
          var _iteratorError10 = undefined;

          try {
            for (var _iterator10 = enemyGroup.children[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
              var enemy = _step10.value;

              if (enemy.alive && (enemy.x < room.x * 16 * 16 || enemy.x > (room.x2 + 1) * 16 * 16 - 16)) {
                //console.log("kill", enemy)
                //enemy.kill();
                enemy.alive = false;
                enemy.exists = false;
              }
            }
          } catch (err) {
            _didIteratorError10 = true;
            _iteratorError10 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion10 && _iterator10["return"]) {
                _iterator10["return"]();
              }
            } finally {
              if (_didIteratorError10) {
                throw _iteratorError10;
              }
            }
          }
        }
        // Destroy all blocks
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8["return"]) {
            _iterator8["return"]();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = metroid.blocks.children[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var block = _step9.value;

          if (block.alive && (block.x < room.x * 16 * 16 || block.x > (room.x2 + 1) * 16 * 16 - 16)) {
            block.alive = false;
            block.exists = false;
          }
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9["return"]) {
            _iterator9["return"]();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }
    }
  }, {
    key: "updateMusic",
    value: function updateMusic(room) {
      var play = undefined,
          stop = undefined;

      stop = metroid.music.current;
      if (room.music) {
        play = metroid.music[room.music];
      } else if (room.area.length > 0) {
        play = metroid.music[room.area];
        console.log(room);
      } else {
        play = metroid.music.brinstar;
      }
      metroid.music.current = play;
      if (!play.isPlaying) {
        stop.stop();
        play.play(null, 0, 1, true);
      }
      if (metroid.music.title.isPlaying) {
        metroid.music.title.stop();
      }

      console.log(stop, play);
    }
  }]);

  return roomTransition;
})();

exports["default"] = roomTransition;
module.exports = exports["default"];

},{"../stuff/Door":20}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawMap = (function (_Phaser$State) {
  _inherits(DrawMap, _Phaser$State);

  function DrawMap() {
    _classCallCheck(this, DrawMap);

    _get(Object.getPrototypeOf(DrawMap.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(DrawMap, [{
    key: "create",
    value: function create() {
      console.log("!!");
      setTimeout(this.drawMap.bind(this), 299);
      this.background = this.game.add.graphics(0, 0);
      metroid.samus = { x: 2 * 16 * 16, y: 13 * 15 * 16 };
      this.add.tween(metroid.samus).to({ x: (2 + 5) * 16 * 16 }, 2000, "Linear", true, 0, -1);
    }
  }, {
    key: "update",
    value: function update() {
      if (!this.mapGfx) {
        return;
      }

      /*this.map.x = metroid.samus.x/(16*16);*/

      this.background.beginFill(0xFFFFFF * Math.random(), 1);
      //graphics.drawRect(r.x*m, r.y*m, 100, 100);
      this.background.drawRect(this.game.width * Math.random(), this.game.height * Math.random(), 10, 10);
      this.background.endFill();
    }
  }, {
    key: "drawMap",
    value: function drawMap() {

      var graphics = this.add.graphics(0, 0);
      graphics.beginFill(0xFF0000, 1);
      //graphics.drawRect(r.x*m, r.y*m, 100, 100);
      graphics.drawRect(0, 0, this.game.width, this.game.height);
      graphics.endFill();

      //graphics.fixedToCamera = true;
      this.passages = metroid.mapData.passages;
      var h = 6; //15;
      var w = 8; //16;
      var l = 2;
      var pos = { x: 0, y: 0 };
      graphics.lineStyle(l, 0xffffff, 0.5);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.passages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var r = _step.value;

          if (r.type === "horizontal") {}
          //  continue;

          //graphics.beginFill(0xea5bff, 1);
          graphics.beginFill(0xFFFFFF * Math.random(), 0.5);
          //graphics.drawRect(r.x*m, r.y*m, 100, 100);
          graphics.drawRect(r.x * w - 1 + pos.x, r.y * h - 1 + pos.y, (r.x2 - r.x + 1) * w, (r.y2 - r.y + 1) * h);
          graphics.endFill();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      graphics.lineStyle(0, 0xffffff, 1);

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.passages[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var r = _step2.value;
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = r.doors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var door = _step3.value;

              if (door.left) {
                graphics.beginFill(0x2038ec, 0.5);
                graphics.drawRect(r.x * w - l + pos.x, door.y * h + h / 2 - l + pos.y, l, l);
                graphics.endFill();
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                _iterator3["return"]();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.mapGfx = {
        fullMap: graphics,
        texture: null,
        sprite: null,
        discovered: null
      };
      return;
      var texture = this.game.add.renderTexture(100, 100, 'map');
      var textureSprite = this.game.add.sprite(100, 100, texture);
      texture.renderXY(graphics, -20, -20);

      var coverMask = this.game.add.graphics(0, 0);

      // LÄGG TILLBAKS DETTA FÖR ATT DÖLJA DELAR AV KARTAN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      /*coverMask.lineStyle(0, 0x000000, 1);
      for(let i=0; i<100; i++){
        coverMask.beginFill(0x00ff00);
        coverMask.drawRect(w*(Math.floor(30*Math.random()))-l, h*(Math.floor(30*Math.random()))-l,6+l,6+l);
        coverMask.endFill();
      }
      textureSprite.mask = coverMask;*/
      graphics.exists = false;

      this.mapGfx = {
        fullMap: graphics,
        texture: texture,
        sprite: textureSprite,
        discovered: coverMask
      };
      metroid.mapGfx = this.mapGfx;
    }
  }, {
    key: "drawMap2",
    value: function drawMap2() {
      var graphics = this.add.graphics(0, 0);
      /*graphics.beginFill(0xFF0000, 1);
      //graphics.drawRect(r.x*m, r.y*m, 100, 100);
      graphics.drawRect(0, 0, this.game.width, this.game.height);
      graphics.endFill();*/

      //graphics.fixedToCamera = true;
      this.passages = metroid.mapData.passages;
      var h = 6; //15;
      var w = 8; //16;
      var l = 2;
      var pos = { x: 0, y: 0 };
      graphics.lineStyle(l, 0xffffff, 1);

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.passages[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var r = _step4.value;

          graphics.beginFill(0xea5bff, 1);
          //graphics.drawRect(r.x*m, r.y*m, 100, 100);
          graphics.drawRect(r.x * w - 1 + pos.x, r.y * h - 1 + pos.y, (r.x2 - r.x + 1) * w, (r.y2 - r.y + 1) * h);
          graphics.endFill();
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      graphics.lineStyle(0, 0xffffff, 1);

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.passages[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var r = _step5.value;
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = r.doors[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var door = _step6.value;

              if (door.left) {
                graphics.beginFill(0x2038ec, 1);
                graphics.drawRect(r.x * w - l + pos.x, door.y * h + h / 2 - l + pos.y, l, l);
                graphics.endFill();
              }
            }

            /*      if(r.doorLeft){
                    graphics.beginFill(0xFFFFFF * Math.random(), 1);
                    graphics.drawRect(r.x*w - l, r.y*h+h/2-l, l, l);
                    graphics.endFill();
                  }*/
            /*  if(r.doorRight){
                graphics.beginFill(0xFFFFFF * Math.random(), 1);
                graphics.drawRect(r.x2*w+w - l, r.y*h+h/2-l, l, l);
                graphics.endFill();
              }*/
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
                _iterator6["return"]();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }
        }

        // FUNGERAR:
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      var mask = this.game.add.graphics(0, 0);
      mask.beginFill(0x00FFff);
      mask.drawRect(0, 0, (w + 2) * 6, (h + 2) * 6);
      mask.endFill();
      //  graphics.mask = mask;

      var cover = null;
      /*this.game.add.graphics(0, 0);
      cover.beginFill(0x000000);
      cover.drawRect(0,0,this.game.width,this.game.height);
      cover.endFill();*/

      var coverMask = null;
      /*this.game.add.graphics(0, 0);
      coverMask.lineStyle(0, 0x000000, 1);
      for(let i=0; i<100; i++){
        coverMask.beginFill(0x00ff00);
        coverMask.drawRect(w*(Math.floor(30*Math.random()))-l, h*(Math.floor(30*Math.random()))-l,6+l,6+l);
        coverMask.endFill();
      }
      cover.mask = coverMask;
      this.mask.mask = this.maskMask;*/

      graphics.fixedToCamera = true;
      graphics.x = this.game.width - 100;

      //this.visible.alpha = 0;
      this.mapGfx = {
        map: graphics,
        cover: cover,
        coverMask: coverMask
      };

      /*
          //	A mask is a Graphics object
          let mask = this.game.add.graphics(0, 0);
           //	Shapes drawn to the Graphics object must be filled.
          mask.beginFill(0xffffff);
           //	Here we'll draw a circle
          mask.drawCircle(100, 100, 100);
           //	And apply it to the Sprite
          graphics.mask = mask;*/

      // 1. Mask för att dölja områden
      // 2. Mask för att klippa ut synlig

      // 3. Flytta graphics rätt
    }
  }]);

  return DrawMap;
})(Phaser.State);

exports["default"] = DrawMap;
module.exports = exports["default"];

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _sharedControls = require('../shared/Controls');

var _sharedControls2 = _interopRequireDefault(_sharedControls);

var _sharedRoomTransition = require('../shared/roomTransition');

var _sharedRoomTransition2 = _interopRequireDefault(_sharedRoomTransition);

var _stuffPauseControl = require('../stuff/PauseControl');

var _stuffPauseControl2 = _interopRequireDefault(_stuffPauseControl);

var _stuffMetroidMap = require('../stuff/MetroidMap');

var _stuffMetroidMap2 = _interopRequireDefault(_stuffMetroidMap);

var _enemiesCrawler = require('../enemies/Crawler');

var _enemiesCrawler2 = _interopRequireDefault(_enemiesCrawler);

var _enemiesRipper = require('../enemies/Ripper');

var _enemiesRipper2 = _interopRequireDefault(_enemiesRipper);

var _enemiesSkree = require('../enemies/Skree');

var _enemiesSkree2 = _interopRequireDefault(_enemiesSkree);

var _enemiesRio = require('../enemies/Rio');

var _enemiesRio2 = _interopRequireDefault(_enemiesRio);

var _enemiesWaver = require('../enemies/Waver');

var _enemiesWaver2 = _interopRequireDefault(_enemiesWaver);

var _enemiesZeb = require('../enemies/Zeb');

var _enemiesZeb2 = _interopRequireDefault(_enemiesZeb);

var _enemiesMellow = require('../enemies/Mellow');

var _enemiesMellow2 = _interopRequireDefault(_enemiesMellow);

var _enemiesKraid = require('../enemies/Kraid');

var _enemiesKraid2 = _interopRequireDefault(_enemiesKraid);

var _stuffSamus = require('../stuff/Samus');

var _stuffSamus2 = _interopRequireDefault(_stuffSamus);

var _stuffWeapons = require('../stuff/Weapons');

var _stuffWeapons2 = _interopRequireDefault(_stuffWeapons);

var _stuffDoor = require('../stuff/Door');

var _stuffDoor2 = _interopRequireDefault(_stuffDoor);

var _stuffBlock = require('../stuff/Block');

var _stuffBlock2 = _interopRequireDefault(_stuffBlock);

var _stuffPickup = require('../stuff/Pickup');

var _stuffPickup2 = _interopRequireDefault(_stuffPickup);

var _stuffPool = require('../stuff/Pool');

var _stuffPool2 = _interopRequireDefault(_stuffPool);

var _stuffHUD = require('../stuff/HUD');

var _stuffHUD2 = _interopRequireDefault(_stuffHUD);

var _stuffDebugGUI = require('../stuff/debugGUI');

var _stuffDebugGUI2 = _interopRequireDefault(_stuffDebugGUI);

/*1. KOLLA OM SCHAKT
2. KOLLA OM KORRIDOR (EJ UTESLUTNING)
3. OM INGET: ENRUMMARE
4. Om S: Kolla om under också är det
Korridorkoll:
5. Om korridor: Kolla så att

CHECKROOM: FLOODFILL istället för vertical and horizontal. Lava måste finnas som blockerande och ej blockerande
2.


*/

var GameState = (function (_Phaser$State) {
  _inherits(GameState, _Phaser$State);

  function GameState() {
    _classCallCheck(this, GameState);

    _get(Object.getPrototypeOf(GameState.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(GameState, [{
    key: 'create',
    value: function create() {
      //this.game.input.onDown.add(this.gofull, this);
      metroid.currentSave = {
        takenItems: [],
        items: {}
      };
      if (this.game.device.touch) {
        metroid.stick = metroid.pad.addDPad(0, 0, 200, 'dpad');
        metroid.stick.scale = 0.35;
        metroid.stick.alignBottomLeft(0);
        metroid.VirtualJoystickValues = {};

        metroid.buttonA = metroid.pad.addButton(500, 520, 'dpad', 'button1-up', 'button1-down');
        metroid.buttonA.onDown.add(function () {
          metroid.VirtualJoystickValues.A = true;
        }, this);
        metroid.buttonA.onUp.add(function () {
          metroid.VirtualJoystickValues.A = false;
        }, this);
        metroid.buttonA.scale = 0.35;
        metroid.buttonA.alignBottomRight(30);

        metroid.buttonB = metroid.pad.addButton(615, 450, 'dpad', 'button2-up', 'button2-down');
        metroid.buttonB.onDown.add(function () {
          metroid.VirtualJoystickValues.B = true;
        }, this);
        metroid.buttonB.onUp.add(function () {
          metroid.VirtualJoystickValues.B = false;
        }, this);
        metroid.buttonB.scale = 0.35;
        metroid.buttonB.alignBottomRight(0);

        metroid.buttonM = metroid.pad.addButton(this.game.width / 3, (450 + 520) / 2, 'dpad', 'button3-up', 'button3-down');
        metroid.buttonM.onDown.add(function () {
          metroid.VirtualJoystickValues.M = true;
        }, this);
        metroid.buttonM.onUp.add(function () {
          metroid.VirtualJoystickValues.M = false;
        }, this);
        metroid.buttonM.scale = 0.35;
        metroid.buttonM.alignBottomRight(15);
        metroid.buttonM.posX = this.game.width / 2;
        metroid.buttonM.alpha = 0;
      } else {
        metroid.stick = {
          direction: null,
          multiDirections: {
            up: false,
            right: false,
            down: false,
            left: false
          }
        };
        metroid.buttonA = {
          isDown: false
        };
        metroid.buttonB = {
          isDown: false
        };
        metroid.buttonM = {
          isDown: false
        };
      }

      metroid.bounds = this.game.world.bounds;
      metroid.temps = {
        pickingUp: false
      };
      metroid.game = this.game;
      metroid.pause = new _stuffPauseControl2['default'](this.game);

      var game = this.game;
      //game.scale.setScreenSize();
      metroid.settings = {
        aspectRatio: "16:9"
      };

      metroid.music['default'] = metroid.music.brinstar;
      metroid.music.current = metroid.music['default'];

      metroid.currentWeapon = "icebeam";
      this.physics.startSystem(Phaser.Physics.ARCADE);
      this.physics.arcade.gravity.y = 500;
      this.roomData = {
        x: 2,
        y: 13
      };
      this.rooms = [];
      //let center = { x: this.game.world.centerX, y: this.game.world.centerY }
      //let text = new RainbowText(this.game, center.x, center.y, "- phaser -\nwith a sprinkle of\nES6 dust!");
      //text.anchor.set(0.5);
      this.controls = new _sharedControls2['default'](this);
      this.roomTransition = new _sharedRoomTransition2['default'](this);
      // / this.roomTransition = new roomTransition(this);
      console.log(this.controls.getPressedKeys());

      metroid.samus = new _stuffSamus2['default'](this.game, 640, 3272 + 16 - 64 + 4 * 16 + 6);
      metroid.samus2 = new _stuffSamus2['default'](this.game, 640 + 16, 3272 + 16 - 64 + 4 * 16 + 6);

      // Pooler
      //this.poolFactory = new Pool();
      // Doors and destroyable stuff. Non-tiles that can still block enemies
      //metroid.objects = this.game.add.group();
      // 1. Door pool
      metroid.doors = new _stuffPool2['default'](this, _stuffDoor2['default'], 10, "Doors");
      /*metroid.doors.
      for (var i = 0; i < 11; i++) { // 10 doors is more than enough...
        metroid.doors.add(new Door(this.game), true);
      }*/
      //return this;
      // 2. Blocks pool (destroyable)
      metroid.blocks = new _stuffPool2['default'](this, _stuffBlock2['default'], 30, "Blocks");
      metroid.pickups = new _stuffPool2['default'](this, _stuffPickup2['default'], 30, "Pickups");
      // enemies
      metroid.enemies = this.game.add.group();
      metroid.rippers = new _stuffPool2['default'](this, _enemiesRipper2['default'], 30, "Rippers", true);
      metroid.skrees = new _stuffPool2['default'](this, _enemiesSkree2['default'], 30, "Skrees", true);
      metroid.rios = new _stuffPool2['default'](this, _enemiesRio2['default'], 30, "Rios", true);
      metroid.wavers = new _stuffPool2['default'](this, _enemiesWaver2['default'], 30, "Wavers", true);
      metroid.zebs = new _stuffPool2['default'](this, _enemiesZeb2['default'], 30, "Zebs", true);
      metroid.crawlers = new _stuffPool2['default'](this, _enemiesCrawler2['default'], 30, "Crawlers", true);
      metroid.mellows = new _stuffPool2['default'](this, _enemiesMellow2['default'], 30, "Mellows", true);
      metroid.kraids = new _stuffPool2['default'](this, _enemiesKraid2['default'], 30, "Kraids", true);

      // bullets

      // pickups (både temp och från rummet)

      this.game.camera.follow(metroid.samus);

      //  this.crawler = new Crawler(this, metroid.samus.x - 16, metroid.samus.y);

      console.log("MAP");

      metroid.map = new _stuffMetroidMap2['default'](this.game, 'map');
      metroid.ground = metroid.map.groundLayer;
      metroid.ground.resizeWorld();

      //    this.game.collisionsUpdated = false;

      /*   this.game.time.events.add(2,
            function() {
              metroid.map.setCollisionBetween(2, 64);
              metroid.map.setCollisionBetween(65, 72); // Dörrtiles = används ej
              metroid.map.setCollisionBetween(73, 182);
              //this.map.setCollisionBetween(185, 187); // LAVA
              metroid.map.setCollisionBetween(188, 381);
              this.game.collisionsUpdated = true;
            }, this    );
          //  this.map.setCollisionByExclusion([0,1],true);
      
      
          metroid.map.setCollisionBetween(2, 64);
          metroid.map.setCollisionBetween(65, 72); // Dörrtiles = används ej
          metroid.map.setCollisionBetween(73, 182);
          //this.map.setCollisionBetween(185, 187); // LAVA
          metroid.map.setCollisionBetween(188, 381);*/
      //  this.game.collisionsUpdated = true;

      console.log("ENDMAP");
      //this.map.setCollision(40);

      //18,8 = problematiskt RUM
      //

      // start: 2,13
      // shaft: 10,12
      //this.camera.x = this.roomData.x * 16 * 16; //+this.t;
      //this.camera.y = this.roomData.y * 16 * 15; //+this.t;

      this.t = 2800;

      /*  for (let rX = 0; rX < Math.ceil(this.map.width / 16); rX++) {
          this.rooms[rX] = [];
          for (let rY = 0; rY < Math.ceil(this.map.height / 15); rY++) {
            this.rooms[rX][rY] = false;
          }
        }*/

      this.rooms = [];

      //this.loadRooms(this.roomData.x * 16 * 16, this.roomData.y * 16 * 15);

      this.rooms = metroid.map.rooms;
      console.log(this.rooms);

      var graphics = this.add.graphics(0, 0);
      graphics.fixedToCamera = true;
      // graphics.lineStyle(2, 0xffd900, 1);
      console.log(this.rooms);
      var r = undefined;
      var m = 5;
      for (var i in this.rooms) {
        r = this.rooms[i];

        graphics.beginFill(0xFFFFFF * Math.random(), 1);
        //graphics.drawRect(r.x*m, r.y*m, 100, 100);
        graphics.drawRect(r.x * m, r.y * m, (r.x2 - r.x + 1) * m, (r.y2 - r.y + 1) * m);
        graphics.endFill();
      }
      graphics.beginFill(0xFFFFFF, 1);
      //graphics.drawRect(r.x*m, r.y*m, 100, 100);
      graphics.drawRect(this.roomData.x * m + 1, this.roomData.y * m + 1, m - 2, m - 2);
      graphics.endFill();
      graphics.alpha = 0;
      var room = undefined;
      /*let sx = Math.floor(metroid.samus.x/(16*16));
      let sy = Math.floor(metroid.samus.y/(16*15));
      for (var i in this.rooms) {
         room = this.rooms[i];
            if (room.x<= sx && room.x2 >= sx && room.y <= sy && room.y2 >= sy) {
              console.log("RUM",room);
              this.game.world.setBounds(room.x*16*16,room.y*16*15,(room.x2-room.x+1)*16*16,(room.y2-room.y+1)*16*15)
            }
            //console.log(room.x*16*16, room.x2*16*16+16,metroid.samus.x);
      }*/

      metroid.currentRoom = { x: 1e10, x2: -10, y: 0, y2: 0 };
      console.log("ok");
      this.roomTransition.checkCurrentRoom(metroid.samus.x, metroid.samus.y);
      console.log("ok");
      console.log(metroid.currentRoom);

      //console.log(sx,sy);

      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!");
      //          return false;
      this.t = 0;
      console.log(this.game.world.bounds);

      this.weapons = new _stuffWeapons2['default'](this);
      console.log(this.weapons);
      metroid.weapons = this.weapons;
      //this.roomTransition = new roomTransition(this);

      if (game.width != 256) {
        var PAL = this.add.graphics(0, 0);
        PAL.fixedToCamera = true;

        PAL.beginFill(0, 0.7);
        PAL.drawRect(0, 0, 170 / 2, game.height);

        PAL.drawRect(game.width - 170 / 2, 0, 170 / 2, game.height);
        PAL.endFill();
      }

      metroid.HUD = new _stuffHUD2['default'](this.game);

      metroid.debugGfx = this.add.graphics(0, 0);
      console.log("marumari" + metroid.samus.items.marumari);
      if (!metroid.debugGUI) {
        metroid.debugGUI = new _stuffDebugGUI2['default']();
      }
      metroid.debugGUI.setupGUI();
      console.log(metroid.currentRoom);
    }
  }, {
    key: 'update',
    value: function update() {
      this.controls.getPressedKeys();
      metroid.music.title.stop();

      //  metroid.samus.x+=5;//  -2*Math.random();

      if (this.ongoingTransition) {
        this.roomTransition.updateTransition();
        metroid.samus.body.velocity.x = 0;
        metroid.samus.body.velocity.y = 0;
      } else {
        this.roomTransition.checkCurrentRoom(metroid.samus.x, metroid.samus.y);
      }

      //this.camera.x=this.roomData.x*16*16;//+this.t;
      //this.camera.y=this.roomData.y*16*15;//+this.t;
      /*if (this.t / 64 == Math.floor(this.t / 64)) {
        //this.roomData.y-=1;
        console.log(this.t);
      }*/
    }
  }, {
    key: 'pauseUpdate',
    value: function pauseUpdate() {
      if (!metroid.temps.pickingUp) {
        this.controls.getPressedKeys();
        var pressedKeys = metroid.keys.isPressed;
        var wasPressed = metroid.keys.wasPressed;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      //this.game.debug.body(metroid.samus);

      return;
      if (this.game.device.touch) {
        this.game.debug.text(this.game.time.fps, 20, 32);
        return;
      }
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = metroid.weapons.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          this.game.debug.body(item);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = metroid.crawlers.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;

          this.game.debug.body(item);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.game.debug.text(this.game.time.fps, 20, 32);
      //return;
      //  this.game.debug.text(metroid.stick.direction, 20, 58);
      this.game.debug.body(metroid.samus);
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = metroid.pickups.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var item = _step3.value;

          this.game.debug.body(item);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return;
      if (this.crawler.debugCorners) {
        this.game.debug.text(this.crawler.debugCorners.ground1 + " " + this.crawler.debugCorners.ground1 + " " + this.crawler.debugCorners.wall, 20, 32);
      }
      return;
      if (this.crawler) {

        this.game.debug.body(this.crawler);

        var crawlerCorners = [{
          x: this.crawler.x,
          y: this.crawler.y
        }, {
          x: this.crawler.x + this.crawler.body.width,
          y: this.crawler.y
        }];

        var m = 1;
        metroid.debugGfx.clear();
        metroid.debugGfx.beginFill(0xFFFFFF, 1);
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = crawlerCorners[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var corner = _step4.value;

            metroid.debugGfx.drawRect(corner.x - 1, corner.y - 1, 3, 3);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4['return']) {
              _iterator4['return']();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        metroid.debugGfx.endFill();
      }

      if (true || metroid.debug) {
        return;
      }
      var game = this.game;
      //this.game.debug.bodyInfo(metroid.samus,32,32);
      this.game.debug.body(metroid.samus);
      if (metroid.debugDoor) {
        this.game.debug.body(metroid.debugDoor);
      }
      if (metroid.skreeDebug) {
        this.game.debug.body(metroid.skreeDebug);
      }
      if (metroid.debugRio) {
        this.game.debug.body(metroid.debugRio);
      }
      // this.game.debug.text( this.pressedKeys.down+" -- "+this.pressedKeys.up+" - "+metroid.samus.forms.ball, 20, 20 );
      this.game.debug.text(metroid.samus.body.blocked.down + " " + metroid.samus.currentAnimation, 20, 32);

      //game.debug.bodyInfo(sprite, 32, 32);
    }
  }, {
    key: 'gofull',
    value: function gofull() {
      if (this.game.scale.isFullScreen) {
        //this.game.scale.stopFullScreen();
      } else {
          this.game.scale.startFullScreen(false);
        }
    }
  }]);

  return GameState;
})(Phaser.State);

exports['default'] = GameState;
module.exports = exports['default'];

},{"../enemies/Crawler":1,"../enemies/Kraid":3,"../enemies/Mellow":4,"../enemies/Rio":5,"../enemies/Ripper":6,"../enemies/Skree":7,"../enemies/Waver":8,"../enemies/Zeb":9,"../shared/Controls":11,"../shared/roomTransition":12,"../stuff/Block":18,"../stuff/Door":20,"../stuff/HUD":21,"../stuff/MetroidMap":23,"../stuff/PauseControl":24,"../stuff/Pickup":25,"../stuff/Pool":26,"../stuff/Samus":27,"../stuff/Weapons":28,"../stuff/debugGUI":29}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _stuffLoadAndSave = require('../stuff/loadAndSave');

var _stuffLoadAndSave2 = _interopRequireDefault(_stuffLoadAndSave);

var _stuffMapParser = require('../stuff/MapParser');

var _stuffMapParser2 = _interopRequireDefault(_stuffMapParser);

var Preload = (function (_Phaser$State) {
  _inherits(Preload, _Phaser$State);

  function Preload() {
    _classCallCheck(this, Preload);

    _get(Object.getPrototypeOf(Preload.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Preload, [{
    key: 'preload',
    value: function preload() {
      //game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
      this.text = this.add.text(32, 32, 'Loading...', {
        fill: '#ffffff'
      });
      metroid.game = this.game;
      metroid.localStorage = typeof Storage !== "undefined";
    }
  }, {
    key: 'create',
    value: function create() {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
      //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT; // Vid 16:9
      //this.game.scale.setMinMax(120, 80, 1200, 800);
      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.pageAlignVertically = true;
      this.game.time.advancedTiming = true;
      this.game.smoothed = false;

      this.load.onLoadStart.add(this.loadStart, this);
      this.load.onFileComplete.add(this.fileComplete, this);
      this.load.onLoadComplete.add(this.loadComplete, this);
      this.loadAll();
    }
  }, {
    key: 'loadAll',
    value: function loadAll() {
      var thisloadpath = ""; //Placeholder for  2.3.0
      /*MJG*/
      this.game.isLive = true;
      /*MJG*/
      if (this.game.isLive) {
        this.load.path = "/game/";
      } else {
        //    this.load.path = "/";
        //thisloadpath = "";
      }

      this.load.script('collideWithCamera.js', 'collideWithCamera.js');

      //this.load.tilemap('map', thisloadpath + 'maps/brinstarFromTiled.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.tilemap('map', thisloadpath + 'maps/metroid-complete.json', null, Phaser.Tilemap.TILED_JSON);
      //this.load.tilemap('map', thisloadpath + 'maps/metroid-map-testroomparser.json', null, Phaser.Tilemap.TILED_JSON); <-- checkpassages2
      //this.load.image('brinstarFromTiled-Tileset', thisloadpath + 'images/brinstarFromTiled-Tileset.png');
      this.load.image('tiles', thisloadpath + 'maps/metroid-tileset.png');
      this.load.image('tiles16bit', thisloadpath + 'maps/metroid-tileset-16bit.png'); ///MJG

      //this.load.image('samus', 'images/samus.png');
      //this.load.image('ball', 'images/ball.png');
      this.load.image('crawler', thisloadpath + 'images/crawler.png');
      this.load.atlas('sprites', thisloadpath + 'images/spriteatlas.png', thisloadpath + 'images/spriteatlas.json', Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
      this.load.image('sprites16bit', thisloadpath + 'images/spriteatlas-16bit.png');
      this.load.image('font', thisloadpath + 'images/font.png');
      this.load.image('fontYellow', thisloadpath + 'images/fontYellow.png');

      this.load.audio('mystery', [thisloadpath + 'music/04 - Item Room.mp3']);
      this.load.audio('title', [thisloadpath + 'music/01 - Title.mp3']);

      this.load.audio('brinstar', [thisloadpath + 'music/Brinstar.mp3']);
      this.load.audio('hideout1', [thisloadpath + 'music/07 - Kraid.mp3']);
      this.load.audio('hideout2', [thisloadpath + 'music/08 - Ridley.mp3']);
      this.load.audio('tourian', [thisloadpath + 'music/09 - Tourian.mp3']);
      this.load.audio('norfair', [thisloadpath + 'music/06 - Norfair.mp3']);

      //Samus
      this.load.audio('jump', [thisloadpath + 'soundEffects/jump.wav']);
      this.load.audio('ball', [thisloadpath + 'soundEffects/samus_morphball.wav']);
      this.load.audio('hurt', [thisloadpath + 'soundEffects/samus_hurt.wav']);
      this.load.audio('panic', [thisloadpath + 'soundEffects/samus_near_dead.wav']);

      this.load.audio('screwattack', [thisloadpath + 'soundEffects/screw_attack.wav']);
      this.load.audio('appear', [thisloadpath + 'music/02 - Samus Appearance Jingle.mp3']);
      this.load.audio('die', [thisloadpath + 'soundEffects/samus_die.wav']);

      this.load.audio('door', [thisloadpath + 'soundEffects/door.wav']);

      this.load.audio('energy', [thisloadpath + 'soundEffects/health.wav']);
      this.load.audio('missile', [thisloadpath + 'soundEffects/rocket_ammo.wav']);
      //eNEMIES
      this.load.audio('spawn', [thisloadpath + 'soundEffects/enemy_spawn.wav']);
      this.load.audio('enemyHurt1', [thisloadpath + 'soundEffects/enemy_die1.wav']);
      this.load.audio('enemyHurt2', [thisloadpath + 'soundEffects/enemy_die2.wav']);

      // Vapen
      this.load.audio('bombBoom', [thisloadpath + 'soundEffects/bomb_explode.wav']);
      this.load.audio('bombSet', [thisloadpath + 'soundEffects/bomb_set.wav']);
      this.load.audio('icebeam', [thisloadpath + 'soundEffects/ice_beam.wav']);
      this.load.audio('longNormal', [thisloadpath + 'soundEffects/long_beam.wav']);
      this.load.audio('missileShot', [thisloadpath + 'soundEffects/rocket_shot.wav']);
      this.load.audio('shortNormal', [thisloadpath + 'soundEffects/short_beam.wav']);
      this.load.audio('wave', [thisloadpath + 'soundEffects/wave_beam.wav']);
      this.load.audio('ricochetShort', [thisloadpath + 'soundEffects/ricochet.wav']);
      this.load.audio('ricochetLong', [thisloadpath + 'soundEffects/ricochet_burst.wav']);
      // Other
      this.load.audio('gotItem', [thisloadpath + 'music/05 - Item Obtainment Jingle.mp3']);
      this.load.audio('pause', [thisloadpath + 'soundEffects/pause.wav']);
      this.load.audio('drowning', [thisloadpath + 'soundEffects/samus_drowning.wav']);

      this.load.audio('missile', [thisloadpath + 'soundEffects/rocket_ammo.wav']);

      if (this.game.device.touch) {
        metroid.pad = this.game.plugins.add(Phaser.VirtualJoystick);
        this.load.atlas('dpad', thisloadpath + 'plugins/Phaser-Virtual-Joystick-Plugin-v1/skins/dpad.png', thisloadpath + 'plugins/Phaser-Virtual-Joystick-Plugin-v1/skins/dpad.json');
      }

      if (this.game.device.ios || this.game.device.android) {
        //  alert("The current version is a bit slow on mobiles,\nthis will be fixed in the upcoming version.\nSorry about that.");
      }

      this.load.start();
    }
  }, {
    key: 'loadStart',
    value: function loadStart() {
      console.log("Loading");
    }
  }, {
    key: 'fileComplete',
    value: function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
      //this.text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
      this.text.setText(progress + "%");
    }
  }, {
    key: 'loadComplete',
    value: function loadComplete() {
      /*if (this.game.device.touch) {
        metroid.stick = metroid.pad.addDPad(0, 0, 200, 'dpad');
        metroid.stick.scale = 0.35;
        metroid.stick.alignBottomLeft(0);
        metroid.VirtualJoystickValues = {};
         metroid.buttonA = metroid.pad.addButton(500, 520, 'dpad', 'button1-up', 'button1-down');
        metroid.buttonA.onDown.add(function() {
          metroid.VirtualJoystickValues.A = true;
        }, this);
        metroid.buttonA.onUp.add(function() {
          metroid.VirtualJoystickValues.A = false;
        }, this);
        metroid.buttonA.scale = 0.35;
        metroid.buttonA.alignBottomRight(30);
         metroid.buttonB = metroid.pad.addButton(615, 450, 'dpad', 'button2-up', 'button2-down');
        metroid.buttonB.onDown.add(function() {
          metroid.VirtualJoystickValues.B = true;
        }, this);
        metroid.buttonB.onUp.add(function() {
          metroid.VirtualJoystickValues.B = false;
        }, this);
        metroid.buttonB.scale = 0.35;
        metroid.buttonB.alignBottomRight(0);
          metroid.buttonM = metroid.pad.addButton(this.game.width/3, (450+520)/2, 'dpad', 'button3-up', 'button3-down');
        metroid.buttonM.onDown.add(function() {
          metroid.VirtualJoystickValues.M = true;
        }, this);
        metroid.buttonM.onUp.add(function() {
          metroid.VirtualJoystickValues.M = false;
        }, this);
        metroid.buttonM.scale = 0.35;
        metroid.buttonM.alignBottomRight(15);
        metroid.buttonM.posX=this.game.width/2;
      metroid.buttonM.alpha = 0;
       } else {
        metroid.stick = {
          direction: null,
          multiDirections: {
            up: false,
            right: false,
            down: false,
            left: false
          }};
          metroid.buttonA = {
            isDown: false
          };
          metroid.buttonB = {
            isDown: false
          };
          metroid.buttonM = {
            isDown: false
          };
         }*/

      metroid.io = new _stuffLoadAndSave2['default'](this.game);

      metroid.music = {
        //title: this.game.add.audio('title'),
        mystery: this.game.add.audio('mystery'),
        appear: this.game.add.audio('appear'),
        title: this.game.add.audio('title'),
        current: this.game.add.audio('mystery'),
        brinstar: this.game.add.audio('brinstar'),
        hideout1: this.game.add.audio('hideout1'),
        hideout2: this.game.add.audio('hideout2'),
        tourian: this.game.add.audio('tourian'),
        norfair: this.game.add.audio('norfair')

      };
      metroid.soundEffects = {
        //title: this.game.add.audio('title'),
        drowning: this.game.add.audio('drowning'),
        hurt: this.game.add.audio('hurt'),
        enemyHurt1: this.game.add.audio('enemyHurt1'),
        enemyHurt2: this.game.add.audio('enemyHurt2'),
        panic: this.game.add.audio('panic')

      };

      metroid.mapData = new _stuffMapParser2['default'](this.game);
      this.state.start('Title');
      //  this.state.start('DrawMap');
    }
  }]);

  return Preload;
})(Phaser.State);

exports['default'] = Preload;
module.exports = exports['default'];

},{"../stuff/MapParser":22,"../stuff/loadAndSave":30}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _sharedControls = require('../shared/Controls');

var _sharedControls2 = _interopRequireDefault(_sharedControls);

var _stuffMetroidMap = require('../stuff/MetroidMap');

var _stuffMetroidMap2 = _interopRequireDefault(_stuffMetroidMap);

var _stuffLoadAndSave = require('../stuff/loadAndSave');

var _stuffLoadAndSave2 = _interopRequireDefault(_stuffLoadAndSave);

var SelectGame = (function (_Phaser$State) {
  _inherits(SelectGame, _Phaser$State);

  function SelectGame() {
    _classCallCheck(this, SelectGame);

    _get(Object.getPrototypeOf(SelectGame.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SelectGame, [{
    key: 'create',
    value: function create() {
      this.background = this.add.sprite(19, 33, "sprites", "saves/screen");
      this.marker = this.add.sprite(19 + 5, 33 + 33, "sprites", "saves/marker");

      if (!metroid.stick) {
        metroid.stick = {
          direction: null,
          multiDirections: {
            up: false,
            right: false,
            down: false,
            left: false
          }
        };
        metroid.buttonA = {
          isDown: false
        };
        metroid.buttonB = {
          isDown: false
        };
        metroid.buttonM = {
          isDown: false
        };
      } else if (metroid.stick.hasOwnProperty("destroy")) {
        metroid.stick.destroy();
        metroid.buttonA.destroy();
        metroid.buttonB.destroy();
        metroid.buttonM.destroy();
      }

      this.controls = new _sharedControls2['default'](this);
      //#f0bc3c

      this.slots = [];
      this.saveFile = [metroid.io.load(0, null, true), metroid.io.load(1, null, true), metroid.io.load(2, null, true)];

      for (var slot = 0; slot < 3; slot++) {
        this.slots[slot] = {};
        this.slots[slot].nameText = this.game.add.retroFont('fontYellow', 8, 8, Phaser.RetroFont.TEXT_SET6, null, 0, 0);
        /*let clickSprite = this.game.add.image(19 + 61, 33 + 29 + 3 + slot * 32, this.slots[slot].nameText);
        clickSprite.inputEnabled = true;
        clickSprite.input.pixelPerfectClick = true;
        clickSprite.events.onInputDown.add(this.menuClick, this);*/

        this.slots[slot].gamesText = this.game.add.retroFont('fontYellow', 8, 8, Phaser.RetroFont.TEXT_SET6, null, 0, 0);
        this.game.add.image(19 + 61 + 32, 33 + 29 + 3 + 8 + slot * 32, this.slots[slot].gamesText);
        this.slots[slot].dayText = this.game.add.retroFont('fontYellow', 8, 8, Phaser.RetroFont.TEXT_SET6, null, 0, 0);
        this.game.add.image(19 + 61 + 120, 33 + 29 + 3 + slot * 32, this.slots[slot].dayText);
        //this.add(this.game.add.image(4 * 8 + 4, 10, this.energyCntText));*/
        this.slots[slot].energy = [];
        for (var i = 0; i < 6; i++) {
          this.slots[slot].energy[i] = this.game.add.sprite(19 + 61 + 64 + 8 * i, 33 + 29 + 3 + slot * 32, "sprites", "hud/full");
          this.slots[slot].energy[i].alpha = 0;
        }

        if (this.saveFile[slot]) {
          this.show(slot);
        }
      }

      this.registerText = this.game.add.retroFont('fontYellow', 8, 8, Phaser.RetroFont.TEXT_SET6, null, 0, 0);
      this.game.add.image(19 + 61 - 5 * 8, 33 + 128 + 24 * 0, this.registerText);
      this.registerText.setText("REGISTER NEW");

      this.killText = this.game.add.retroFont('fontYellow', 8, 8, Phaser.RetroFont.TEXT_SET6, null, 0, 0);
      this.game.add.image(19 + 61 - 5 * 8, 33 + 128 + 24 * 1, this.killText);
      this.killText.setText("KILL MODE");

      this.choice = 0;
      while (this.choice < 3 && !this.saveFile[this.choice]) {
        this.choice++;
      }
      this.mode = "normal";
      this.tween = {
        isRunning: false
      };

      this.rects = [{ x: 39, y: 59, w: 183, h: 24, choice: 0 }, { x: 39, y: 59 + 32, w: 183, h: 24, choice: 1 }, { x: 39, y: 59 + 64, w: 183, h: 24, choice: 2 }, { x: 39, y: 159, w: 122, h: 12, choice: 3 }, { x: 39, y: 159 + 24, w: 122, h: 12, choice: 4 }];
      /*    let graphics = this.game.add.graphics(0, 0);
          for(let r of this.rects){
            graphics.beginFill(0xea5bff, 0.5);
            graphics.drawRect(r.x,r.y,r.w,r.h);
            graphics.endFill();
          }*/
      this.fingerDown = false;
      this.fingerWasDown = false;
    }
  }, {
    key: 'update',
    value: function update() {
      this.controls.getPressedKeys();

      /* KEYS */
      var moveMarker = 0;
      if (metroid.keys.isPressed.up && !metroid.keys.wasPressed.up) {
        moveMarker = -1;
        this.game.sound.play('shortNormal');
      } else if (metroid.keys.isPressed.down && !metroid.keys.wasPressed.down) {
        moveMarker = 1;
        this.game.sound.play('shortNormal');
      }
      if (metroid.keys.isPressed.fire && !metroid.keys.wasPressed.fire || this.fingerDown && !this.fingerWasDown) {
        if (this.tween.isRunning) {
          return;
        }
        this.tween = this.game.add.tween(this.marker).to({
          x: this.marker.x + 8
        }, 100);
        this.tween.to({
          x: this.marker.x
        }, 100);
        this.tween.start();
        switch (this.choice) {
          case 0:
          case 1:
          case 2:
            if (this.mode === "register") {
              this.game.sound.play('energy');
              metroid.io['new'](this.choice, "SAMUS " + (this.choice + 1));
              this.saveFile[this.choice] = metroid.io.load(this.choice, null, true);
              this.show(this.choice);
              this.mode = "normal";
              this.registerText.setText("REGISTER NEW");
              this.killText.setText("KILL MODE");
            } else if (this.mode === "elimination") {
              metroid.game.sound.play('die');
              metroid.io.kill(this.choice);
              this.mode = "normal";
              this.registerText.setText("REGISTER NEW");
              this.killText.setText("KILL MODE");
              this.saveFile[this.choice] = false;
              this.show(this.choice);
              this.choice += 1;
            } else {
              // LOAD GAME
              this.game.sound.play('missileShot');
              metroid.currentSaveSlot = this.choice;
              this.state.start('GameState');
            }
            break;
          case 3:
            if (this.mode === "normal") {
              if (this.saveFile[0] && this.saveFile[1] && this.saveFile[2]) {
                this.game.sound.play('ricochetShort');
                break;
              }
              this.game.sound.play('missileShot');
              this.mode = "register";
              this.registerText.setText("CANCEL REGISTRATION");
              this.killText.setText(" ");
            } else {
              this.game.sound.play('ricochetShort');
              this.mode = "normal";
              this.registerText.setText("REGISTER NEW");
              this.killText.setText("KILL MODE");
            }

            break;
          case 4:
            if (!this.saveFile[0] && !this.saveFile[1] && !this.saveFile[2]) {
              this.game.sound.play('ricochetShort');
              break;
            }
            this.game.sound.play('missileShot');
            this.mode = "elimination";
            this.registerText.setText("CANCEL KILL MODE");
            this.killText.setText(" ");
            this.choice = 3;
            break;

        }
      }

      /* Marker position */
      this.choice += moveMarker;
      var preferedChoice = -1;
      this.fingerWasDown = this.fingerDown;
      if (metroid.game.input.pointer1.isDown) {
        console.log(metroid.game.input.pointer1);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.rects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var r = _step.value;

            if (metroid.game.input.pointer1.x > r.x && metroid.game.input.pointer1.x < r.x + r.w && metroid.game.input.pointer1.y > r.y && metroid.game.input.pointer1.y < r.y + r.h) {
              console.log(r.choice);
              this.choice = r.choice;
              preferedChoice = r.choice;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this.fingerDown = true;
      } else {
        this.fingerDown = false;
      }
      if (this.mode === "normal" && this.choice > 4 || this.mode !== "normal" && this.choice > 3) {
        this.choice = 0;
      }
      if (this.mode !== "register") {
        while (this.choice >= 0 && this.choice < 3 && !this.saveFile[this.choice]) {
          if (moveMarker === 0) {
            moveMarker = 1;
          };
          this.choice += moveMarker;
        }
      } else {
        while (this.choice >= 0 && this.choice < 3 && this.saveFile[this.choice]) {
          this.choice += moveMarker;
          if (moveMarker === 0) {
            moveMarker = 1;
          };
        }
      }
      if (this.choice < 0) {
        if (this.mode === "normal") {
          this.choice = 4;
        } else {
          this.choice = 3;
        }
      }
      if (this.choice < 3) {
        this.marker.y = 33 + 33 + 32 * this.choice;
      } else {
        this.marker.y = 33 + 128 + 24 * (this.choice - 3);
      }
      if (this.choice != preferedChoice) {
        this.fingerDown = false;
      }
    }
  }, {
    key: 'show',
    value: function show(slot) {
      if (this.saveFile[slot]) {

        var missiles = this.saveFile[slot].items.missiles.toString();
        if (this.saveFile[slot].items.missiles < 100) {
          missiles = "00" + missiles;
        } else if (this.saveFile[slot].items.missiles < 100) {
          missiles = "0" + missiles;
        }
        var deaths = this.saveFile[slot].gameVars.deaths.toString();
        for (var i = 0; i < 6 - deaths.length; i++) {
          deaths = "0" + deaths;
        }

        this.slots[slot].nameText.setText(this.saveFile[slot].gameVars.name);
        this.slots[slot].gamesText.setText(deaths);
        this.slots[slot].dayText.setText(missiles);
        if (this.saveFile[slot].items.energytank > 0) {
          for (var i = 0; i < this.saveFile[slot].items.energytank; i++) {
            this.slots[slot].energy[i].alpha = 1;
          }
        }
      } else {
        this.slots[slot].nameText.setText(" ");
        this.slots[slot].gamesText.setText(" ");
        this.slots[slot].dayText.setText(" ");

        for (var i = 0; i < 6; i++) {
          this.slots[slot].energy[i].alpha = 0;
        }
      }
    }
  }, {
    key: 'menuClick',
    value: function menuClick(obj) {
      console.log("you click", obj);
    }
  }]);

  return SelectGame;
})(Phaser.State);

exports['default'] = SelectGame;
module.exports = exports['default'];

},{"../shared/Controls":11,"../stuff/MetroidMap":23,"../stuff/loadAndSave":30}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _sharedControls = require('../shared/Controls');

var _sharedControls2 = _interopRequireDefault(_sharedControls);

var _stuffMetroidMap = require('../stuff/MetroidMap');

var _stuffMetroidMap2 = _interopRequireDefault(_stuffMetroidMap);

var Title = (function (_Phaser$State) {
  _inherits(Title, _Phaser$State);

  function Title() {
    _classCallCheck(this, Title);

    _get(Object.getPrototypeOf(Title.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Title, [{
    key: 'create',
    value: function create() {
      this.background = this.add.sprite(0, 0, "sprites", "title/background");
      this.blackBoxes = this.add.graphics(0, 0);

      this.emergencyOrder = this.add.sprite(32, 24, "sprites", "title/emergencyOrder");
      this.emergencyOrder.alpha = 0;

      this.outline = this.add.sprite(25, 71, "sprites", "title/textOutline");
      this.fill = this.add.sprite(25, 71, "sprites", "title/textFill");
      metroid.fill = this.fill;
      this.shadow = this.add.sprite(25, 71, "sprites", "title/textShadow");
      this.pushStart = this.add.sprite(this.game.width / 2, 143, "sprites", "title/pushStart");
      this.pushStart.anchor.setTo(0.5, 0.5);
      this.outline.alpha = 0;
      this.fill.alpha = 0;
      this.shadow.alpha = 0;
      this.pushStart.alpha = 0;
      this.tinkle();
      this.game.time.events.repeat(Phaser.Timer.SECOND, 1E10, this.tinkle, this);
      this.game.time.events.repeat(Phaser.Timer.SECOND / 3, 1E10, this.updateText, this);
      this.step = 0;

      //metroid.samus.x = 0;
      //metroid.samus.y = 0;
      //  this.camera.follow(null);
      //  this.game.camera.setPosition(0,0);
      metroid.game.camera.y = 0;

      this.game.world.setBounds(0, 0, metroid.game.width, metroid.game.height);
      if (metroid.music.current.isPlaying) {
        metroid.music.current.stop();
      }
      if (!metroid.stick) {
        metroid.stick = {
          direction: null,
          multiDirections: {
            up: false,
            right: false,
            down: false,
            left: false
          }
        };
        metroid.buttonA = {
          isDown: false
        };
        metroid.buttonB = {
          isDown: false
        };
        metroid.buttonM = {
          isDown: false
        };
      } else if (metroid.stick.hasOwnProperty("destroy")) {
        metroid.stick.destroy();
        metroid.buttonA.destroy();
        metroid.buttonB.destroy();
        metroid.buttonM.destroy();
      }

      this.controls = new _sharedControls2['default'](this);

      if (metroid.soundEffects.panic.isPlaying) {
        metroid.soundEffects.panic.stop();
      }

      //  metroid.testkarta = new MetroidMap(this.game, "map")
      this.energyCntText = this.game.add.retroFont('font', 8, 8, Phaser.RetroFont.TEXT_SET6, null, 0, 0);
      //this.energyCntText.setText("- S E L E C T -");
      this.game.add.image(4 * 8 + 4, 10, this.energyCntText);
      //this.add(this.game.add.image(4 * 8 + 4, 10, this.energyCntText));
      this.autostart = false;
    }
  }, {
    key: 'update',
    value: function update() {
      //this.game.camera.setPosition(0,0);
      //  metroid.game.camera.y = 0;
      this.controls.getPressedKeys();

      if (metroid.keys.isPressed.fire || metroid.game.input.pointer1.isDown || this.autostart) {
        /*metroid.io.new(5, "TEMP");
        metroid.currentSaveSlot = 5;
        this.state.start('GameState');*/
        if (metroid.mapData.loaded) {
          this.state.start('SelectGame');
        } else if (!this.autostart) {
          alert("Sorry for this generic alert\nThe map parser is not ready\nbut the game will start ASAP.");
          this.autostart = true;
        }
      }
      if (!metroid.music.title.isPlaying && metroid.music.title.isDecoded) {
        metroid.music.title.play(null, 0, 1, true);
      }
    }
  }, {
    key: 'tinkle',
    value: function tinkle() {

      this.blackBoxes.clear();
      this.blackBoxes.beginFill(0x000000, 1);
      this.blackBoxes.lineStyle(0, 0x000000, 1);
      for (var i = 0; i < 15; i++) {
        this.blackBoxes.drawRect(this.game.width * Math.random(), (this.game.height - 50 - 30) * Math.random(), 30, 30);
      }
      this.blackBoxes.endFill();
    }
  }, {
    key: 'showEmergency',
    value: function showEmergency() {
      this.fill.alpha = 0;
      this.pushStart.alpha = 0;
      this.outline.alpha = 0;
      this.shadow.alpha = 0;
      this.emergencyOrder.alpha = 1;
      this.game.time.events.add(Phaser.Timer.SECOND * 5, function () {
        this.emergencyOrder.alpha = 0;
        this.step = 0;
      }, this);
    }
  }, {
    key: 'updateText',
    value: function updateText() {

      if (this.step > 4) {
        return;
      }

      if (this.step === 3) {
        this.pushStart.alpha = 1;
        this.game.time.events.add(Phaser.Timer.SECOND * 5, this.showEmergency, this);
        this.step++;
        return;
        /*this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
          metroid.music.title.pause();
          this.state.start('GameState');
        }, this);
        this.step++;*/
        this.step++;
        return;
      }
      switch (this.step % 3) {
        case 0:
          this.shadow.alpha += 0.5;
          if (this.shadow.alpha > 1) {
            this.shadow.alpha = 1;
          }
          break;
        case 1:
          this.fill.alpha += 0.5;
          if (this.fill.alpha > 1) {
            this.fill.alpha = 1;
          }
          break;
        case 2:
          this.outline.alpha += 0.5;
          if (this.outline.alpha > 1) {
            this.outline.alpha = 1;
          }
          break;
      }
      this.step++;
      if (this.step === 3 && this.outline.alpha < 1) {
        this.step = 0;
      }
    }
  }]);

  return Title;
})(Phaser.State);

exports['default'] = Title;
module.exports = exports['default'];

},{"../shared/Controls":11,"../stuff/MetroidMap":23}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Block = (function (_Phaser$Sprite) {
  _inherits(Block, _Phaser$Sprite);

  function Block(game) {
    _classCallCheck(this, Block);

    _get(Object.getPrototypeOf(Block.prototype), "constructor", this).call(this, game, 0, 0, "sprites");
    this.animations.add("solid1", ["blocks/block1"]);
    this.animations.add("blueBall", ["pickUps/ballBlue0"]);
    var growBack = this.animations.add("blueBallGrowBack", ["pickUps/ballBlue2", "pickUps/ballBlue1", "pickUps/ballBlue0"], 7);
    var destroy = this.animations.add("blueBallDestroyed", ["pickUps/ballBlue1", "pickUps/ballBlue2"], 7);
    destroy.onComplete.add(function () {
      this.exists = false;
      this.event = this.game.time.events.add(Phaser.Timer.SECOND * 4, function () {
        this.exists = true;
        this.play("blueBallGrowBack");
        this.event = false;
      }, this);
    }, this);

    this.animations.add("growBack", ["blocks/block1explode1", "blocks/block1explode0", "blocks/block1"], 15);
    var anim = this.animations.add("explode", ["blocks/block1explode0", "blocks/block1explode1"], 15);
    anim.onComplete.add(function () {
      this.exists = false;
      if (this.item) {
        console.log("SKAPA" + this.item, this.x, this.y);
        this.itemObject = metroid.pickups.createNew(this.x / 16, this.y / 16, this.item, "forReal");
      }
      this.event = this.game.time.events.add(Phaser.Timer.SECOND * 4, function () {
        this.exists = true;
        this.play("growBack");
        this.event = false;
        if (this.itemObject) {
          console.log(this.itemObject);
          this.itemObject.alive = false;
          this.itemObject.exists = false;
        }
      }, this);
    }, this);
    this.event = false;
    this.game = game;
    this.game.physics.enable(this);
    this.body.allowGravity = false;
    this.body.immovable = true;
    this.body.moves = false;
    this.body.setSize(16, 16);
    this.exists = false;
    this.alive = false;
    this.item = null;
    this.itemObject = null;
    //this.open = false; // Behöävs inte === exists
  }

  _createClass(Block, [{
    key: "spawn",
    value: function spawn(x, y, type, data) {
      this.alive = true;
      this.x = x * 16;
      this.y = y * 16;
      this.type = type;
      this.type = 1;
      this.play("solid" + this.type);
      this.item = null;

      if (data && data.hasOwnProperty("item")) {
        this.item = data.item;
      }

      if (this.event) {
        this.game.time.events.remove(this.event);
      }
      this.event = false;
      //console.log("solid",this.type);

      //this.x = metroid.samus.x;
      this.exists = true;
      //console.log("block",this);
    }
  }, {
    key: "hit",
    value: function hit() {
      this.play("explode");
      //console.log("explode",this);
    }
  }]);

  return Block;
})(Phaser.Sprite);

exports["default"] = Block;
module.exports = exports["default"];

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bullet = (function (_Phaser$Sprite) {
  _inherits(Bullet, _Phaser$Sprite);

  function Bullet(game) {
    _classCallCheck(this, Bullet);

    _get(Object.getPrototypeOf(Bullet.prototype), "constructor", this).call(this, game, 0, 0, "sprites");
    this.anchor.set(0.5);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;
    this.animations.add("normal", ["weapons/normal"]);
    this.animations.add("icebeam", ["weapons/ice"]);
    this.animations.add("skree", ["weapons/skree"]);
    this.animations.add("missile", ["weapons/missile"]);
    this.animations.add("missileUp", ["weapons/missileUp"]);
    this.animations.add("bomb", ["weapons/bomb0", "weapons/bomb1"], 20, true);
    var explosion = this.animations.add("boom", ["boom/boom0", "boom/boom1", "boom/boom2"], 15, false);
    explosion.onComplete.add(function () {
      this.exists = false;
    }, this);
    var _arr = ['normal', 'icebeam'];
    for (var _i = 0; _i < _arr.length; _i++) {
      var bangType = _arr[_i];
      var _bangAnim = this.animations.add(bangType + 'Bang', ["weapons/" + (bangType === "icebeam" ? "ice" : bangType) + 'Bang'], 15, false);
      _bangAnim.onComplete.add(function () {
        this.exists = false;
      }, this);
    }
    var bangAnim = this.animations.add("missile" + 'Bang', ["boom/missile0", "boom/missile1", "boom/missile2", "boom/missile3"], 35, false);
    bangAnim.onComplete.add(function () {
      this.exists = false;
    }, this);

    this.animations.add("samusPiece0", ["samus/pieces0"]);
    this.animations.add("samusPiece1", ["samus/pieces1"]);
    this.animations.add("horn", ["kraid/horn0", "kraid/horn1", "kraid/horn2", "kraid/horn3"], 20, true);
    this.animations.add("arrow", ["arrow"]);

    this.game.physics.enable(this);
    this.body.allowGravity = false;
    this.bySamus = true;
    this.active = false; // not active = bomb not blowing or bullet exploding...
    this.firstLoop = true;
    this.removeTime = false;
  }

  _createClass(Bullet, [{
    key: "update",
    value: function update() {
      if (!this.exists || !this.active) {
        return;
      }

      if (this.bySamus) {
        // 1. Remove if wall is hit
        if (this.type !== "bomb") {
          this.game.physics.arcade.collide(this, metroid.ground, function (bullet, tile) {
            bullet.moves = false;
            if (bullet.type != "bomb") {
              console.log(bullet.type + "Bang");
              bullet.play(bullet.type + "Bang");
            }
          });
          //this.game.physics.arcade.collide(this, metroid.ground, this.hitTile);
        }

        // 1. enemies
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = metroid.enemies.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var enemyGroup = _step.value;

            this.game.physics.arcade.overlap(this, enemyGroup, this.hitEnemy);
          }
          // 2. Doors and objects
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (this.type !== "bomb") {
          this.game.physics.arcade.collide(this, metroid.doors, this.hitDoor);
        }

        this.game.physics.arcade.overlap(this, metroid.blocks, this.hitBlock);

        // 3. om bomb, kolla samus
        if (this.type === "bomb") {
          this.game.physics.arcade.overlap(this, metroid.samus, (function () {
            metroid.samus.bombedUp = true;
          }).bind(this));
          //  console.log(this.game);
          this.active = false; // just check bomb once, then let it play it's animation...
        }
      } else {
          if (this.type === "samusPiece0" || this.type === "samusPiece1") {
            return;
          }
        }
    }
  }, {
    key: "explode",
    value: function explode() {
      if (this.type === "bomb") {
        this.active = true;
        this.play("boom");
        this.game.sound.play('bombBoom');
      }
    }
  }, {
    key: "fire",
    value: function fire(source, dir, type) {
      this.reset(source.x, source.y);
      this.rotation = 0;
      //  this.x = source.x;
      //  this.y = source.y;
      this.body.allowGravity = false;

      this.scale.x = 1;
      this.type = type;
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
      if (this.removeTimer) {
        this.game.time.events.remove(this.removeTimer);
      }
      this.removeTimer = false;
      this.bySamus = source.name === "samus";
      this.active = true;
      this.body.setSize(4, 5);
      this.play(type);
      if (type !== "bomb") {
        this.speed = 300;
        this.y -= 2;

        if (dir === "Right") {
          this.body.velocity.x = this.speed;
          //this.x+=12;
        } else if (dir === "Left") {
            this.body.velocity.x = -this.speed;
            //this.x -= 12;
          } else {
              this.body.velocity.y = -this.speed;
              this.y -= 17;
            }
      }

      var setTimeout = false;

      switch (type) {
        case "normal":
          setTimeout = 16 * 3.5; //Så många pixlar från mynning ,tar inte hänsyn till varifrån
          if (metroid.samus.items.longbeam) {
            this.game.sound.play('longNormal');
          } else {
            this.game.sound.play('shortNormal');
          }
          break;
        case "missile":
          if (this.body.velocity.y < 0) {
            this.play("missileUp");
          } else if (this.body.velocity.x < 0) {
            this.scale.x = -1;
          }
          this.game.sound.play('missileShot');
          metroid.samus.vars.missiles--;
          break;
        case "skree":
          this.body.velocity.x = 0;
          this.body.velocity.y = 0;
          this.y += 12;
          this.speed = 400;
          switch (dir) {
            case "upLeft":
              this.body.velocity.x = -0.3 * this.speed;
              this.body.velocity.y = -0.7 * this.speed;
              break;
            case "upRight":
              this.body.velocity.x = 0.3 * this.speed;
              this.body.velocity.y = -0.7 * this.speed;
              break;
            case "left":
              this.body.velocity.x = -this.speed;
              break;
            case "right":
              this.body.velocity.x = this.speed;
              break;
          }
          this.removeTimer = this.game.time.events.add(Phaser.Timer.SECOND * 0.3, function () {
            this.alive = false;
            this.exists = false;
          }, this);
          break;
        case "icebeam":
          if (this.body.velocity.y != 0) {
            this.rotation = -90 / 57;
          } else if (this.body.velocity.x < 0) {
            this.rotation = -180 / 57;
          }
          this.game.sound.play('icebeam');
          setTimeout = 16 * 3.5; //Så många pixlar från mynning ,tar inte hänsyn till varifrån
          break;
        case "bomb":
          this.y += 4;
          this.active = false;
          this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.explode, this);
          this.body.setSize(18, 18);
          this.game.sound.play('bombSet');

          break;
        case "samusPiece0":
        case "samusPiece1":
          this.body.velocity.x = source.speed;
          this.body.velocity.y = -100;
          this.body.allowGravity = true;
          this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
            this.game.state.start('Title');
          }, this);
          break;
        case "horn":
          this.body.velocity.x = 0;
          this.body.velocity.y = 0;
          //this.y += 12;
          this.speed = 20;
          switch (dir) {
            case "left":
              this.body.velocity.x = -0.3 * this.speed;
              this.body.velocity.y = -0.7 * this.speed;
              break;
            case "right":
              this.body.velocity.x = 0.3 * this.speed;
              this.body.velocity.y = -0.7 * this.speed;
              break;
          }
          /*this.removeTimer = this.game.time.events.add(Phaser.Timer.SECOND * 0.3, function() {
            this.alive = false;
            this.exists = false;
          }, this);*/
          break;
        case "arrow":
          this.body.velocity.x = source.speed;
          this.body.velocity.y = -100;
          this.body.allowGravity = true;
          this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
            this.game.state.start('Title');
          }, this);
          break;
      }

      if ((this.bySamus && !metroid.samus.items.longbeam || !this.bySamus) && setTimeout) {
        console.log(this.bySamus, !metroid.samus.items.longbeam);
        var timeout = setTimeout / this.speed;
        this.removeTimer = this.game.time.events.add(Phaser.Timer.SECOND * timeout, function () {
          this.alive = false;
          this.exists = false;
        }, this);
      }

      this.firstLoop = true;

      this.exists = true;
    }
  }, {
    key: "hitDoor",
    value: function hitDoor(bullet, door) {
      metroid.debugDoor = door;
      bullet.exists = false;
      bullet.kill();
      door.open(bullet);
    }
  }, {
    key: "hitBlock",
    value: function hitBlock(bullet, block) {
      console.log("HIT", bullet, block);
      //debugger;
      block.hit();
      if (bullet.type !== "bomb") {
        bullet.x = -16;
        bullet.y = -16;
        bullet.exists = false;
        this.firstLoop = true;
      }
    }
  }, {
    key: "hitEnemy",
    value: function hitEnemy(bullet, enemy) {
      if (bullet.type !== "bomb") {
        bullet.exists = false;
        bullet.kill();
      }
      enemy.hit(bullet);
    }
  }, {
    key: "bangOut",
    value: function bangOut() {}
  }]);

  return Bullet;
})(Phaser.Sprite);

exports["default"] = Bullet;
module.exports = exports["default"];

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Door = (function (_Phaser$Sprite) {
  _inherits(Door, _Phaser$Sprite);

  function Door(game) {
    _classCallCheck(this, Door);

    _get(Object.getPrototypeOf(Door.prototype), "constructor", this).call(this, game, 0, 0, "sprites");
    var _arr = [0, 5, 10];
    for (var _i = 0; _i < _arr.length; _i++) {
      var cnt = _arr[_i];
      //alert("doors/door"+cnt);
      this.animations.add("elevator", ["doors/elevator", "transparent"], 30, true);

      this.animations.add("closed" + cnt, ["doors/door" + cnt]);
      this.animations.add("close" + cnt, ["doors/openingDoor" + cnt, "doors/door" + cnt], 15, false);
      var anim = this.animations.add("open" + cnt, ["doors/door" + cnt, "doors/openingDoor" + cnt], 15, false);
      anim.onComplete.add(function () {
        this.exists = false;
        this.closeEvent = this.game.time.events.add(Phaser.Timer.SECOND * 4, this.close, this);
      }, this);
    }
    this.anchor.setTo(0.5, 0);
    this.game = game;
    this.game.physics.enable(this);
    this.body.allowGravity = false;
    this.body.immovable = true;
    this.body.moves = false;
    this.body.setSize(8, 16 * 3);

    this.closeEvent = false;
    this.exists = false;
    this.alive = false;
    this["class"] = 0;

    //this.open = false; // Behöävs inte === exists
  }

  _createClass(Door, [{
    key: "spawn",
    value: function spawn(doorX, doorY, type, data) {
      //  console.log(type,data);
      this["class"] = parseInt(type);
      if (this["class"] === -1) {
        this.alive = false;
        return;
      }
      if (this.closeEvent) {
        this.game.time.events.remove(this.closeEvent);
      }

      if (type === "elevator") {
        this.x = data.x * 16 * 16 + 16 * 16 / 2;
        this.y = data.y * 16 * 15 + 8 * 16;
        this.play("elevator");
        this["class"] = "elevator";
        this.direction = data.direction;
      } else {
        this.alive = true;
        this.energy = this["class"];
        if (data.left) {
          this.scale.x = 1;
          this.x = data.x * 16 * 16 + 16 + 4;
        } else {
          this.scale.x = -1; // Flip it
          this.x = data.x2 * 16 * 16 + 16 * 15 - 4;
        }
        this.id = data.id;
        this.y = doorY * 16 * 15 + 5 * 16;
        this.play("closed" + this["class"]);
      }
      //this.x = metroid.samus.x;

      //this.y=metroid.samus.y;
      this.exists = true;
    }
  }, {
    key: "touchingSamus",
    value: function touchingSamus(samus, elevator) {
      if (this["class"] !== "elevator") {

        console.log("Not elevator", this["class"]);
        return;
      }

      /*if(Math.abs((samus.x+samus.width/2)-(elevator.x+16))>8){
        console.log("not enough elevator"+Math.abs((samus.x+samus.width/2)-(elevator.x+16)));
        return;
      }*/
      samus.vars.elevator = elevator;
      console.log("on elevator");
    }
  }, {
    key: "unload",
    value: function unload() {
      this.alive = false;
      this.exists = false;
    }
  }, {
    key: "runElevator",
    value: function runElevator() {
      if (metroid.game.state.states["GameState"].ongoingTransition) {
        return;
      }
      console.log("dir:", this, this.direction);
      var direction = this.direction === "down" ? 1 : -1;

      metroid.game.add.tween(this).to({
        y: 16 * 15 * (Math.floor(this.y / (16 * 15)) + 0.5 + 2 * direction) + 8
      }, metroid.enhancements.quickelevators ? 1000 : 7000).start();
      var samusTween = metroid.game.add.tween(metroid.samus).to({
        y: 16 * 15 * (Math.floor(this.y / (16 * 15)) + 0.5 + 2 * direction) + 8 + (metroid.samus.y - this.y - 1)
      }, metroid.enhancements.quickelevators ? 1000 : 7000);
      samusTween.onComplete.add(function () {
        metroid.samus.appeared = true;
        metroid.samus.body.allowGravity = true;
        metroid.game.state.states.GameState.roomTransition.unloadRoom({ x: -1, x2: -1 });
        metroid.game.state.states.GameState.roomTransition.checkCurrentRoom(metroid.samus.x, metroid.samus.y, true);
      });
      samusTween.start();
      metroid.samus.x = this.x;
      metroid.samus.alpha = 1;
      metroid.samus.play("front");
      metroid.samus.animations.currentAnim.setFrame("samus/front3");
      metroid.samus.animations.currentAnim.stop();
      //metroid.samus.frameName = "samus/front3";
      metroid.samus.appeared = false;
      metroid.samus.body.allowGravity = false;
      metroid.samus.body.velocity.setTo(0, 0);
      metroid.samus.vars.elevator = null;
      this.game.world.setBounds(metroid.game.world.bounds.x, metroid.game.world.bounds.y - (this.direction === "down" ? 0 : 240 * 2), metroid.game.world.width, metroid.game.world.height + 240 * 2);
    }
  }, {
    key: "open",
    value: function open(bullet, byForce) {
      //play open

      if (!bullet && !byForce) {
        return;
      }
      if (!byForce && bullet.type === "missile") {
        this.energy--;
        console.log("door energy:" + this.energy);
      }
      if (byForce) {
        this.energy = 0;
      }
      if (this.energy < 1) {
        this.game.sound.play('door');
        this.play("open" + this["class"]);
        if (this["class"] != 0) {
          this["class"] = -1;
        }
      }
    }
  }, {
    key: "close",
    value: function close() {
      if (this["class"] === -1) {
        this.alive = false;
        return;
      }
      this.exists = true;
      this.game.time.events.remove(this.closeEvent);
      this.closeEvent = false;
      this.game.sound.play('door');

      this.play("close" + this["class"]);
    }
  }]);

  return Door;
})(Phaser.Sprite);

exports["default"] = Door;
module.exports = exports["default"];

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HUD = (function (_Phaser$Group) {
  _inherits(HUD, _Phaser$Group);

  function HUD(game) {
    _classCallCheck(this, HUD);

    // 14, 24
    _get(Object.getPrototypeOf(HUD.prototype), "constructor", this).call(this, game);

    this.fixedToCamera = true;
    this.add(this.game.add.sprite(10, 10, "sprites", "hud/energy"));
    this.missiles = this.game.add.sprite(10, 20, "sprites", "hud/missiles");

    this.tanks = [];
    for (var i = 0; i < 6; i++) {
      this.tanks[i] = this.add(this.game.add.sprite(50 - i * 10, 0, "sprites"));
      this.tanks[i].animations.add("empty", ["hud/empty"]);
      this.tanks[i].animations.add("full", ["hud/full"]);
      this.tanks[i].play("full");
      this.tanks[i].alpha = 0;
      this.add(this.tanks[i]);
    }

    /*this.missileCntText = game.add.retroFont('font', 7, 7, Phaser.RetroFont.TEXT_SET6, 46, 5, 0);
    this.missileCntText.setText("005");*/

    this.energyCntText = this.game.add.retroFont('font', 8, 8, Phaser.RetroFont.TEXT_SET6, 10, 0, 0);
    this.energyCntText.setText("40");
    this.add(this.game.add.image(4 * 8 + 4, 10, this.energyCntText));

    this.missileCntText = this.game.add.retroFont('font', 8, 8, Phaser.RetroFont.TEXT_SET6, 10, 0, 0);
    this.missileCntText.setText("");
    this.add(this.game.add.image(4 * 8 - 4, 20, this.missileCntText));
    //    hudtext.fixedToCamera = true;

    //  this.add(game.add.image(10, 30, metroid.missileCntText));
    this.missiles.alpha = 0;
    this.add(this.missiles);
    this.lastEnergy = -1;
    this.lastMissiles = -1;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var obj = _step.value;

        obj.x += 30;
        obj.y += 24;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return this;
  }

  _createClass(HUD, [{
    key: "update",
    value: function update(force) {
      var filledTanks = undefined,
          energyNum = undefined,
          missiles = undefined;
      if (!force && metroid.samus.vars.missiles === this.lastMissiles && metroid.samus.vars.energy === this.lastEnergy) {
        return;
      }

      if (metroid.samus.vars.energy < 1 && metroid.samus.alive) {
        metroid.game.camera.follow(null);
        metroid.samus.vars.energy = 0;
        metroid.samus.alive = false;
        metroid.samus.alpha = 0;
        metroid.samus.invincible = 0;
        metroid.samus.body.velocity.setTo(0, 0);
        metroid.samus.forcedMovement = 0;
        metroid.music.current.stop();
        metroid.soundEffects.panic.stop();
        metroid.game.sound.play('die');

        for (var speed = 0; speed < 3; speed++) {
          metroid.weapons.fire({
            x: metroid.samus.x,
            y: metroid.samus.y + 12,
            speed: 100 + speed * 30
          }, "", "samusPiece0"); // pieces och animation i förstra obj
          metroid.weapons.fire({
            x: metroid.samus.x,
            y: metroid.samus.y + 12,
            speed: -100 - speed * 30
          }, "right", "samusPiece0");
        }
        if (metroid.samusSister.exists) {
          metroid.samusSister.exists = false;
          for (var speed = 0; speed < 3; speed++) {
            metroid.weapons.fire({
              x: metroid.samusSister.x,
              y: metroid.samusSister.y + 12,
              speed: 100 + speed * 30
            }, "", "samusPiece0"); // pieces och animation i förstra obj
            metroid.weapons.fire({
              x: metroid.samusSister.x,
              y: metroid.samusSister.y + 12,
              speed: -100 - speed * 30
            }, "right", "samusPiece0");
          }
        }
      } else if (metroid.samus.vars.energy < 20) {
        if (!metroid.soundEffects.panic.isPlaying) {
          metroid.soundEffects.panic.play(null, 0, 1, true);
        }
      }

      if (metroid.samus.items.missiles > 0) {
        this.missiles.alpha = 1;
        missiles = "00" + metroid.samus.vars.missiles;
        missiles = missiles.substr(missiles.length - 3, 3);
        this.missileCntText.setText(missiles);
      }

      energyNum = metroid.samus.vars.energy % 100;
      filledTanks = (metroid.samus.vars.energy - energyNum) / 100;
      if (metroid.debugHUD) {
        console.log(energyNum, filledTanks);
        metroid.debugHUD = false;
      }

      for (var i = metroid.samus.items.energytank; i < 6; i++) {
        this.tanks[i].alpha = 0;
      }

      for (var i = 0; i < metroid.samus.items.energytank; i++) {
        this.tanks[i].alpha = 1;
        if (filledTanks > i) {
          this.tanks[i].play("full");
        } else {
          this.tanks[i].play("empty");
        }
      }
      energyNum = "00" + energyNum;
      energyNum = energyNum.substr(energyNum.length - 2, 2);
      this.energyCntText.setText(energyNum);

      this.lastEnergy = metroid.samus.vars.energy;
      this.lastMissiles = metroid.samus.vars.missiles;
    }
  }]);

  return HUD;
})(Phaser.Group);

exports["default"] = HUD;
module.exports = exports["default"];

},{}],22:[function(require,module,exports){
/*

Mycket this.data som kan använda getIndex() osv

2.3.0: metroid.game.cache._tilemaps
2.4.6: metroid.game.cache._cache.tilemap

*/

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapParser = (function () {
  function MapParser(game) {
    _classCallCheck(this, MapParser);

    this.game = game;
    console.log("MapParser" + metroid.game);
    this.roomW = 16, this.roomH = 15;
    this.VOID = -1;
    this.MIXED = 0;
    this.SOLID = 1;
    this.rooms = [];
    this.loaded = false;
    for (var x = 0; x < metroid.game.cache._cache.tilemap.map.data.width / this.roomW; x++) {
      this.rooms[x] = [];
      for (var y = 0; y < metroid.game.cache._cache.tilemap.map.data.height / this.roomH; y++) {
        this.rooms[x][y] = null;
      }
    }
    this.passages = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = metroid.game.cache._cache.tilemap.map.data.layers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var layer = _step.value;

        if (layer.name === "Ground") {
          this.data = layer.data;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    this.game.time.events.add(10, this.create, this);
  }

  _createClass(MapParser, [{
    key: "create",
    value: function create() {
      this.roomTypes();
      this.createPassages();
      this.objectLayers();
      this.loaded = true;
      //this.drawMap();
    }
  }, {
    key: "roomTypes",
    value: function roomTypes() {
      var tileColumns = metroid.game.cache._cache.tilemap.map.data.width;
      var thisRoom = undefined;

      // 1. Check border within room if solid or void

      var y = 0;
      for (var X = 0; X < this.rooms.length; X++) {
        for (var Y = 0; Y < this.rooms[X].length; Y++) {
          thisRoom = {
            top: null,
            right: null,
            bottom: null,
            left: null,
            type: null,
            doorLeft: false,
            doorRight: false
          };
          /* 1. Check top and Bottom */

          for (var _y = 0; _y < 2; _y++) {
            var temp = null;
            solidVoidDone: for (var x = 0; x < this.roomW; x++) {
              if (this.data[X * this.roomW + x + tileColumns * (Y * this.roomH + _y * (this.roomH - 1))] < 10) {
                if (temp === this.SOLID) {
                  temp = this.MIXED;
                  break solidVoidDone;
                }
                temp = this.VOID;
              } else {
                if (temp === this.VOID) {
                  temp = this.MIXED;
                  break solidVoidDone;
                }
                temp = this.SOLID;
              }
            }
            if (_y === 0) {
              thisRoom.top = temp;
            } else {
              thisRoom.bottom = temp;
            }
          }

          /* 1. Check left and right */

          for (var x = 0; x < 2; x++) {
            var temp = null;
            solidVoidDone2: for (var _y2 = 0; _y2 < this.roomH; _y2++) {
              if (this.data[X * this.roomW + x * (this.roomW - 1) + tileColumns * (Y * this.roomH + _y2)] < 10) {
                if (temp === this.SOLID) {
                  temp = this.MIXED;
                  break solidVoidDone2;
                }
                temp = this.VOID;
              } else {
                if (temp === this.VOID) {
                  temp = this.MIXED;
                  break solidVoidDone2;
                }
                temp = this.SOLID;
              }
            }
            if (x === 0) {
              thisRoom.left = temp;
            } else {
              thisRoom.right = temp;
            }
          }

          /* Determine Room type (if possible) */
          this.fixRoomType(thisRoom);
          this.rooms[X][Y] = thisRoom;
        }
      }

      // Extrakontroll av room som är null och SOLID (kan vara one-roomer)
      for (var X = 0; X < this.rooms.length; X++) {
        for (var Y = 0; Y < this.rooms[0].length; Y++) {
          var temp = undefined;
          if (this.rooms[X][Y].type === null) {
            // Check if solid to the left
            if (this.rooms[X][Y].left !== this.SOLID) {
              if (X > 0) {
                if (this.rooms[X - 1][Y].right === this.SOLID && this.rooms[X - 1][Y].type !== "solid" || this.rooms[X - 1][Y].type === "void") {
                  this.rooms[X][Y].left = this.SOLID;
                }
              } else {
                this.rooms[X][Y].left = this.SOLID;
              }
            }
            // Check if solid to the right
            if (this.rooms[X][Y].right !== this.SOLID) {
              if (X < this.rooms.length - 1) {
                if (this.rooms[X + 1][Y].left === this.SOLID && this.rooms[X + 1][Y].type !== "solid" || this.rooms[X + 1][Y].type === "void") {
                  this.rooms[X][Y].right = this.SOLID;
                }
              } else {
                this.rooms[X][Y].right = this.SOLID;
              }
            }
            // Check if solid to the bottom
            if (this.rooms[X][Y].bottom !== this.SOLID) {
              if (Y < this.rooms[X].length - 1) {
                if (this.rooms[X][Y + 1].top === this.SOLID && this.rooms[X][Y + 1].type !== "solid" || this.rooms[X][Y + 1].type === "void") {
                  this.rooms[X][Y].bottom = this.SOLID;
                } else {
                  this.rooms[X][Y].bottom = this.SOLID;
                }
              }
            }
            // Check if solid to the top
            if (this.rooms[X][Y].top !== this.SOLID) {
              if (Y > 0) {
                if (this.rooms[X][Y + 1].bottom === this.SOLID && this.rooms[X][Y + 1].type !== "solid" || this.rooms[X][Y + 1].type === "void") {
                  this.rooms[X][Y].top = this.SOLID;
                } else {
                  this.rooms[X][Y].top = this.SOLID;
                }
              }
            }
            this.fixRoomType(this.rooms[X][Y]);
          }
        }
      }
    }
  }, {
    key: "fixRoomType",
    value: function fixRoomType(thisRoom) {
      if (thisRoom.top === this.VOID && thisRoom.right === this.VOID && thisRoom.bottom === this.VOID && thisRoom.left === this.VOID) {
        thisRoom.type = "void";
      } else if (thisRoom.top === this.SOLID && thisRoom.right === this.SOLID && thisRoom.bottom === this.SOLID && thisRoom.left === this.SOLID) {
        // Check for doors to make oneroomer
        //else
        thisRoom.type = "solid";
      } else if (thisRoom.left !== this.SOLID || thisRoom.right !== this.SOLID) {
        if (thisRoom.top !== this.SOLID || thisRoom.bottom !== this.SOLID) {
          thisRoom.type = null; // needs further check
        } else {
            thisRoom.type = "horizontal";
          }
      } else if (thisRoom.top !== this.SOLID || thisRoom.bottom !== this.SOLID) {
        thisRoom.type = "vertical";
      } else {
        thisRoom.type = null; // needs further check
      }
    }
  }, {
    key: "createPassages",
    value: function createPassages() {
      /* 0. Make singles */
      for (var Y = 0; Y < this.rooms[0].length; Y++) {
        for (var X = 0; X < this.rooms.length; X++) {
          if (this.rooms[X][Y].type === null) {
            console.warn("NULL ROOM");
          }
          if (this.rooms[X][Y].type === "horizontal") {
            if ((X === 0 || this.rooms[X - 1][Y].right === this.SOLID || this.rooms[X - 1][Y].type === "void") && (X === this.rooms.length - 1 || this.rooms[X + 1][Y].left === this.SOLID || this.rooms[X + 1][Y].type === "void")) {
              this.rooms[X][Y].type = "single";
              this.passages.push({
                id: X + "." + Y,
                type: "single",
                x: X,
                x2: X,
                y: Y,
                y2: Y
              });
            }
          } else if (this.rooms[X][Y].type === "vertical") {
            if ((Y === 0 || this.rooms[X][Y - 1].bottom === this.SOLID || this.rooms[X][Y - 1].type === "void") && (Y === this.rooms.length - 1 || this.rooms[X][Y + 1].top === this.SOLID || this.rooms[X][Y + 1].type === "void")) {
              this.rooms[X][Y].type = "single";
              this.passages.push({
                id: X + "." + Y,
                type: "single",
                x: X,
                x2: X,
                y: Y,
                y2: Y
              });
            }
          } else if (this.rooms[X][Y].type === "solid") {
            if ((Y === 0 || this.rooms[X][Y - 1].bottom === this.SOLID || this.rooms[X][Y - 1].type === "void") && (Y === this.rooms.length - 1 || this.rooms[X][Y + 1].top === this.SOLID || this.rooms[X][Y + 1].type === "void")) {
              if ((X === 0 || this.rooms[X - 1][Y].right === this.SOLID || this.rooms[X - 1][Y].type === "void") && (X === this.rooms.length - 1 || this.rooms[X + 1][Y].left === this.SOLID || this.rooms[X + 1][Y].type === "void")) {
                this.rooms[X][Y].type = "single";
                this.passages.push({
                  id: X + "." + Y,
                  type: "single",
                  x: X,
                  x2: X,
                  y: Y,
                  y2: Y
                });
              }
            }
          }
        }
      }

      /* 1. Make horizontals */
      for (var Y = 0; Y < this.rooms[0].length; Y++) {
        var start = -1;
        var subtractX = 0;
        var type = "horizontal";
        for (var X = 0; X < this.rooms.length; X++) {

          if (this.rooms[X][Y].type === type || this.rooms[X][Y].type === "solid") {

            if (start < 0) {
              start = X;
            } else if (this.rooms[X][Y].type === "solid") {
              if (Y === 13) {
                console.log("3!!!!!", Y, start);
              }
              this.passages.push({
                id: start + "." + Y,
                type: type,
                x: start,
                x2: X,
                y: Y,
                y2: Y
              });
              start = -1;
              type = "horizontal";
            }
          } else {
            if (start > -1 && start !== X - 1) {

              this.passages.push({
                id: start + "." + Y,
                type: type,
                x: start,
                x2: X - 1 - subtractX,
                y: Y,
                y2: Y
              });
            }
            if (Y === 13) {
              console.log("!!!!!", X, start);
            }
            start = -1;
            type = "horizontal";
          }
          if (start > -1 && this.rooms[X][Y].right === this.SOLID && !(X === start && this.rooms[X][Y].type === "solid")) {
            if (Y === 13) {
              console.log("2!!!!!", Y, start, X);
            }
            this.passages.push({
              id: start + "." + Y,
              type: type,
              x: start,
              x2: X,
              y: Y,
              y2: Y
            });
            start = -1;
            type = "horizontal";
          }
        }
      }

      /* 1. Make verticals */
      for (var X = 0; X < this.rooms.length; X++) {
        var start = -1;
        for (var Y = 0; Y < this.rooms[0].length; Y++) {
          if (this.rooms[X][Y].type === "vertical" || this.rooms[X][Y].type === "solid") {
            if (start < 0) {
              start = Y;
            } else if (this.rooms[X][Y].type === "solid") {
              this.passages.push({
                id: start + "." + Y,
                type: "vertical",
                x: X,
                x2: X,
                y: start,
                y2: Y
              });
              start = -1;
            }
          } else {
            if (start > -1 && start != Y - 1) {
              this.passages.push({
                id: start + "." + Y,
                type: "vertical",
                x: X,
                x2: X,
                y: start,
                y2: Y - 1
              });
            }
            start = -1;
          }
        }
      }
      console.log("passages: " + this.passages.length);

      var doorTiles = [];

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = metroid.game.cache._cache.tilemap.map.data.tilesets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var tileset = _step2.value;

          if (tileset.name === "tiles") {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = Object.keys(tileset.tileproperties)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var tileIndex = _step4.value;

                if (tileset.tileproperties[tileIndex].hasOwnProperty("door")) {
                  doorTiles.push(parseInt(tileIndex) + 1);
                }
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
                  _iterator4["return"]();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }
          }
        }
        //  Add doors
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var i = undefined;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.passages[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var passage = _step3.value;

          passage.doors = [];
          passage.enemies = [];
          passage.items = [];
          passage.music = "";
          passage.area = ""; // Brinstar
          passage.breakable = [];
          passage["void"] = [];
          var index = undefined;
          for (var y = passage.y; y <= passage.y2; y++) {
            index = this.getIndex(passage.x, y, 0, 6);
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = doorTiles[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                i = _step5.value;

                if (index === i) {
                  passage.doors.push({
                    y: y,
                    x: passage.x,
                    left: true,
                    side: 0,
                    type: 0,
                    id: passage.x + "." + passage.y + "left" + y
                  });
                }
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
                  _iterator5["return"]();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }

            index = this.getIndex(passage.x2, y, 15, 6);
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              for (var _iterator6 = doorTiles[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                i = _step6.value;

                if (index === i) {
                  passage.doors.push({
                    y: y,
                    x: passage.x2,
                    left: false,
                    side: 1,
                    type: 0,
                    id: passage.x + "." + passage.y + "right" + y
                  });
                }
              }
            } catch (err) {
              _didIteratorError6 = true;
              _iteratorError6 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
                  _iterator6["return"]();
                }
              } finally {
                if (_didIteratorError6) {
                  throw _iteratorError6;
                }
              }
            }
          }
        }

        // Remove single without doors - should only be solids marked as single-rooms;
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      i = this.passages.length;
      while (i--) {
        if (this.passages[i].doors.length === 0) {
          this.passages.splice(i, 1);
        }
      }
      console.log("passages: " + this.passages.length);
      console.log(this.rooms[0][13].type);
    }
  }, {
    key: "drawMap",
    value: function drawMap() {
      var graphics = this.add.graphics(0, 0);
      //graphics.fixedToCamera = true;

      var h = 6; //15;
      var w = 8; //16;
      var l = 2;
      graphics.lineStyle(l, 0xffffff, 1);

      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = this.passages[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var r = _step7.value;

          graphics.beginFill(0xea5bff, 1);
          //graphics.drawRect(r.x*m, r.y*m, 100, 100);
          graphics.drawRect(r.x * w - 1, r.y * h - 1, (r.x2 - r.x + 1) * w, (r.y2 - r.y + 1) * h);
          graphics.endFill();
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
            _iterator7["return"]();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      graphics.lineStyle(0, 0xffffff, 1);

      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = this.passages[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var r = _step8.value;
          var _iteratorNormalCompletion9 = true;
          var _didIteratorError9 = false;
          var _iteratorError9 = undefined;

          try {
            for (var _iterator9 = r.doors[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
              var door = _step9.value;

              if (door.left) {
                graphics.beginFill(0x2038ec, 1);
                graphics.drawRect(r.x * w - l, door.y * h + h / 2 - l, l, l);
                graphics.endFill();
              }
            }

            /*      if(r.doorLeft){
                    graphics.beginFill(0xFFFFFF * Math.random(), 1);
                    graphics.drawRect(r.x*w - l, r.y*h+h/2-l, l, l);
                    graphics.endFill();
                  }*/
            /*  if(r.doorRight){
                graphics.beginFill(0xFFFFFF * Math.random(), 1);
                graphics.drawRect(r.x2*w+w - l, r.y*h+h/2-l, l, l);
                graphics.endFill();
              }*/
          } catch (err) {
            _didIteratorError9 = true;
            _iteratorError9 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion9 && _iterator9["return"]) {
                _iterator9["return"]();
              }
            } finally {
              if (_didIteratorError9) {
                throw _iteratorError9;
              }
            }
          }
        }

        // FUNGERAR:

        /*
            //	A mask is a Graphics object
            let mask = this.game.add.graphics(0, 0);
             //	Shapes drawn to the Graphics object must be filled.
            mask.beginFill(0xffffff);
             //	Here we'll draw a circle
            mask.drawCircle(100, 100, 100);
             //	And apply it to the Sprite
            graphics.mask = mask;*/

        // 1. Mask för att dölja områden
        // 2. Mask för att klippa ut synlig

        // 3. Flytta graphics rätt
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8["return"]) {
            _iterator8["return"]();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }
    }
  }, {
    key: "objectLayers",
    value: function objectLayers() {
      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;
      var _iteratorError10 = undefined;

      try {
        for (var _iterator10 = metroid.game.cache._cache.tilemap.map.data.layers[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
          var layer = _step10.value;

          if (layer.type !== "objectgroup" || layer.name === "Areaxs") {
            continue;
          }
          if (layer.name === "Areas") {
            //debugger;
            var _iteratorNormalCompletion11 = true;
            var _didIteratorError11 = false;
            var _iteratorError11 = undefined;

            try {
              for (var _iterator11 = layer.objects[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                var obj = _step11.value;

                if (obj.properties.hasOwnProperty("name")) {
                  var _iteratorNormalCompletion12 = true;
                  var _didIteratorError12 = false;
                  var _iteratorError12 = undefined;

                  try {
                    for (var _iterator12 = this.passages[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                      var passage = _step12.value;

                      if (obj.x <= passage.x * 16 * 16 + 16 && obj.y <= passage.y * 15 * 16 + 16 && obj.x + obj.width > (passage.x2 * 16 + 16) * 16 - 16 && obj.y + obj.height > (passage.y2 * 15 + 15) * 16 - 16) {
                        passage.area = obj.properties.name;
                      }
                    }
                  } catch (err) {
                    _didIteratorError12 = true;
                    _iteratorError12 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion12 && _iterator12["return"]) {
                        _iterator12["return"]();
                      }
                    } finally {
                      if (_didIteratorError12) {
                        throw _iteratorError12;
                      }
                    }
                  }
                }
              }
            } catch (err) {
              _didIteratorError11 = true;
              _iteratorError11 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion11 && _iterator11["return"]) {
                  _iterator11["return"]();
                }
              } finally {
                if (_didIteratorError11) {
                  throw _iteratorError11;
                }
              }
            }
          } else if (layer.name === "RoomData") {
            var _iteratorNormalCompletion13 = true;
            var _didIteratorError13 = false;
            var _iteratorError13 = undefined;

            try {
              for (var _iterator13 = layer.objects[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                var obj = _step13.value;

                //console.log(obj);
                var propertyToAdd = undefined;
                var propertyData = undefined;

                if (obj.type === "void" || obj.type === "breakable") {
                  console.log(obj.type);
                  //  debugger;
                  var _iteratorNormalCompletion14 = true;
                  var _didIteratorError14 = false;
                  var _iteratorError14 = undefined;

                  try {
                    for (var _iterator14 = this.passages[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                      var passage = _step14.value;

                      if (obj.x >= passage.x * 16 * 16 && obj.y >= passage.y * 15 * 16 && obj.x < (passage.x2 * 16 + 16) * 16 && obj.y < (passage.y2 * 15 + 15) * 16) {
                        obj.width += obj.x % 16; // Om flyttar vänster så ska bredden bli lika mycket större
                        obj.height += obj.y % 16;
                        passage[obj.type].push({
                          x: Math.floor(obj.x / 16),
                          y: Math.floor(obj.y / 16),
                          width: Math.ceil(obj.width / 16),
                          height: Math.ceil(obj.height / 16)
                        });
                      }
                    }
                  } catch (err) {
                    _didIteratorError14 = true;
                    _iteratorError14 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion14 && _iterator14["return"]) {
                        _iterator14["return"]();
                      }
                    } finally {
                      if (_didIteratorError14) {
                        throw _iteratorError14;
                      }
                    }
                  }
                } else if (obj.gid > 0) {
                  console.log("OBJGID");
                  /// get properties from tile
                  var tileProperties = this.getTileProperties(obj.gid);
                  console.log("OBJGID", tileProperties);
                  if (tileProperties) {
                    for (var property in tileProperties) {
                      console.log(property);
                      if (!obj.properties.hasOwnProperty[property]) {
                        console.log("set " + property + " to " + tileProperties[property]);
                        obj[property] = tileProperties[property];
                        if (property === "elevator") {
                          console.log("MUSIC!!!", obj);
                          debugger;
                        }
                      }
                    }
                  }

                  switch (obj.type) {
                    case "music":
                      //console.log("case: music");
                      propertyToAdd = "music";
                      propertyData = !obj.hasOwnProperty("subtype") || obj.subtype === "music" || obj.subtype.length === 0 ? "mystery" : obj.properties.music;
                      break;
                    case "door":
                      propertyToAdd = "door";
                      //for(o)
                      propertyData = obj.subtype;

                      break;
                    case "elevator":
                      propertyToAdd = "elevator";
                      propertyData = obj.properties.direction;
                      break;
                  }
                  /*            if (obj.properties.hasOwnProperty("world")) {
                                propertyToAdd = "startPoint";
                                propertyData = {
                                  x: obj.x,
                                  y: obj.y,
                                  world: obj.properties.world
                                };
                              } else if (obj.properties.hasOwnProperty("music")) {
                                propertyToAdd = "music";
                                propertyData = (obj.properties.music.length < 1) ? "mystery" : obj.properties.music;
                                console.log("ADD MUSIC", propertyData);
                                debugger;
                              }*/
                  var _iteratorNormalCompletion15 = true;
                  var _didIteratorError15 = false;
                  var _iteratorError15 = undefined;

                  try {
                    for (var _iterator15 = this.passages[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                      var passage = _step15.value;

                      if (obj.x >= passage.x * 16 * 16 && obj.y >= passage.y * 15 * 16 && obj.x < (passage.x2 * 16 + 16) * 16 && obj.y < (passage.y2 * 15 + 15) * 16) {
                        //console.log("Add", obj, passage.x, passage.y);
                        if (passage.y === 13) {
                          console.log("FIRST!", passage);
                        }
                        if (propertyToAdd === "door") {
                          var doorRoom = {
                            x: obj.x / 16 / 16,
                            y: obj.y / 16 / 15
                          };

                          var _iteratorNormalCompletion16 = true;
                          var _didIteratorError16 = false;
                          var _iteratorError16 = undefined;

                          try {
                            for (var _iterator16 = passage.doors[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                              var door = _step16.value;

                              // Kolla inom samma rum och sida
                              var doorX = door.side === 0 ? door.x * 16 * 16 : (door.x + 1) * 16 * 16;

                              console.log("doot" + door.x * 16 * 16 + "." + obj.x + "----" + door.y * 15 * 16 + "--" + obj.y);
                              if (Math.abs(obj.x - doorX) < 128 && Math.floor(obj.y / (16 * 15)) === door.y) {
                                door.type = propertyData;
                                console.log("Door" + door.type);
                              }
                            }
                          } catch (err) {
                            _didIteratorError16 = true;
                            _iteratorError16 = err;
                          } finally {
                            try {
                              if (!_iteratorNormalCompletion16 && _iterator16["return"]) {
                                _iterator16["return"]();
                              }
                            } finally {
                              if (_didIteratorError16) {
                                throw _iteratorError16;
                              }
                            }
                          }

                          console.log(passage);
                          //  debugger;
                        } else {
                            passage[propertyToAdd] = propertyData;
                          }
                        break;
                      }
                    }
                  } catch (err) {
                    _didIteratorError15 = true;
                    _iteratorError15 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion15 && _iterator15["return"]) {
                        _iterator15["return"]();
                      }
                    } finally {
                      if (_didIteratorError15) {
                        throw _iteratorError15;
                      }
                    }
                  }
                }
              }
            } catch (err) {
              _didIteratorError13 = true;
              _iteratorError13 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion13 && _iterator13["return"]) {
                  _iterator13["return"]();
                }
              } finally {
                if (_didIteratorError13) {
                  throw _iteratorError13;
                }
              }
            }
          } else {
            var _iteratorNormalCompletion17 = true;
            var _didIteratorError17 = false;
            var _iteratorError17 = undefined;

            try {
              for (var _iterator17 = layer.objects[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                var obj = _step17.value;

                var found = false;
                var _iteratorNormalCompletion18 = true;
                var _didIteratorError18 = false;
                var _iteratorError18 = undefined;

                try {
                  for (var _iterator18 = this.passages[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
                    var passage = _step18.value;

                    if (obj.x >= passage.x * 16 * 16 && obj.y >= passage.y * 15 * 16 && obj.x < (passage.x2 * 16 + 16) * 16 && obj.y < (passage.y2 * 15 + 15) * 16) {
                      var tileProperties = this.getTileProperties(obj.gid);

                      var fixedObj = {
                        x: obj.x,
                        y: obj.y,
                        id: obj.x + "." + obj.y
                      };
                      if (tileProperties) {
                        for (var property in tileProperties) {
                          fixedObj[property] = tileProperties[property]; // Add generic properties
                        }
                      }
                      for (var property in obj.properties) {
                        // Add or override properties
                        fixedObj[property] = obj[property];
                      }
                      if (!passage.hasOwnProperty(layer.name)) {
                        console.log(layer.name);
                      }
                      if (fixedObj.type === "item") {
                        fixedObj.type = fixedObj.subtype;
                        fixedObj.y -= 16;
                        fixedObj.id = obj.x + "." + obj.y;
                        delete fixedObj.subtype;
                      }
                      passage[layer.name.toLowerCase()].push(fixedObj);
                      found = true;
                      break;
                    }
                  }
                } catch (err) {
                  _didIteratorError18 = true;
                  _iteratorError18 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion18 && _iterator18["return"]) {
                      _iterator18["return"]();
                    }
                  } finally {
                    if (_didIteratorError18) {
                      throw _iteratorError18;
                    }
                  }
                }

                if (!found) {
                  //  console.warn("NOT FOUND" + layer.name + ":", obj);
                  //console.warn(obj.gid+"-"+layer.firstgid,layer);
                  //debugger;
                }
              }
            } catch (err) {
              _didIteratorError17 = true;
              _iteratorError17 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion17 && _iterator17["return"]) {
                  _iterator17["return"]();
                }
              } finally {
                if (_didIteratorError17) {
                  throw _iteratorError17;
                }
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion10 && _iterator10["return"]) {
            _iterator10["return"]();
          }
        } finally {
          if (_didIteratorError10) {
            throw _iteratorError10;
          }
        }
      }
    }
  }, {
    key: "getTileProperties",
    value: function getTileProperties(gid) {
      var tilesets = metroid.game.cache._cache.tilemap.map.data.tilesets;
      for (var i = 0; i < tilesets.length; i++) {
        if (i == tilesets.length - 1 || gid < tilesets[i + 1].firstgid) {
          return tilesets[i].tileproperties.hasOwnProperty(gid - tilesets[i].firstgid) ? tilesets[i].tileproperties[gid - tilesets[i].firstgid] : null;
        }
      }
    }
  }, {
    key: "getIndex",
    value: function getIndex(X, Y, x, y) {
      /* ROOMX, ROOMY, inroom: x, y max 16,15 - Index of a tile*/
      return this.data[X * this.roomW + x + metroid.game.cache._cache.tilemap.map.data.width * (Y * this.roomH + y)];
    }
  }, {
    key: "index2coords",
    value: function index2coords(i) {
      var coords = { y: Math.floor(i / metroid.game.cache._cache.tilemap.map.data.width) };
      coords.x = i - coords.y;
      return coords;
    }
  }, {
    key: "createPassages2",
    value: function createPassages2() {
      //let gridSize = {x:16,y:15}; // SETTINGS (kan vara i filen)
      //
      //let roomLimits = {x:metroid.game.cache._cache.tilemap.map.data.width/gridSize.x, y: metroid.game.cache._cache.tilemap.map.data.height/gridSize.y};

      var mapData = metroid.game.cache._cache.tilemap.map.data;

      var seeds = [];

      for (var i = 0; i < mapData.layers[4].objects.length; i++) {
        var l = mapData.layers[4].objects[i];

        seeds.push({ x: Math.round(l.x / mapData.tilewidth), y: Math.round(l.y / mapData.tileheight), name: l.properties.name });
      }
      console.log(seeds);
      debugger;
    }
  }]);

  return MapParser;
})();

exports["default"] = MapParser;
module.exports = exports["default"];

},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MetroidMap = (function (_Phaser$Tilemap) {
  _inherits(MetroidMap, _Phaser$Tilemap);

  function MetroidMap(game, key) {
    _classCallCheck(this, MetroidMap);

    _get(Object.getPrototypeOf(MetroidMap.prototype), 'constructor', this).call(this, game, key);
    console.log("time:" + this.game.time.now);

    this.rooms = [];
    this.addTilesetImage('tiles');
    this.isReady = false;
    this.groundLayer = this.createLayer('Ground');
    /*for(let layer of this.layers){
      if(layer.name === "Ground"){
        this.groundLayer = layer;
      }
    }*/
    this.widthInRooms = this.width / 16;
    this.heightInRooms = this.height / 15;

    /* STEP 1 - DEFINE ROOM BOUNDARIES */
    //this.defineBoundaries();
    /* STEP 2 - POPULATE */
    //this.populateRooms();
    /* STEP 3 - COLLISION */
    this.rooms = metroid.mapData.passages;
    setTimeout((function () {
      this.calculateCollision();
      this.isReady = true;
    }).bind(this), 10);

    console.log("time:" + this.game.time.now);
  }

  _createClass(MetroidMap, [{
    key: 'waitingForCollision',
    value: function waitingForCollision() {
      if (this.isReady && metroid.samus.readyToAppear) {
        metroid.samus.invincible = 0;
        metroid.samus.appeared = true;
        if (metroid.samusSister) {
          metroid.samusSister.invincible = 0;
        }
      } else {
        setTimeout((function () {
          this.waitingForCollision();
        }).bind(this), 500);
      }
    }
  }, {
    key: 'defineBoundaries',
    value: function defineBoundaries() {
      var startPoint = {
        x: -1,
        y: -1
      };
      var tile = null;
      this.maxRooms = 300;
      /* Find a starting point and do first this.checkRoom (which is recursive after that)*/
      for (var rx = 0; rx < this.widthInRooms; rx++) {
        for (var ry = 0; ry < this.heightInRooms; ry++) {
          tile = this.getTile(rx * 16 + 8, ry * 15 + 8, this.groundLayer);
          if (tile !== null && tile.index === 1) {
            startPoint = {
              x: rx,
              y: ry
            };
            this.checkRoom(rx, ry, this);
            break;
          }
        }
        if (startPoint.x > 0) {
          break;
        }
      }
    }
  }, {
    key: 'checkRoom',
    value: function checkRoom(x, y) {
      this.maxRooms--;
      if (this.maxRooms < 0) {
        return;
      }
      if (this.checkIfMapped(x, y)) {
        return;
      }
      var roomType = this.checkRoomType(x, y);

      switch (roomType) {
        case 0:
          this.checkHorizontal(x, y);
          break;
        case 1:
          this.checkVertical(x, y);
          break;
        case 2:
          this.checkOneRoom(x, y);
          break;
      }
    }
  }, {
    key: 'checkIfMapped',
    value: function checkIfMapped(x, y) {
      //  console.log(x,y);

      for (var i in this.rooms) {
        if (this.rooms[i].x <= x && this.rooms[i].x2 >= x && this.rooms[i].y <= y && this.rooms[i].y2 >= y) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'checkRoomType',
    value: function checkRoomType(x, y) {
      var hor = false;
      var ver = false;
      var tile = undefined;

      for (var dy = 0; dy < 15; dy++) {
        /// KOLLA: VARFÖR OLIKA HÖGER OCH VÄNSTER?
        // left
        tile = this.getTile(x * 16, y * 15 + dy, this.groundLayer);
        if (tile.properties.hasOwnProperty("walkable")) {
          // Hål åt sidan
          tile = this.getTile(x * 16 - 1, y * 15 + dy, this.groundLayer);
          if (tile.properties.hasOwnProperty("walkable")) {
            // Tomt här
            ver = true;
            break;
          }
        }
        // right
        tile = this.getTile(x * 16 + 15, y * 15 + dy, this.groundLayer);
        //this.putTile(putTile, x * 16 + 15, y * 15 + dy, this.groundLayer);
        if (tile.properties.hasOwnProperty("walkable")) {
          ver = true;
          break;
        }
      }

      for (var dx = 0; dx < 16; dx++) {
        // top
        tile = this.getTile(x * 16 + dx, y * 15, this.groundLayer);
        //this.putTile(putTile,x * 16 +dx, y * 15 , this.groundLayer);

        if (tile.properties.hasOwnProperty("walkable")) {
          hor = true;
          break;
        }
        // bottom
        tile = this.getTile(x * 16 + dx, y * 15 + 14, this.groundLayer);
        //  this.putTile(putTile,x * 16 +dx, y * 15 + 14, this.groundLayer);
        if (tile.properties.hasOwnProperty("walkable")) {
          hor = true;
          break;
        }
      }

      if (ver) {
        return 0;
      }
      if (hor) {
        return 1;
      }
      return 2;
    }
  }, {
    key: 'checkHorizontal',
    value: function checkHorizontal(startX, startY) {
      // Horizontal rooms including one screeners

      // Definiera ny room-index så att det kan uppdateras under sökningen
      var pasteTile = this.getTile(10 * 16 + 3, 2, this.groundLayer);
      pasteTile.index = 403;

      //let coordinates = {first: startX, last: startX};
      var tile = undefined;
      this.rooms.push({
        x: startX,
        x2: startX,
        y: startY,
        y2: startY,
        doors: [],
        blocks: [],
        enemies: [],
        pickups: []
      });
      var currentRoom = this.rooms[this.rooms.length - 1];

      var passage = true;

      while (passage) {
        // Check to the left
        passage = false;
        for (var dy = 0; dy < 15; dy++) {
          //this.rooms[coordinates.first][startY] = ID;
          tile = this.getTile(currentRoom.x * 16, startY * 15 + dy, this.groundLayer);
          //this.putTile(pasteTile, currentRoom.x * 16, startY * 15 + dy);

          if (tile.index === 183) {
            this.checkRoom(currentRoom.x - 1, startY);
            currentRoom.doors.push({
              x: currentRoom.x,
              y: startY,
              side: 0,
              type: 0
            });
            passage = false;
            break;
          }
          if (tile.properties.hasOwnProperty("walkable")) {
            passage = true;
            break;
          }
        }
        if (passage) {
          currentRoom.x--;
        }
      }
      passage = true;
      while (passage) {
        // Check to the Right
        passage = false;
        for (var dy = 0; dy < 15; dy++) {
          //this.rooms[coordinates.last][startY] = ID;
          tile = this.getTile(currentRoom.x2 * 16 + 15, startY * 15 + dy, this.groundLayer);
          //this.putTile(pasteTile, currentRoom.x2 * 16 + 15, startY * 15 + dy);

          if (tile.index === 183) {
            this.checkRoom(currentRoom.x2 + 1, startY);
            currentRoom.doors.push({
              x: currentRoom.x2,
              y: startY,
              side: 1,
              type: 0
            });
            passage = false;
            break;
          }
          if (tile.properties.hasOwnProperty("walkable")) {
            passage = true;
            break;
          }
        }
        if (passage) {
          currentRoom.x2++;
        }
      }
      //    console.log("end", currentRoom);
    }
  }, {
    key: 'checkVertical',
    value: function checkVertical(startX, startY) {
      if (startX === 11) {}
      //    console.log(startX, startY);

      // Horizontal rooms including one screeners
      //  console.log("VERTICAL");
      // Definiera ny room-index så att det kan uppdateras under sökningen
      var pasteTile = this.getTile(10 * 16 + 3, 2, this.groundLayer);
      pasteTile.index = 124;
      var checkCue = [];
      //let coordinates = {first: startX, last: startX};
      var tile = undefined;
      this.rooms.push({
        x: startX,
        x2: startX,
        y: startY,
        y2: startY,
        doors: [],
        blocks: [],
        enemies: [],
        pickups: []
      });
      var currentRoom = this.rooms[this.rooms.length - 1];
      //    console.log(currentRoom.y * 16);
      //    console.log(currentRoom.y * 14 + 13);
      //console.log((currentRoom.y + 1) * 15);
      var passage = true;
      var passageCnt = 0;
      while (passage) {
        // Check UP
        passage = false;
        for (var dx = 0; dx < 16; dx++) {
          //this.rooms[coordinates.first][startY] = ID;
          tile = this.getTile(startX * 16 + dx, currentRoom.y * 15, this.groundLayer);
          //this.putTile(pasteTile, startX * 16 + dx, currentRoom.y * 15);

          if (tile.index === 183) {
            //this.checkRoom(currentRoom.x-1, startY,obj);
            //passage = false;
            //break;
          }
          if (tile.properties.hasOwnProperty("walkable")) {
            passage = true;
            break;
          }
        }
        if (passage) {
          currentRoom.y--;
        }
        if (passageCnt++ > 123) {
          passage = false;
        }
      }
      passage = true;
      passageCnt = 0;
      var leftDoor = undefined;
      var rightDoor = undefined;

      while (passage) {
        // Check down
        passage = false;
        //tile = this.getTile(startX * 16, currentRoom.y * 15 + 6, this.groundLayer);
        //this.putTile(pasteTile, startX * 16, currentRoom.y2 * 15 + 6);
        //this.putTile(pasteTile, startX * 16 + 15, currentRoom.y2 * 15 + 6);

        for (var dx = 0; dx < 16; dx++) {
          //this.rooms[coordinates.last][startY] = ID;
          tile = this.getTile(startX * 16 + dx, currentRoom.y2 * 15 + 14, this.groundLayer);
          //this.putTile(pasteTile, startX * 16 + dx, currentRoom.y2 * 15 + 14);

          if (tile.properties.hasOwnProperty("walkable")) {
            passage = true;
            break;
          }
        }
        if (passage) {
          currentRoom.y2++;
        }
        if (passageCnt++ > 5) {
          //passage=false;
        }
      }

      // check for doors

      for (var y = currentRoom.y; y < currentRoom.y2 + 1; y++) {
        leftDoor = this.getTile(currentRoom.x * 16, y * 15 + 6, this.groundLayer);
        rightDoor = this.getTile(currentRoom.x * 16 + 15, y * 15 + 6, this.groundLayer);
        if (currentRoom.x === 10) {}
        //    console.log(currentRoom, leftDoor.index, y, rightDoor.index);

        //console.log(startX, leftDoor.index + " " + rightDoor.index);
        if (rightDoor.index === 183) {
          //    console.log("RDoor right at" + y);
          currentRoom.doors.push({
            x: currentRoom.x,
            y: y,
            side: 1,
            type: 0
          });
          this.checkRoom(currentRoom.x + 1, y);
        }
        if (leftDoor.index === 183) {
          //      console.log("LDoor right at" + y);
          currentRoom.doors.push({
            x: currentRoom.x,
            y: y,
            side: 0,
            type: 0
          });
          this.checkRoom(currentRoom.x - 1, y);
        }
      }
    }
  }, {
    key: 'checkOneRoom',
    value: function checkOneRoom(x, y) {
      //    console.log(x,y);
      //return;
      this.rooms.push({
        x: x,
        x2: x,
        y: y,
        y2: y,
        doors: [],
        blocks: [],
        enemies: [],
        pickups: []
      });
      var currentRoom = this.rooms[this.rooms.length - 1];
      var leftDoor = undefined;
      var rightDoor = undefined;
      /// EXAKT SOM I VERTICAL.
      for (y = currentRoom.y; y < currentRoom.y2 + 1; y++) {
        leftDoor = this.getTile(currentRoom.x * 16, y * 15 + 6, this.groundLayer);
        rightDoor = this.getTile(currentRoom.x * 16 + 15, y * 15 + 6, this.groundLayer);
        //console.log(startX, leftDoor.index + " " + rightDoor.index);
        if (rightDoor.index === 183) {
          //      console.log("RDoor right at" + currentRoom.x+ ","+ y);
          if (y === 6) {
            //  return;
          }
          this.checkRoom(currentRoom.x + 1, y);
        }
        if (leftDoor.index === 183) {
          //    console.log("LDoor right at" + y);
          this.checkRoom(currentRoom.x - 1, y);
        }
      }
    }
  }, {
    key: 'populateRooms',
    value: function populateRooms() {
      var tile = undefined,
          removeTile = undefined;
      //let putTile = this.getTile(0, 0, this.groundLayer);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.rooms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var room = _step.value;

          // Update door ids and class to standard
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = room.doors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var door = _step2.value;

              door.id = door.x + "." + door.y + "." + door.side;
              door['class'] = 0;
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                _iterator2['return']();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          room.music = false;
          // Identify doors to alter class
          var properties = undefined;
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = this.objects.special[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var special = _step3.value;

              if (special.x >= room.x * 16 * 16 && special.x <= (room.x2 + 1) * 16 * 16 && special.y >= room.y * 16 * 15 && special.y < (room.y2 + 1) * 16 * 15) {
                // Special is within room
                console.log(special.gid - 466);
                if (!special.gid) {
                  if (special.properties.music) {
                    room.music = special.properties.music;
                  }
                  continue;
                }

                properties = this.tilesets[2].tileProperties[special.gid - 466];

                if (!properties) {
                  console.log("MAP Special layer error:", special.x, special.y);
                  continue;
                }
                if (!properties.door) {
                  continue;
                }

                console.log(properties);
                properties.roomCoordinates = {
                  x: Math.floor(special.x / (16 * 16)),
                  y: Math.floor(special.y / (16 * 15))
                };
                properties.side = special.x < properties.roomCoordinates.x * 16 * 16 + 8 * 16 ? 0 : 1;
                properties.id = properties.roomCoordinates.x + "." + properties.roomCoordinates.y + "." + properties.side;

                // Find door
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                  for (var _iterator5 = room.doors[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var door = _step5.value;

                    console.log(door, properties.id);
                    if (door.id === properties.id) {
                      door['class'] = properties.door;
                      break;
                    }
                  }
                } catch (err) {
                  _didIteratorError5 = true;
                  _iteratorError5 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                      _iterator5['return']();
                    }
                  } finally {
                    if (_didIteratorError5) {
                      throw _iteratorError5;
                    }
                  }
                }
              }
            }

            // Find enemies
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                _iterator3['return']();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          room.enemies = [];

          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = this.objects.enemies[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var enemy = _step4.value;

              if (enemy.x >= room.x * 16 * 16 && enemy.x <= (room.x2 + 1) * 16 * 16 && enemy.y >= room.y * 16 * 15 && enemy.y < (room.y2 + 1) * 16 * 15) {
                /*if(enemy.name === "" && this.tilesets[1].tileProperties[enemy.gid-421].name !== ""){
                  enemy.name = this.tilesets[1].tileProperties[enemy.gid-421].name;
                }*/
                enemy.info = this.tilesets[1].tileProperties[enemy.gid - 421];

                room.enemies.push(enemy);
              }
            }

            // Scan for special tiles in room
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                _iterator4['return']();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }

          for (var x = room.x * 16; x <= room.x2 * 16 + 15; x++) {
            for (var y = room.y * 15; y < room.y2 * 15 + 15; y++) {

              removeTile = false;
              tile = this.getTile(x, y, this.groundLayer);
              if (!tile) {
                continue;
              }

              if (tile.properties.hasOwnProperty("destroyable")) {
                room.blocks.push({
                  x: x,
                  y: y,
                  type: 0
                });
                removeTile = true;
              }
              if (tile.properties.hasOwnProperty("item")) {

                room.pickups.push({
                  x: x,
                  y: y,
                  type: tile.properties.item,
                  id: x + "." + y,
                  taken: false
                });

                removeTile = true;
              }
              if (removeTile) {
                this.putTile(null, x, y, this.groundLayer);
              }
              /*if(first && y===room.y*15){
                console.log(room.x, room.y, room.x2, room.y2,x,y);
                 this.putTile(putTile,x,y, this.groundLayer);
              }*/
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'calculateCollision',
    value: function calculateCollision() {
      var tile = undefined;
      for (var x = 0; x < this.width; x++) {
        for (var y = 0; y < this.width; y++) {
          tile = this.getTile(x, y, this.groundLayer);

          if (tile !== null && !tile.properties.hasOwnProperty("walkable") && !tile.properties.hasOwnProperty("door") && !tile.properties.hasOwnProperty("void")) {
            tile.collideUp = true;
            tile.collideRight = true;
            tile.collideDown = true;
            tile.collideLeft = true;
            /*tile.faceBottom = true;
            tile.faceLeft = true;
            tile.faceRight = true;
            tile.faceTop = true;*/
          }
        }
      }
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = metroid.mapData.passages[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var passage = _step6.value;

          if (passage['void'].length === 0) {
            continue;
          }
          //    console.log("voidstart");
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = passage['void'][Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var voidspace = _step7.value;

              for (var w = 0; w < voidspace.width; w++) {
                for (var h = 0; h < voidspace.height; h++) {
                  //    console.log(voidspace.x + w, voidspace.y + h);
                  tile = this.getTile(voidspace.x + w, voidspace.y + h, this.groundLayer);
                  if (tile !== null) {
                    tile.collideUp = false;
                    tile.collideRight = false;
                    tile.collideDown = false;
                    tile.collideLeft = false;
                  }
                }
              }
            }
            //  console.log("voidend");
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7['return']) {
                _iterator7['return']();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }
        }
        /*  for (let passage of metroid.mapData.passages) {
            if (passage.breakable.length === 0) {
              continue;
            }
            for (let breakable of passage.breakable) {
              for (let w = 0; w < breakable.width; w++) {
                for (let h = 0; h < breakable.height; h++) {
                  tile = this.putTile(null, breakable.x + w, breakable.y + h, this.groundLayer);
                }
              }
            }
          }*/
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6['return']) {
            _iterator6['return']();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      metroid.map.calculateFaces(metroid.ground.index);
    }
  }]);

  return MetroidMap;
})(Phaser.Tilemap);

exports['default'] = MetroidMap;
module.exports = exports['default'];

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PauseControl = (function () {
  function PauseControl(game) {
    _classCallCheck(this, PauseControl);

    this.game = game;
    this.musicMuted = false;
  }

  _createClass(PauseControl, [{
    key: "pause",
    value: function pause(muteMusic) {
      this.game.physics.arcade.isPaused = true;
      if (muteMusic) {
        metroid.music.current.pause();
        this.musicMuted = true;
      }
      /* PAUSE ALL ANIMATIONS */
      // Blocks
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = metroid.blocks.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var sprite = _step.value;

          sprite.animations.paused = true;
        }
        // Pause items
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = metroid.pickups.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var sprite = _step2.value;

          sprite.animations.paused = true;
        }
        // Pause enemies
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = metroid.enemies.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var enemyGroup = _step3.value;

          console.log(enemyGroup);
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = enemyGroup.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var sprite = _step4.value;

              console.log(sprite);
              sprite.animations.paused = true;
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
                _iterator4["return"]();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }
        // Pause samus
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      metroid.samus.animations.paused = true;
    }
  }, {
    key: "resume",
    value: function resume() {
      metroid.game.physics.arcade.isPaused = false;
      if (this.musicMuted) {
        metroid.music.current.resume();
        this.musicMuted = false;
      }
      /* PAUSE ALL ANIMATIONS */
      // Blocks
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = metroid.blocks.children[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var sprite = _step5.value;

          sprite.animations.paused = false;
        }
        // Pause items
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = metroid.pickups.children[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var sprite = _step6.value;

          sprite.animations.paused = false;
        }
        // Pause enemies
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
            _iterator6["return"]();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = metroid.enemies.children[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var enemyGroup = _step7.value;
          var _iteratorNormalCompletion8 = true;
          var _didIteratorError8 = false;
          var _iteratorError8 = undefined;

          try {
            for (var _iterator8 = enemyGroup.children[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
              var sprite = _step8.value;

              sprite.animations.paused = false;
            }
          } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion8 && _iterator8["return"]) {
                _iterator8["return"]();
              }
            } finally {
              if (_didIteratorError8) {
                throw _iteratorError8;
              }
            }
          }
        }
        // Pause samus
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
            _iterator7["return"]();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      metroid.samus.animations.paused = false;
      //  metroid.samus.animations.play();
    }
  }]);

  return PauseControl;
})();

exports["default"] = PauseControl;
module.exports = exports["default"];

},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pickup = (function (_Phaser$Sprite) {
  _inherits(Pickup, _Phaser$Sprite);

  function Pickup(game) {
    _classCallCheck(this, Pickup);

    _get(Object.getPrototypeOf(Pickup.prototype), "constructor", this).call(this, game, 0, 0, "sprites");
    // Shells
    this.animations.add("shell", ["pickUps/ballBlue0"]);
    var destroy = this.animations.add("destroyShell", ["pickUps/ballBlue1", "pickUps/ballBlue2"], 15);
    destroy.onComplete.add(function () {
      this.play(this.kind);
      this.body.setSize(16, 8, 0, 8);
    }, this);
    // Temporary
    this.animations.add("dot", ["pickUps/dot0", "pickUps/dot1"], 25, true);
    this.animations.add("missile", ["pickUps/missile0", "pickUps/missile1"], 25, true);
    // Permanent
    this.animations.add("energytank", ["pickUps/E0", "pickUps/E1", "pickUps/E2", "pickUps/E3"], 25, true);
    this.animations.add("missiles", ["pickUps/missiles0", "pickUps/missiles1", "pickUps/missiles2", "pickUps/missiles3"], 25, true);
    this.animations.add("marumari", ["pickUps/maru0", "pickUps/maru1", "pickUps/maru2", "pickUps/maru3"], 25, true);
    this.animations.add("bomb", ["pickUps/bomb0", "pickUps/bomb1", "pickUps/bomb2", "pickUps/bomb3"], 25, true);
    this.animations.add("varia", ["pickUps/varia0", "pickUps/varia1", "pickUps/varia2", "pickUps/varia3"], 25, true);
    this.animations.add("hijump", ["pickUps/high0", "pickUps/high1", "pickUps/high2", "pickUps/high3"], 25, true);
    this.animations.add("longbeam", ["pickUps/long0", "pickUps/long1", "pickUps/long2", "pickUps/long3"], 25, true);
    this.animations.add("icebeam", ["pickUps/ice0", "pickUps/ice1", "pickUps/ice2", "pickUps/ice3"], 25, true);
    this.animations.add("wavebeam", ["pickUps/wave0", "pickUps/wave1", "pickUps/wave2", "pickUps/wave3"], 25, true);
    this.animations.add("screwattack", ["pickUps/screw0", "pickUps/screw1", "pickUps/screw2", "pickUps/screw3"], 25, true);

    //this.game = game;
    this.game.physics.enable(this);
    this.body.allowGravity = false;
    this.body.immovable = true;
    this.body.moves = false;
    this.exists = false;
    this.alive = false;
    //this.open = false; // Behöävs inte === exists
    this.remove = false;
    this.beingTaken = true; // Prevent double take
    this.shell = false;
  }

  _createClass(Pickup, [{
    key: "update",
    value: function update() {
      if (!this.exists || this.game.physics.arcade.isPaused) {
        return;
      }

      if (this.shell && this.animations.currentAnim.name === "shell") {
        metroid.samus.body.immovable = false;
        this.game.physics.arcade.collide(metroid.samus, this);
        metroid.samus.body.immovable = true;
        this.game.physics.arcade.overlap(metroid.weapons, this, (function () {
          this.play("destroyShell");
        }).bind(this));
      } else if (this.animations.currentAnim.name !== "destroyShell") {
        this.game.physics.arcade.overlap(metroid.samus, this, null, this.pick);
      }
    }
  }, {
    key: "spawn",
    value: function spawn(x, y, type, data) {
      console.log(x, y, type, data);
      this.reset(x, y);
      this.id = data ? data : null;
      console.log("PPCI:", x, y, type);
      if (type === "random") {
        type = "dot";
        if (Math.random() > 0.5 && metroid.samus.items.missiles > 0) {
          type = "missile";
        }
      }
      this.alive = true;
      this.exists = true;
      this.beingTaken = false;
      this.anchor.setTo(0, 0);
      this.play(type);
      this.shell = false;

      this.kind = type;
      if (this.remove) {
        this.game.time.events.remove(this.remove);
      }
      if (type === "dot" || type === "missile") {
        this.anchor.setTo(0.5, 0.5);
        this.spawned = true;
        this.body.setSize(8, 8, 0, 0);
        this.remove = this.game.time.events.add(Phaser.Timer.SECOND * 4, function () {
          this.exists = false;
          this.alive = false;
          this.remove = false;
        }, this);
      } else {
        /*  this.x = x * 16;
          this.y = y * 16;*/
        if (type !== "missiles" && type !== "energytank" && type !== "marumari") {
          this.shell = true;
          this.play("shell");
          this.body.setSize(16, 16);
        } else {
          this.body.setSize(16, 8, 0, 8);
        }
        console.log(this);
      }

      /*if (data === "forReal") {
        this.x = x * 16;
        this.y = y * 16;
        this.body.setSize(16, 8, 0, 8);
      } else {
        this.exists = false;
        this.alive = false;
        metroid.blocks.createNew(this.x, this.y, "ball", {
          item: type
        });
      }*/

      return this;
    }
  }, {
    key: "pick",
    value: function pick(samus, item) {
      //play open
      if (item.animations.currentAnim.name === "shell") {
        return true;
      }
      console.log("PICK", item);
      if (item.beingTaken) {
        return;
      }
      item.beingTaken = true;

      if (item.kind in samus.items) {
        // 1. Permanent pick - Destroy from map
        // Update
        metroid.samus.takenItems.push(item.id);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = metroid.currentRoom.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var itemRecord = _step.value;

            console.log(itemRecord);
            if (itemRecord.id === item.id) {
              itemRecord.taken = true;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        switch (item.kind) {
          case "missiles":
            if (samus.items.missiles < 255) {
              samus.items.missiles += 5;
            }

            samus.vars.missiles += 5;
            metroid.buttonM.alpha = 1;
            break;
          case "energytank":
            if (samus.items.energytank < 6) {
              samus.items.energytank += 1;
            }
            samus.vars.energy += 100;
            break;
          default:
            samus.items[item.kind] = true;
            break;
        }

        metroid.pause.pause(true);

        /*    metroid.temps.currentMusic.pause();
            metroid.temps.itemMusic = item.game.sound.play('gotItem');
            item.game.physics.arcade.isPaused = true;
            for(var child of metroid.game.world.children){
              if(child.hasOwnProperty("animations")){
                child.animations.stop(null,false);
              }
            }*/
        metroid.temps.itemMusic = item.game.sound.play('gotItem');
        metroid.temps.itemMusic.onStop.add(function () {
          metroid.pause.resume();
          item.alive = false;
          item.exists = false;
        }, item);
        metroid.io.save();
      } else {
        // Temporary stuff (energy + missiles)
        switch (item.kind) {
          case "missile":
            samus.vars.missiles += 2;
            item.game.sound.play('missile');
            break;
          case "dot":
            item.game.sound.play('energy');
            samus.vars.energy += 5;
            break;
          default:
            alert(item.kind);
            break;
        }
        item.alive = false;
        item.exists = false;
      }

      if (samus.vars.missiles > samus.items.missiles) {
        samus.vars.missiles = samus.items.missiles;
      }
      if (samus.vars.energy > 99 + 100 * samus.items.energytank) {
        samus.vars.energy = 99 + 100 * samus.items.energytank;
      }
      if (samus.vars.energy > 20 && metroid.soundEffects.panic.isPlaying) {
        metroid.soundEffects.panic.stop();
      }
    }
  }]);

  return Pickup;
})(Phaser.Sprite);

exports["default"] = Pickup;
module.exports = exports["default"];

},{}],26:[function(require,module,exports){
/*import Bullet from '../stuff/Bullet';
import Door from '../stuff/Door';
import Block from '../stuff/Block';*/

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pool = (function (_Phaser$Group) {
  _inherits(Pool, _Phaser$Group);

  function Pool(state, spriteType, maxInstances, name, isEnemy) {
    _classCallCheck(this, Pool);

    _get(Object.getPrototypeOf(Pool.prototype), "constructor", this).call(this, state.game, state.game.world, name, false, true, Phaser.Physics.ARCADE);
    var sprite = undefined;
    this.spriteType = spriteType;
    maxInstances = 1;
    for (var i = 0; i < maxInstances; i++) {
      sprite = this.add(new spriteType(state.game), true);
      sprite.poolId = i;
    }
    if (isEnemy) {
      metroid.enemies.add(this);
    }
    return this;
  }

  _createClass(Pool, [{
    key: "fire",
    value: function fire(source, dir, type) {
      // bullets
      var bullet = this.getFirstExists(false);
      if (bullet) {
        bullet.fire(source, dir, type);
      }
    }
  }, {
    key: "createNew",
    value: function createNew(x, y, type, data) {
      //Doors, Pickups, Blocks, enemies
      //let obj = this.getFirstExists(false);
      var obj = this.getFirstDead(false);
      if (!obj) {
        obj = new this.spriteType(this.game);
        this.add(obj, true);
      }

      return obj.spawn(x, y, type, data);
    }
  }]);

  return Pool;
})(Phaser.Group);

exports["default"] = Pool;
module.exports = exports["default"];

},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Samus = (function (_Phaser$Sprite) {
  _inherits(Samus, _Phaser$Sprite);

  function Samus(game, x, y) {
    _classCallCheck(this, Samus);

    _get(Object.getPrototypeOf(Samus.prototype), "constructor", this).call(this, game, x, y, "sprites");
    this.game.physics.enable(this);
    if (x === 640) {
      metroid.samus = this;
      this.isSister = false;
    } else {
      metroid.samusSister = this;
      this.isSister = true;
      this.tint = 0x33FF33;
      this.exists = false;
    }
    this.name = "samus";
    this.jumpTimer = 0;
    this.forcedMovement = 0;
    this.anchor.setTo(0.5, 0.5);
    this.invincible = game.time.now + 50000;
    this.appeared = false;
    this.readyToAppear = false;
    this.body.allowGravity = false;
    //this.animations.a dd("StandBallRight", ["samus/ball0"]);
    var appear = this.animations.add("front", ["samus/front0", "samus/front1", "samus/front2", "samus/front3"], 0.45, false);
    appear.onComplete.add(function () {
      this.readyToAppear = true;
      metroid.map.waitingForCollision();
      metroid.music.current.resume();
      this.firstApperance = false;
    }, this);

    var _arr = [{
      dir: "Right",
      folder: "samus"
    }, {
      dir: "Missile",
      folder: "samusMissile"
    }];
    for (var _i = 0; _i < _arr.length; _i++) {
      var value = _arr[_i];

      this.animations.add("WalkBall" + value.dir, [value.folder + "/ball0", value.folder + "/ball1", value.folder + "/ball2", value.folder + "/ball3"], 20, true);
      this.animations.add("Walk" + value.dir, [value.folder + "/walk0", value.folder + "/walk1", value.folder + "/walk2"], 15, true);
      this.animations.add("UpWalk" + value.dir, [value.folder + "/shootUpStanding0", value.folder + "/shootUpStanding1", value.folder + "/shootUpStanding2", value.folder + "/shootUpStanding3"], 15, true);
      this.animations.add("FireWalk" + value.dir, [value.folder + "/shootRunning0", value.folder + "/shootRunning1", value.folder + "/shootRunning2"], 15, true);
      this.animations.add("UpFireWalk" + value.dir, [value.folder + "/shootUpStanding0", value.folder + "/shootUpStanding1", value.folder + "/shootUpStanding2", value.folder + "/shootUpStanding3"], 15, true);
      this.animations.add("Jump" + value.dir, [value.folder + "/jump"]);
      this.animations.add("FireJump" + value.dir, [value.folder + "/jump"]);
      this.animations.add("UpJump" + value.dir, [value.folder + "/jumpShootUp0"]);
      this.animations.add("UpFireJump" + value.dir, [value.folder + "/jumpShootUp0", value.folder + "/jumpShootUp1"], false);
      this.animations.add("SpinnJump" + value.dir, [value.folder + "/jumpSpinn0", value.folder + "/jumpSpinn1", value.folder + "/jumpSpinn2", value.folder + "/jumpSpinn3"], 20, true);
      this.animations.add("SpinnScrewJump" + value.dir, [value.folder + "/jumpSpinn0", value.folder + "/jumpSpinnScrew1", value.folder + "/jumpSpinnScrew2", value.folder + "/jumpSpinnScrew3"], 20, true);

      this.animations.add("Stand" + value.dir, [value.folder + "/standRight"], 15, true);
      this.animations.add("UpStand" + value.dir, [value.folder + "/aimUp"], 15, true);
      this.animations.add("FireStand" + value.dir, [value.folder + "/shootRight", value.folder + "/standRight"], 15, false);
      this.animations.add("UpFireStand" + value.dir, [value.folder + "/shootUpStanding0", value.folder + "/aimUp"], 15, false);
    }

    /*    metroid.samus.items = {
          marumari: false,
          missiles: 0,
          e: 0,
          bomb: false,
          icebeam: false,
          wavebeam: false, // EJ
          screwattack: false,
          hijump: false,
          varia: false, // EJ
          longbeam: false
        };*/

    this.takenItems = [];

    this.vars = {
      missiles: 0,
      energy: 40
    };

    if (this.isSister) {
      this.vars = metroid.samus.vars;
    }

    this.play("front");

    /*  this.x = 640;
      this.y = 3272 + 16 * 5 + 6 - 64;
       /* this.x = 102 * 16;
        this.y = 259 * 16;
       this.body.position.setTo(this.x,this.y);*/

    console.log("SAMUS Y: " + this.y);

    //this.body.setSize(13, 30, 0, 3); // normal
    this.body.setSize(12, 30, 12, 6);
    this.body.immovable = true;
    //this.body.setSize(16,16,0,0); // ball
    //  this.body.setSize(16,25,0,0); // jump without spinn
    //  this.body.setSize(18,21,0,3); // jump with spinn
    ///    metroid.samus = this;
    this.facing = 1; // 0 = titta fram anim
    this.cantJump = false;
    //  metroid.samus.missileMode = false;

    this.forms = {
      ball: false,
      spinn: false,
      inAir: false,
      aimUp: false,
      right: true,
      moving: false,
      shooting: false,
      fireKeyUp: true,
      armedMissile: false,
      screwattack: false
    };
    //metroid.game.loadGame();
    if (!this.isSister) {
      metroid.io.load(metroid.currentSaveSlot);
      this.gameVars.deaths++;
      metroid.io.save();
    }
    if (metroid.samus.items.missiles > 0) {
      metroid.buttonM.alpha = 1;
    }

    this.lavaHit = 0;
    this.game.add.existing(this);

    this.body.maxVelocity.y = 400;
    this.body.maxVelocity.x = 400;
    this.alive = true;
    this.firstApperance = true;
    this.body.collideWorldBounds = false;
    this.body.collideCameraBounds = true;

    //this.appeared = true;
    /*    this.watch('y', function (id, oldval, newval) {
          console.log('o.' + id + ' changed from ' + oldval + ' to ' + newval);
          debugger;
        });/*/
  }

  _createClass(Samus, [{
    key: "update",
    value: function update() {
      if (this.isSister) {
        this.appeared = metroid.samus.appeared;
        this.firstApperance = metroid.samus.firstApperance;
        this.body.allowGravity = metroid.samus.body.allowGravity;
        this.body.collideWorldBounds = metroid.samus.body.collideWorldBounds;
      }
      if (this.game.physics.arcade.isPaused || !this.appeared || !this.alive) {
        if (!this.appeared && this.firstApperance) {
          if (metroid.music.current.isPlaying) {
            metroid.music.current.pause();
          }
          if (!metroid.music.appear.isPlaying) {
            metroid.music.appear.play();
          }
          this.firstApperance = false;
        }
        return;
      } else if (!this.body.allowGravity) {
        this.body.allowGravity = true;
        this.body.collideWorldBounds = true;
        this.body.collideCameraBounds = true;
      }
      this.vars.elevator = null;
      //  console.log(this.y);

      var game = this.game;
      var samus = this; //metroid.samus;
      var pressedKeys = metroid.keys.isPressed;
      var wasPressed = metroid.keys.wasPressed;
      if (this.isSister) {
        pressedKeys = metroid.keys.sister.isPressed;
        wasPressed = metroid.keys.sister.wasPressed;
      }

      /*if (this.vars.energy < 10) {
        this.vars.energy = 99;
      }*/

      if (this.invincible !== 0) {
        this.alpha = this.game.time.now % 3 === 0 ? 0 : 1;
        if (this.invincible < this.game.time.now) {
          this.invincible = 0;
          this.alpha = 1;
        }
      }

      metroid.currentWeapon = metroid.samus.items.icebeam ? "icebeam" : "normal";
      // collisions
      game.physics.arcade.collide(samus, metroid.ground);
      /*if (this.invincible < this.game.time.now) {
        console.log(this.invincible,this.game.time.now)
        for (let enemyGroup of metroid.enemies.children) {
          this.game.physics.arcade.overlap(this, enemyGroup, null, this.hit);
        }
      }*/

      var currentTile = metroid.map.getTile(Math.round(samus.x / 16), Math.round(samus.y / 16), this.ground);

      if (currentTile !== null && currentTile.index !== 1 && currentTile.properties.hasOwnProperty("walkable")) {
        if (currentTile.properties.hasOwnProperty("lethal")) {
          this.inLava = true;
          if (this.lavaHit < this.game.time.now) {
            // lavahit för att begränsa hastighet på sänkt health
            samus.vars.energy -= currentTile.properties.lethal;
            if (samus.vars.energy < 20) {
              if (!metroid.soundEffects.panic.isPlaying) {
                metroid.soundEffects.panic.play(null, 0, 1, true);
              }
            }
            this.lavaHit = this.game.time.now + 500;
            if (!metroid.soundEffects.drowning.isPlaying) {
              metroid.soundEffects.drowning.play(null, 0, 1, true);
            }
          }
        } else {
          this.inLava = false;
          if (!this.inLava && metroid.soundEffects.drowning.isPlaying) {
            metroid.soundEffects.drowning.stop();
          }
        }
      } else {
        this.inLava = false;
        if (!this.inLava && metroid.soundEffects.drowning.isPlaying) {
          metroid.soundEffects.drowning.stop();
        }
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = metroid.enemies.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var enemyGroup = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = enemyGroup.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var enemy = _step2.value;

              if (enemy.frozen) {
                this.body.immovable = false;
              }

              if (this.invincible === 0 || enemy.frozen) {
                game.physics.arcade.collide(samus, enemy, null, samus.hit);
              }
              this.body.immovable = true;
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.body.immovable = false;
      game.physics.arcade.collide(samus, metroid.doors, function (samus, door) {
        door.touchingSamus(samus, door);
      });
      game.physics.arcade.collide(samus, metroid.blocks);
      this.body.immovable = true;

      var onGround = samus.body.touching.down || samus.body.blocked.down;
      if (onGround && !pressedKeys.jump) {
        this.cantJump = false;
      }
      if (samus.body.touching.up || samus.body.blocked.up) {
        samus.jumpTimer = 31;
        this.cantJump = true;
      }
      //controls
      samus.forms.aimUp = false;
      samus.forms.moving = false;

      if (this.vars.missiles === 0) {
        this.missileMode = false;
      }

      if (!onGround) {
        samus.forms.inAir = true;
      } else {
        samus.forms.inAir = false;
        samus.forms.spinn = false;
        samus.forms.screw = false;
      }

      samus.body.velocity.x = 0;
      //samus.body.velocity.y = 0;

      if (pressedKeys.right) {
        samus.body.velocity.x = 100;
        samus.forms.right = true;
        samus.forms.moving = true;
      } else if (pressedKeys.left) {
        samus.body.velocity.x = -100;
        samus.forms.right = false;
        samus.forms.moving = true;
      }

      if (pressedKeys.up) {
        if (!samus.forms.ball && this.vars.elevator && this.vars.elevator.direction === "up") {
          this.vars.elevator.runElevator();
          return;
        } else if (samus.forms.ball) {
          //samus.body.setSize(16, 32, 0, 4); // normal
          samus.body.setSize(12, 30, 12, 6);
          samus.body.y = samus.body.y - 16;
          //samus.body.velocity.y = -100;
        } else {
            samus.forms.aimUp = true;
          }
        samus.forms.ball = false;
        samus.forms.spinn = false;
      }
      if (pressedKeys.down && !samus.forms.ball) {
        if (this.vars.elevator && this.vars.elevator.direction === "down") {
          this.vars.elevator.runElevator();
          return;
        } else if (metroid.samus.items.marumari && onGround) {
          if (!samus.forms.ball) {
            this.game.sound.play('ball');

            samus.body.setSize(12, 12, 11, 16);
          }
          samus.forms.ball = true;
        }
      }

      //  console.log(pressedKeys.jump, this.cantJump, pressedKeys.jumpTimer);
      if (pressedKeys.jump) {
        if (!samus.forms.ball && !this.cantJump) {
          // Jump
          var jumpHeight = this.inLava ? 200 : metroid.samus.items.hijump ? 650 : 450; // Hstighet istället för tid?

          /* LAVAHOPP funkar inte eftersom den hamnar ovanför lavan i hoppet och räknar vanligt...*/
          if (pressedKeys.jumpTimer < jumpHeight) {
            this.body.velocity.y = -150;
          }

          if (!wasPressed.jump && onGround) {
            // Jump started!
            this.game.sound.play('jump');
            // Spinn?
            if (samus.body.velocity.x !== 0) {
              samus.forms.spinn = true;
              if (metroid.samus.items.screwattack) {
                samus.forms.screw = true;
                if (onGround) {
                  this.game.sound.play('screwattack');
                }
              }
            }
          }
        }
      } else if (!onGround) {
        this.cantJump = true;
      }

      /*if (pressedKeys.jump && !samus.forms.ball && (onGround || samus.jumpTimer < jumpHeight)) {
        if (onGround) {
          this.game.sound.play('jump');
        }
        if (samus.body.blocked.up && wasPressed.jump) {
          samus.jumpTimer = 31;
        }
        if (onGround) {
          samus.jumpTimer = 0;
          if (wasPressed.jump) {
            return;
          }
        }
         samus.body.velocity.y = -150;
        samus.forms.spinn = false;
        samus.jumpTimer++;
         if (samus.body.velocity.x !== 0) {
          samus.forms.spinn = true;
        }
       }*/

      if (!pressedKeys.fire) {
        samus.forms.fireKeyUp = true;
      } else if (samus.forms.fireKeyUp) {
        if (samus.forms.ball) {
          //console.log("layBomb");
          if (metroid.samus.items.bomb) {
            metroid.weapons.fire(samus, "", "bomb");
          }
        } else {
          //console.log("fire");
          var weaponToFire = this.missileMode ? "missile" : metroid.currentWeapon;
          if (samus.forms.aimUp) {
            metroid.weapons.fire(samus, "Up", weaponToFire);
          } else {
            metroid.weapons.fire(samus, samus.forms.right ? "Right" : "Left", weaponToFire);
          }
        }
        samus.forms.fireKeyUp = false;
        samus.forms.spinn = false;
      }

      if (pressedKeys.missile && !wasPressed.missile && this.vars.missiles > 0) {
        this.missileMode = !this.missileMode;
      }

      samus.currentAnimation = "";

      // MOVEMENT
      if (samus.forms.aimUp) {
        samus.currentAnimation = "Up";
      }
      if (samus.forms.inAir && !samus.forms.ball) {
        if (samus.forms.spinn) {
          samus.currentAnimation += "Spinn";
          if (samus.forms.screw) {
            samus.currentAnimation += "Screw";
          }
        }
        samus.currentAnimation += "Jump";
      } else if (samus.forms.moving) {
        samus.currentAnimation += "Walk";
      } else {
        samus.currentAnimation += "Stand";
      }
      if (samus.forms.shooting) {
        samus.currentAnimation += "Fire";
      }

      // BALL OVERRIDES ALL OTHER
      if (samus.forms.ball) {
        samus.currentAnimation = "WalkBall";
      }

      if (!this.missileMode) {
        samus.currentAnimation += "Right";
      } else {
        samus.currentAnimation += "Missile";
      }
      samus.scale.x = samus.forms.right ? 1 : -1;

      if (this.forcedMovement !== 0) {
        this.body.velocity.x += this.forcedMovement;
        this.forcedMovement *= 0.95;
        if (this.forcedMovement < 5) {
          this.forcedMovement = 0;
        }
      }

      if (this.bombedUp) {
        this.body.velocity.y -= 150;
        this.bombedUp = false;
      }

      //console.log(samus.currentAnimation, samus.forms.inAir);
      samus.play(samus.currentAnimation);
      this.body.checkCameraBounds();
    }
  }, {
    key: "spawn",
    value: function spawn() {}
  }, {
    key: "hit",
    value: function hit(samus, enemy) {
      if (enemy.frozen) {
        return true;
      }
      if (samus.forms.screw) {
        enemy.hit({
          type: "screwattack"
        });
        return false;
      }
      metroid.soundEffects.hurt.play();
      metroid.samus.vars.energy -= enemy.damage;
      samus.forcedMovement = 150;
      samus.forcedMovement *= enemy.x < samus.x ? 1 : -1;
      samus.body.velocity.y = -100;
      samus.invincible = samus.game.time.now + 1000;

      return false;
    }
  }, {
    key: "checkGround",
    value: function checkGround(samus, tile) {
      console.log("GROUND");
      if (tile.properties) {
        if (tile.properties.hasOwnProperty("walkable")) {
          return false;
        }
        console.log(tile.properties);
        //  return false;
      }
      return true;
    }
  }]);

  return Samus;
})(Phaser.Sprite);

exports["default"] = Samus;
module.exports = exports["default"];

},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _stuffBullet = require('../stuff/Bullet');

var _stuffBullet2 = _interopRequireDefault(_stuffBullet);

var Weapons = (function (_Phaser$Group) {
  _inherits(Weapons, _Phaser$Group);

  function Weapons(state) {
    _classCallCheck(this, Weapons);

    _get(Object.getPrototypeOf(Weapons.prototype), 'constructor', this).call(this, state.game, state.game.world, 'Weapons', false, true, Phaser.Physics.ARCADE);
    for (var i = 0; i < 64; i++) {
      this.add(new _stuffBullet2['default'](state.game), true);
    }
    return this;
  }

  _createClass(Weapons, [{
    key: 'fire',
    value: function fire(source, dir, type) {

      var bullet = this.getFirstExists(false);
      if (bullet) {
        bullet.fire(source, dir, type);
      }
    }
  }]);

  return Weapons;
})(Phaser.Group);

exports['default'] = Weapons;
module.exports = exports['default'];

},{"../stuff/Bullet":19}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debugGUI = (function (_dat$GUI) {
  _inherits(debugGUI, _dat$GUI);

  function debugGUI() {
    _classCallCheck(this, debugGUI);

    _get(Object.getPrototypeOf(debugGUI.prototype), 'constructor', this).call(this);
    this.value = 0;
    this.listen = 0;
  }

  _createClass(debugGUI, [{
    key: 'setupGUI',
    value: function setupGUI() {
      if (this.samusFolder) {
        while (this.samusFolder.__controllers.length > 0) {
          this.samusFolder.remove(this.samusFolder.__controllers[0]);
        }
        while (this.enhancementsFolder.__controllers.length > 0) {
          this.enhancementsFolder.remove(this.enhancementsFolder.__controllers[0]);
        }
      } else {
        this.samusFolder = this.addFolder('Samus');
        this.enhancementsFolder = this.addFolder('Enhancements');
      }
      /*  guiLevel.add(metroid, 'value', 0, 10).name('my Value');
        guiLevel.add(metroid, 'listen', 0, 100).name('listen').listen();
        guiLevel.add(metroid, 'randomColor').name('randomColor');*/
      this.samusFolder.add(metroid.samus.items, 'marumari').name('Marumari');
      this.samusFolder.add(metroid.samus.items, 'bomb').name('Bomb');
      this.samusFolder.add(metroid.samus.items, 'icebeam').name('Ice beam');
      this.samusFolder.add(metroid.samus.items, 'longbeam').name('Long beam');
      this.samusFolder.add(metroid.samus.items, 'wavebeam').name('Wave beam N/A');
      this.samusFolder.add(metroid.samus.items, 'hijump').name('Hijump');
      this.samusFolder.add(metroid.samus.items, 'screwattack').name('Screwattack');
      this.samusFolder.add(metroid.samus.items, 'varia').name('Varia N/A');
      this.samusFolder.add(metroid.samus.items, 'energytank', 0, 6).step(1).name('Energy tanks').onChange(this.energyTanksChange);
      this.samusFolder.add(metroid.samus.items, 'missiles', 0, 255).step(5).name('Max missiles').onChange(this.maxMissilesChange);
      this.samusFolder.add(metroid.samus.vars, 'energy', 1, 699).step(1).name('Current energy').listen().onChange(this.energyChange);
      this.samusFolder.add(metroid.samus.vars, 'missiles', 0, 255).step(1).name('Current missiles').listen().onChange(this.missilesChange);
      this.samusFolder.open();
      //guiLevel.add(metroid.enhancements, 'itemlabels').name('Item labels');
      //guiLevel.add(metroid.enhancements, 'minimap').name('Minimap');
      this.enhancementsFolder.add(metroid.enhancements, 'snes').name('16-bit GFX').onChange(this.toggle16bit);
      //guiLevel.add(metroid.enhancements, 'widescreen').name('16:9-resolution');
      this.enhancementsFolder.add(metroid.enhancements, 'twoplayer').name('Two player mode!').onChange(this.toggleSamusSister);
      this.enhancementsFolder.add(metroid.enhancements, 'quickelevators').name('Quick elevators');

      this.enhancementsFolder.open();
    }
  }, {
    key: 'toggleSamusSister',
    value: function toggleSamusSister(value) {
      metroid.samusSister.exists = value;
      if (value) {
        metroid.samusSister.x = metroid.samus.x;
        metroid.samusSister.y = metroid.samus.y;
        if (metroid.currentRoom.type === "vertical") {
          metroid.game.camera.follow(metroid.samus);
        } else {
          metroid.game.camera.follow([metroid.samus, metroid.samusSister]);
        }
      } else {
        metroid.game.camera.follow(metroid.samus);
      }
    }
  }, {
    key: 'toggle16bit',
    value: function toggle16bit(value) {
      console.log(this);
      metroid.map.tilesets[0].image.src = (metroid.game.isLive ? "/game" : "") + "/maps/metroid-tileset" + (value ? "-16bit" : "") + ".png"; console.log(metroid.map.tilesets[0].image.src);/////MJG
      metroid.map.groundLayer.dirty = true;
      setTimeout(function () {
        metroid.map.groundLayer.dirty = true;
      }, 100);
    }
  }, {
    key: 'maxMissilesChange',
    value: function maxMissilesChange(value) {
      if (metroid.samus.vars.missiles > value) {
        metroid.samus.vars.missiles = value;
      }

      metroid.HUD.update(true);
    }
  }, {
    key: 'missilesChange',
    value: function missilesChange(value) {
      if (value > metroid.samus.items.missiles) {
        metroid.samus.vars.missiles = metroid.samus.items.missiles;
      }
    }
  }, {
    key: 'energyChange',
    value: function energyChange(value) {
      if (value > metroid.samus.items.energytank * 100 + 99) {
        metroid.samus.vars.energy = metroid.samus.items.energytank * 100 + 99;
      }
    }
  }, {
    key: 'energyTanksChange',
    value: function energyTanksChange(value) {
      if (metroid.samus.vars.energy > value * 100 + 99) {
        metroid.samus.vars.energy = value * 100 + 99;
      }

      metroid.HUD.update(true);
    }
  }]);

  return debugGUI;
})(dat.GUI);

exports['default'] = debugGUI;
module.exports = exports['default'];

},{}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var loadAndSave = (function () {
  function loadAndSave(game) {
    _classCallCheck(this, loadAndSave);

    this.game = game;
  }

  _createClass(loadAndSave, [{
    key: "new",
    value: function _new(id, name) {
      if (!metroid.localStorage) {
        return;
      }
      var saveGame = {

        items: {
          marumari: false,
          missiles: 0,
          energytank: 0,
          bomb: false,
          icebeam: false,
          wavebeam: false,
          screwattack: false,
          hijump: false,
          varia: false,
          longbeam: false
        },
        takenItems: [],
        startPosition: null,

        gameVars: {
          kraid: {
            killed: false,
            statue: false
          },
          ridley: {
            killed: false,
            statue: false
          },
          deaths: 0,
          name: name
        }
      };
      localStorage.setItem("save" + id, JSON.stringify(saveGame));
    }
  }, {
    key: "load",
    value: function load(id, type, viewOnly) {
      //type är om det är inbyggd eller ej
      var loadData = undefined;
      if (type === "cheat") {
        loadData = {
          items: {
            marumari: true,
            missiles: 255,
            energytank: 6,
            bomb: true,
            icebeam: true,
            wavebeam: true,
            screwattack: true,
            hijump: true,
            varia: true,
            longbeam: true
          },
          takenItems: [],
          gameVars: {
            kraid: {
              killed: true,
              statue: false
            },
            ridley: {
              killed: false,
              statue: true
            },
            deaths: 0
          },
          vars: {
            missiles: 255,
            energy: 699
          },
          name: "cheater"

        };
      } else {
        if (!metroid.localStorage) {
          return false;
        }
        loadData = localStorage.getItem("save" + id);
        if (!loadData) {
          return false;
        }

        loadData = JSON.parse(loadData);
        loadData.vars = {
          missiles: 0,
          energy: 40
        };
        console.log(loadData);
        if (loadData.items.missiles > 255) {
          loadData.items.missiles = 255;
        }
        if (loadData.items.energytank > 6) {
          loadData.items.energytank = 6;
        }
      }
      /*  loadData.gameVars.deaths = 1;
        loadData.gameVars.name = "Samus 1";*/
      if (viewOnly) {
        return loadData;
      } else {
        metroid.samus.items = loadData.items;
        metroid.samus.takenItems = loadData.takenItems;
        metroid.samus.vars = loadData.vars;
        metroid.samus.gameVars = loadData.gameVars;
        return true;
      }
    }
  }, {
    key: "save",
    value: function save(id) {
      if (!metroid.localStorage) {
        return;
      }
      id = !id ? metroid.currentSaveSlot : id;

      var saveGame = {
        startPosition: null,
        items: metroid.samus.items,
        takenItems: metroid.samus.takenItems,
        gameVars: metroid.samus.gameVars
      };
      localStorage.setItem("save" + id, JSON.stringify(saveGame));
    }
  }, {
    key: "kill",
    value: function kill(id) {
      localStorage.removeItem("save" + id);
    }
  }]);

  return loadAndSave;
})();

exports["default"] = loadAndSave;
module.exports = exports["default"];

},{}]},{},[10])
//# sourceMappingURL=game.js.map
