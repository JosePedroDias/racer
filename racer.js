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
        };
    };

    loadSprites();



    onResourcesReady = function() {
        console.log('resources ready');

        var screenD = [window.innerWidth, window.innerHeight];
        var zeroP = zeroV();
        var scrollP = [0, 0];
        var carS = sprites.peugeot;
        var carD = imgDims(carS);
        var carP = copyV(screenD);
        var carDP = zeroV();
        var carR = 0;
        var carDR = 0; // 90deg / s
        var carSpd = 0;
        scaleV(carP, 0.5);
        var canvasIsDirty = true;

        var canvasEl = createCanvas(screenD, document.body);

        var ctx = canvasEl.getContext('2d');

        var hudD = [400, 50];
        var hudEl = createCanvas(hudD);
        var hCtx = hudEl.getContext('2d');

        var RED   = '#F00';
        var GREEN = '#0F0';
        var BLUE  = '#00F';
        var onHudRender = function() {
            hCtx.fillStyle = RED;
            rect(hCtx, zeroP, hudD, true);

            // speed bar
            hCtx.fillStyle = BLUE;
            rect(hCtx, [50, 12.25], [carSpd * 0.25, 25], true);

            // direction wheel
            hCtx.lineWidth = 4;
            hCtx.strokeStyle = GREEN;
            circle(hCtx, [200, 25], 25-2, true);
            //var t = 
            //line([200, 25], t)
            hCtx.lineWidth = 1;
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
                    return console.log(ev.keyCode);
            }

            carSpd = keepInLimit(carSpd, -200, 400);
            var t = R90;
            carDR = keepInLimit(carDR, -t, t);

            onHudRender();
            //console.log('DR:', carDR, 'Spd:', carSpd);
        };
        document.addEventListener('keydown', onKey);

        var t = zeroV();
        var lastT = -1 / 60;
        var onRender = function(T) {
            T /= 1000;
            var DT = T - lastT;
            
            rect(ctx, zeroP, screenD);

            ctx.save();
                scaleV(carD, -0.5, t);
                tT(ctx, carP); //ctx.translate(carP[0], carP[1]);
                ctx.rotate(carR + R90);
                tT(ctx, t); //ctx.translate(t[0], t[1]);
                blit(ctx, carS, zeroP);
            ctx.restore();

            blit(ctx, hudEl, zeroP);

            //console.log('DR:', carDR, 'Spd:', carSpd);
            //console.log('R:', carR, 'P:', carP);
            
            if (carDR !== 0) {
                carR += carDR * DT * carSpd*0.01;
            }

            if (carSpd !== 0) {
                moveV(carP, carR, carSpd * DT);

                keepInLimitWrapV(carP, zeroP, screenD);
            }

            lastT = T;
            raf(onRender);
        };

        raf(onRender);
    };


})();
