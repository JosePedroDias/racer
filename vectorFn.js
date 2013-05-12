// canvas useful abstractions

var _PI2 = Math.PI*2;

var rect = function(ctx, p0, dims, fill) {
    if (!fill) {
        return ctx.clearRect(p0[0], p0[1], dims[0], dims[1]);
    }
    ctx.fillRect(p0[0], p0[1], dims[0], dims[1]);
};

var line = function(ctx, p0, p1) {
    ctx.lineWidth = lWidth || 1;
    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.lineTo(p1[0], p1[1]);
    ctx.stroke();
};

var circle = function(ctx, p0, r, hollow) {
    ctx.beginPath();
    ctx.arc(p0[0], p0[1], r, 0, _PI2);
    if (hollow) { ctx.stroke(); }
    else {        ctx.fill();   }
};

var text = function(ctx, pos, txt, sz) {
    if (sz) {
        ctx.font = Math.round(sz) + 'px sans-serif';
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(txt, pos[0], pos[1]);
};

//  dPos
//  dPos, dDims
//  sPos, sDims, dPos, dDims
var blit = function(ctx, srcImg, a, b, c, d) {
    if (!c) {
        c = a;
        d = b;
        a = undefined;
        b = undefined;
    }
    if (!d) {      ctx.drawImage(srcImg, c[0], c[1]); }
    else if (!a) { ctx.drawImage(srcImg, c[0], c[1], d[0], d[1]); }
    else {         ctx.drawImage(srcImg, a[0], a[1], b[0], b[1], c[0], c[1], d[0], d[1]); }
};

var createCanvas = function(dims, parentEl) {
    var el = document.createElement('canvas');
    el.setAttribute('width',  dims[0]);
    el.setAttribute('height', dims[1]);
    if (parentEl) {
        parentEl.appendChild(el);
    }
    return el;
};

var imgDims = function(imgEl, v) { // to 2nd
    if (!v) { v = zeroV(); }
    v[0] = imgEl.width;
    v[1] = imgEl.height;
    return v;
};

var tT = function(ctx, v) {
    ctx.translate(v[0], v[1]);
};

var tS = function(ctx, v) {
    if (typeof v === 'number') {
        return ctx.scale(v, v);
    }
    ctx.scale(v[0], v[1]);
};



// geometry aux

var zeroV = function(destV) { // to 1st
    if (!destV) { destV = new Array(2); }
    destV[0] = 0;
    destV[1] = 0;
    return destV;
};

var copyV = function(srcV, destV) { // to 2nd
    if (!destV) { destV = zeroV(); }
    destV[0] = srcV[0];
    destV[1] = srcV[1];
    return destV;
};

var isZeroV = function(v) {
    return (v[0] === 0 && v[1] === 0);
};

var keepInLimit = function(n, m, M) {
    if      (n < m) { n = m; }
    else if (n > M) { n = M; }
    return n;
};

var keepInLimitWrap = function(n, m, M) {
    if      (n < m) { n = M; }
    else if (n > M) { n = m; }
    return n;
};

var keepInLimitV = function(v, m, M) {
    if      (v[0] < m[0]) { v[0] = m[0]; }
    else if (v[0] > M[0]) { v[0] = M[0]; }
    if      (v[1] < m[1]) { v[1] = m[1]; }
    else if (v[1] > M[1]) { v[1] = M[1]; }
    return v;
};

var keepInLimitWrapV = function(v, m, M) {
    if      (v[0] < m[0]) { v[0] = M[0]; }
    else if (v[0] > M[0]) { v[0] = m[0]; }
    if      (v[1] < m[1]) { v[1] = M[1]; }
    else if (v[1] > M[1]) { v[1] = m[1]; }
    return v;
};

var setV = function(v, x, y) {
    v[0] = x;
    v[1] = y;
    return v;
};

var scaleV = function(srcV, sclN, destV) { // to 3rd (1st)
    if (!destV) { destV = srcV; }
    destV[0] = srcV[0] * sclN;
    destV[1] = srcV[1] * sclN;
    return destV;
};

var _tmp = zeroV();
var moveV = function(posV, ang, dist) {
    setV(_tmp, dist * Math.cos(ang), dist * Math.sin(ang));
    sumV(posV, _tmp);
    return posV;
};

var sumV = function(v1, v2, destV) { // to 3rd (1st)
    if (!destV) { destV = v1; }
    destV[0] = v1[0] + v2[0];
    destV[1] = v1[1] + v2[1];
    return destV;
};

var distSquaredV = function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    return dx*dx + dy*dy;
};

var distV = function(a, b) {
    return Math.sqrt( distSquaredV(a, b) );
};
