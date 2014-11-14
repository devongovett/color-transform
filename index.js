var util = require('util');
var Transform = require('stream').Transform;
var PixelStream = require('pixel-stream');
var BufferList = require('bl');

// color space component counts
var components = {
  'rgb': 3,
  'rgba': 4,
  'gray': 1,
  'graya': 2,
  'cmyk': 4
};

function ColorTransform(a, b) {
  PixelStream.call(this);
   
  if (b) {
    this._transformFn = ColorTransform.getTransformFunction(a, b);
    this.colorSpace = b;
    this._components = components[a];
  } else {
    b = a;
  }
  
  this.buffer = new BufferList;
  
  this.once('format', function() {
    this._transformFn = ColorTransform.getTransformFunction(this.colorSpace, b);
    this._components = components[this.colorSpace];
    this.colorSpace = b;
  });
}

util.inherits(ColorTransform, PixelStream);

// Override pixel-stream's transform function because we don't need frame segmentation
ColorTransform.prototype._transform = function(data, encoding, done) {
  this.buffer.append(data);
    
  // make sure we have enough data
  if (this.buffer.length >= this._components) {
    // handle case where data length is not on a pixel boundary
    var tail = this.buffer.length - (this.buffer.length % this._components);
    var buf = this.buffer.slice(0, tail);
    this.buffer.consume(buf.length);
    this.push(this._transformFn(buf));
  }
  
  done();
};

// Override pixel-stream's addFrame method to just emit re-emit frame objects
// since we overrode the _transform function which usually does this
ColorTransform.prototype.addFrame = function(frame) {
  this.emit('frame', frame);
};

ColorTransform.getTransformFunction = function(a, b) {
  var fn = ColorTransform[a === b ? 'passthrough' : a + '2' + b];
  if (!fn)
    throw new Error('Unsupported color conversion: ' + a + '2' + b);
  
  return fn;
};

ColorTransform.passthrough = function(data) {
  return data;
};

ColorTransform.rgb2rgba = function(data) {
  var res = new Buffer((data.length / 3 | 0) * 4);
  var i = 0, j = 0;
  
  while (data.length - i >= 3) {
    res[j++] = data[i++];
    res[j++] = data[i++];
    res[j++] = data[i++];
    res[j++] = 255;
  }
  
  return res;
};

ColorTransform.rgb2gray = function(data) {
  var res = new Buffer(data.length / 3 | 0);
  var i = 0, j = 0;
  
  while (data.length - i >= 3) {
    res[j++] = 0.2126 * data[i++] + 0.7152 * data[i++] + 0.0722 * data[i++];
  }
  
  return res;
};

ColorTransform.rgb2graya = function(data) {
  var res = new Buffer((data.length / 3 | 0) * 2);
  var i = 0, j = 0;
  
  while (data.length - i >= 3) {
    res[j++] = 0.2126 * data[i++] + 0.7152 * data[i++] + 0.0722 * data[i++];
    res[j++] = 255;
  }
  
  return res;
};

// TODO: rgb2cmyk

ColorTransform.rgba2rgb = function(data) {
  var res = new Buffer((data.length / 4 | 0) * 3);
  var i = 0, j = 0;
  
  while (data.length - i >= 4) {
    var r = data[i++] / 255, 
        g = data[i++] / 255, 
        b = data[i++] / 255, 
        a = data[i++] / 255;
        
    res[j++] = Math.min(255, (((1 - a) * 1) + (a * r)) * 255);
    res[j++] = Math.min(255, (((1 - a) * 1) + (a * g)) * 255);
    res[j++] = Math.min(255, (((1 - a) * 1) + (a * b)) * 255);
  }
  
  return res;
};

ColorTransform.rgba2gray = function(data) {
  var res = new Buffer(data.length / 4 | 0);
  var i = 0, j = 0;
  
  while (data.length - i >= 4) {
    var g = (0.2126 * data[i++] + 0.7152 * data[i++] + 0.0722 * data[i++]) / 255;
    var a = data[i++] / 255;
    res[j++] = Math.min(255, (((1 - a) * 1) + (a * g)) * 255);
  }
  
  return res;
};

ColorTransform.rgba2graya = function(data) {
  var res = new Buffer((data.length / 4 | 0) * 2);
  var i = 0, j = 0;
  
  while (data.length - i >= 4) {
    res[j++] = 0.2126 * data[i++] + 0.7152 * data[i++] + 0.0722 * data[i++];
    res[j++] = data[i++];
  }
  
  return res;
};

// TODO: rgba2cmyk

ColorTransform.gray2rgb = function(data) {
  var res = new Buffer(data.length * 3);
  var i = 0, j = 0;
  
  while (i < data.length) {
    var v = data[i++];
    res[j++] = res[j++] = res[j++] = v;
  }
  
  return res;
};

