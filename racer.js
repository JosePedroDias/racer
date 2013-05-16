(function() {

    'use strict';

    var raf = window.requestAnimationFrame       ||
              window.mozRequestAnimationFrame    ||
              window.webkitRequestAnimationFrame ||
              window.msRequestAnimationFrame;

    var R360 = Math.PI * 2;
    var R90  = Math.PI * 0.5;

    var sprites = {};
    var spriteNames = 'peugeot';
    spriteNames = spriteNames.split(' ');

    var onResourcesReady;

    var keysDown = {};



    var loadSprites = function() {
        var numSprites = spriteNames.length;
        var spritesLeft = numSprites;

        var name, imgEl, imgUri, i;

        var onImgLoaded = function(name) {
            sprites[name] = this;
            --spritesLeft;
            console.log('sprite ' + name + ' loaded');
            if (spritesLeft === 0) {
                onResourcesReady();
            }
        };

        for (i = 0; i < numSprites; ++i) {
            name = spriteNames[i];
            imgUri = name + '.png';
            imgEl = new Image();
            imgEl.onload = onImgLoaded.bind(imgEl, name);
            imgEl.src = imgUri;
        }
    };

    loadSprites();



    onResourcesReady = function() {
        console.log('resources ready');

        var screenD = [window.innerWidth, window.innerHeight];
        var zeroP = v.zero();
        var scrollP = [0, 0];
        var carS = sprites.peugeot;
        var carD = v.imgDims(carS);
        var carP = v.copy(screenD);
        var carDP = v.zero();
        var carR = 0;
        var carDR = 0; // 90deg / s
        var carSpd = 0;
        v.scale(carP, 0.5);
        var canvasIsDirty = true;

        var c = cvs(screenD, document.body);

        var hudD = [400, 50];
        var h = cvs(hudD);

        var RED   = '#F00';
        var GREEN = '#0F0';
        var BLUE  = '#00F';
        var onHudRender = function() {
            h.c.fillStyle = RED;
            h.rect(zeroP, hudD, true);

            // speed bar
            h.c.fillStyle = BLUE;
            h.rect([50, 12.25], [carSpd * 0.25, 25], true);

            // direction wheel
            h.c.lineWidth = 4;
            h.c.strokeStyle = GREEN;
            h.circle([200, 25], 25-2, true);
            // TODO
            h.c.lineWidth = 1;
        };
        onHudRender();

        var onKey = function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            switch (ev.keyCode) {
                case 38:  carSpd += 50; break; // up
                case 40:  carSpd -= 50; break; // down
                case 39:  carDR += Math.PI / 8; break; // left
                case 37:  carDR -= Math.PI / 8; break; // right
                default:
                    //return console.log(ev.keyCode);
            }

            carSpd = v.inLimit(carSpd, -200, 400);
            var t = R90;
            carDR = v.inLimit(carDR, -t, t);

            onHudRender();
            //console.log('DR:', carDR, 'Spd:', carSpd);
        };
        document.addEventListener('keydown', onKey);

        var t = v.zero();
        var lastT = -1 / 60;
        var onRender = function(T) {
            T /= 1000;
            var DT = T - lastT;

            c.rect(zeroP, screenD);

            c.drawSprite(carS, carD, carP, carR + R90);

            c.blit(h.e, zeroP);

            if (carDR !== 0) {
                carR += carDR * DT * carSpd*0.01;
                //console.log('R:', carR);
            }

            if (carSpd !== 0) {
                v.move(carP, carR, carSpd * DT);
                v.inLimitWrap(carP, zeroP, screenD);
                //console.log('P:', carP);
            }

            lastT = T;
            raf(onRender);
        };

        raf(onRender);
    };

})();