ColorTransform.gray2rgba = function(data) {
  var res = new Buffer(data.length * 4);
  var i = 0, j = 0;
  
  while (i < data.length) {
    var v = data[i++];
    res[j++] = res[j++] = res[j++] = v;
    res[j++] = 255;
  }
  
  return res;
};

ColorTransform.gray2graya = function(data) {
  var res = new Buffer(data.length * 2);
  var i = 0, j = 0;
  
  while (i < data.length) {
    res[j++] = data[i++];
    res[j++] = 255;
  }
  
  return res;
};

// TODO: gray2cmyk

ColorTransform.graya2rgb = function(data) {
  var res = new Buffer((data.length / 2 | 0) * 3);
  var i = 0, j = 0;
  
  while (data.length - i >= 2) {
    var g = data[i++] / 255,
        a = data[i++] / 255;
        
    res[j++] = 
    res[j++] = 
    res[j++] = Math.min(255, (((1 - a) * 1) + (a * g)) * 255);
  }
  
  return res;
};

ColorTransform.graya2rgba = function(data) {
  var res = new Buffer((data.length / 2 | 0) * 4);
  var i = 0, j = 0;
  
  while (data.length - i >= 2) {
    var g = data[i++];
    res[j++] = res[j++] = res[j++] = g;
    res[j++] = data[i++];
  }
  
  return res;
};

ColorTransform.graya2gray = function(data) {
  var res = new Buffer(data.length / 2 | 0);
  var i = 0, j = 0;
  
  while (data.length - i >= 2) {
    var g = data[i++] / 255,
        a = data[i++] / 255;
        
    res[j++] = Math.min(255, (((1 - a) * 1) + (a * g)) * 255);
  }
  
  return res;
};

// TODO: graya2cmyk

// The function below was from PDF.js
// https://github.com/mozilla/pdf.js/blob/007d7b2d9579fb8659604dd57ce4bef56cb8ee24/src/core/colorspace.js#L633
//
// The coefficients below were found using numerical analysis: the method of
// steepest descent for the sum((f_i - color_value_i)^2) for r/g/b colors,
// where color_value is the tabular value from the table of sampled RGB colors
// from CMYK US Web Coated (SWOP) colorspace, and f_i is the corresponding
// CMYK color conversion using the estimation below:
//   f(A, B,.. N) = Acc+Bcm+Ccy+Dck+c+Fmm+Gmy+Hmk+Im+Jyy+Kyk+Ly+Mkk+Nk+255
ColorTransform.cmyk2rgb = function(data) {
  var res = new Buffer((data.length / 4 | 0) * 3);
  var i = 0, j = 0;
  
  while (data.length - i >= 4) {
    var c = (255 - data[i++]) / 255;
    var m = (255 - data[i++]) / 255;
    var y = (255 - data[i++]) / 255;
    var k = (255 - data[i++]) / 255;
    
    var r =
      (c * (-4.387332384609988 * c + 54.48615194189176 * m +
            18.82290502165302 * y + 212.25662451639585 * k +
            -285.2331026137004) +
       m * (1.7149763477362134 * m - 5.6096736904047315 * y +
            -17.873870861415444 * k - 5.497006427196366) +
       y * (-2.5217340131683033 * y - 21.248923337353073 * k +
            17.5119270841813) +
       k * (-21.86122147463605 * k - 189.48180835922747) + 255) | 0;
       
    var g =
      (c * (8.841041422036149 * c + 60.118027045597366 * m +
            6.871425592049007 * y + 31.159100130055922 * k +
            -79.2970844816548) +
       m * (-15.310361306967817 * m + 17.575251261109482 * y +
            131.35250912493976 * k - 190.9453302588951) +
       y * (4.444339102852739 * y + 9.8632861493405 * k - 24.86741582555878) +
       k * (-20.737325471181034 * k - 187.80453709719578) + 255) | 0;
       
    var b =
      (c * (0.8842522430003296 * c + 8.078677503112928 * m +
            30.89978309703729 * y - 0.23883238689178934 * k +
            -14.183576799673286) +
       m * (10.49593273432072 * m + 63.02378494754052 * y +
            50.606957656360734 * k - 112.23884253719248) +
       y * (0.03296041114873217 * y + 115.60384449646641 * k +
            -193.58209356861505) +
       k * (-22.33816807309886 * k - 180.12613974708367) + 255) | 0;
    
     res[j++] = Math.max(0, Math.min(255, r));
     res[j++] = Math.max(0, Math.min(255, g));
     res[j++] = Math.max(0, Math.min(255, b));
  }
  
  return res;
};

ColorTransform.cmyk2rgba = function(data) {
  return ColorTransform.rgb2rgba(ColorTransform.cmyk2rgb(data));
};

ColorTransform.cmyk2gray = function(data) {
  return ColorTransform.rgb2gray(ColorTransform.cmyk2rgb(data));
};

ColorTransform.cmyk2graya = function(data) {
  return ColorTransform.rgb2graya(ColorTransform.cmyk2rgb(data));
};

module.exports = ColorTransform;
