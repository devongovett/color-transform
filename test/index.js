var ColorTransform = require('../');
var PassThrough = require('stream').PassThrough;
var assert = require('assert');

describe('color-transform', function() {
  describe('transform functions', function() {
    it('rgb2rgba', function() {
      assert.deepEqual(ColorTransform.rgb2rgba(new Buffer([ 250, 100, 4 ])), new Buffer([ 250, 100, 4, 255 ]));
      assert.deepEqual(ColorTransform.rgb2rgba(new Buffer([ 250, 100, 4, 1 ])), new Buffer([ 250, 100, 4, 255 ]));
      assert.deepEqual(ColorTransform.rgb2rgba(new Buffer([ 250, 100, 4, 1, 4, 2 ])), new Buffer([ 250, 100, 4, 255, 1, 4, 2, 255 ]));
    });
    
    it('rgb2gray', function() {
      assert.deepEqual(ColorTransform.rgb2gray(new Buffer([ 250, 100, 4 ])), new Buffer([ 124 ]));
      assert.deepEqual(ColorTransform.rgb2gray(new Buffer([ 250, 100, 4, 1 ])), new Buffer([ 124 ]));
      assert.deepEqual(ColorTransform.rgb2gray(new Buffer([ 250, 100, 4, 1, 4, 2 ])), new Buffer([ 124, 3 ]));
    });
    
    it('rgb2graya', function() {
      assert.deepEqual(ColorTransform.rgb2graya(new Buffer([ 250, 100, 4 ])), new Buffer([ 124, 255 ]));
      assert.deepEqual(ColorTransform.rgb2graya(new Buffer([ 250, 100, 4, 1 ])), new Buffer([ 124, 255 ]));
      assert.deepEqual(ColorTransform.rgb2graya(new Buffer([ 250, 100, 4, 1, 4, 2 ])), new Buffer([ 124, 255, 3, 255 ]));
    });
    
    it('rgba2rgb', function() {
      assert.deepEqual(ColorTransform.rgba2rgb(new Buffer([ 250, 100, 4, 255 ])), new Buffer([ 250, 100, 4 ]));
      assert.deepEqual(ColorTransform.rgba2rgb(new Buffer([ 250, 100, 4, 128 ])), new Buffer([ 252, 177, 129 ]));
      assert.deepEqual(ColorTransform.rgba2rgb(new Buffer([ 250, 100, 4, 255, 1 ])), new Buffer([ 250, 100, 4 ]));
      assert.deepEqual(ColorTransform.rgba2rgb(new Buffer([ 250, 100, 4, 128, 1 ])), new Buffer([ 252, 177, 129 ]));
      assert.deepEqual(ColorTransform.rgba2rgb(new Buffer([ 250, 100, 4, 128, 1, 4, 2, 255 ])), new Buffer([ 252, 177, 129, 1, 4, 2 ]));
    });
    
    it('rgba2gray', function() {
      assert.deepEqual(ColorTransform.rgba2gray(new Buffer([ 250, 100, 4, 255 ])), new Buffer([ 124 ]));
      assert.deepEqual(ColorTransform.rgba2gray(new Buffer([ 250, 100, 4, 128 ])), new Buffer([ 189 ]));
      assert.deepEqual(ColorTransform.rgba2gray(new Buffer([ 250, 100, 4, 255, 1 ])), new Buffer([ 124 ]));
      assert.deepEqual(ColorTransform.rgba2gray(new Buffer([ 250, 100, 4, 128, 1 ])), new Buffer([ 189 ]));
      assert.deepEqual(ColorTransform.rgba2gray(new Buffer([ 250, 100, 4, 128, 1, 4, 2, 255 ])), new Buffer([ 189, 3 ]));
    });
    
    it('rgba2graya', function() {
      assert.deepEqual(ColorTransform.rgba2graya(new Buffer([ 250, 100, 4, 255 ])), new Buffer([ 124, 255 ]));
      assert.deepEqual(ColorTransform.rgba2graya(new Buffer([ 250, 100, 4, 128 ])), new Buffer([ 124, 128 ]));
      assert.deepEqual(ColorTransform.rgba2graya(new Buffer([ 250, 100, 4, 255, 1 ])), new Buffer([ 124, 255 ]));
      assert.deepEqual(ColorTransform.rgba2graya(new Buffer([ 250, 100, 4, 128, 1 ])), new Buffer([ 124, 128 ]));
      assert.deepEqual(ColorTransform.rgba2graya(new Buffer([ 250, 100, 4, 128, 1, 4, 2, 255 ])), new Buffer([ 124, 128, 3, 255 ]));
    });
    
    it('gray2rgb', function() {
      assert.deepEqual(ColorTransform.gray2rgb(new Buffer([ 124 ])), new Buffer([ 124, 124, 124 ]));
      assert.deepEqual(ColorTransform.gray2rgb(new Buffer([ 124, 3 ])), new Buffer([ 124, 124, 124, 3, 3, 3 ]));
    });
    
    it('gray2rgba', function() {
      assert.deepEqual(ColorTransform.gray2rgba(new Buffer([ 124 ])), new Buffer([ 124, 124, 124, 255 ]));
      assert.deepEqual(ColorTransform.gray2rgba(new Buffer([ 124, 3 ])), new Buffer([ 124, 124, 124, 255, 3, 3, 3, 255 ]));
    });
    
    it('gray2graya', function() {
      assert.deepEqual(ColorTransform.gray2graya(new Buffer([ 124 ])), new Buffer([ 124, 255 ]));
      assert.deepEqual(ColorTransform.gray2graya(new Buffer([ 124, 3 ])), new Buffer([ 124, 255, 3, 255 ]));
    });
    
    it('graya2rgb', function() {
      assert.deepEqual(ColorTransform.graya2rgb(new Buffer([ 124, 255 ])), new Buffer([ 124, 124, 124 ]));
      assert.deepEqual(ColorTransform.graya2rgb(new Buffer([ 124, 128 ])), new Buffer([ 189, 189, 189 ]));
    });
    
    it('graya2rgba', function() {
      assert.deepEqual(ColorTransform.graya2rgba(new Buffer([ 124, 255 ])), new Buffer([ 124, 124, 124, 255 ]));
      assert.deepEqual(ColorTransform.graya2rgba(new Buffer([ 124, 128 ])), new Buffer([ 124, 124, 124, 128 ]));
      assert.deepEqual(ColorTransform.graya2rgba(new Buffer([ 124, 255, 3, 128 ])), new Buffer([ 124, 124, 124, 255, 3, 3, 3, 128 ]));
    });
    
    it('graya2gray', function() {
      assert.deepEqual(ColorTransform.graya2gray(new Buffer([ 124, 255 ])), new Buffer([ 124 ]));
      assert.deepEqual(ColorTransform.graya2gray(new Buffer([ 124, 128 ])), new Buffer([ 189 ]));
      assert.deepEqual(ColorTransform.graya2gray(new Buffer([ 124, 255, 3, 128 ])), new Buffer([ 124, 128 ]));
    });
    
    it('cmyk2rgb', function() {
      assert.deepEqual(ColorTransform.cmyk2rgb(new Buffer([ 255, 255, 255, 255 ])), new Buffer([ 255, 255, 255 ]));
      assert.deepEqual(ColorTransform.cmyk2rgb(new Buffer([ 0, 56, 128, 32 ])), new Buffer([ 1, 13, 20 ]));
      assert.deepEqual(ColorTransform.cmyk2rgb(new Buffer([ 0, 56, 128, 32, 1 ])), new Buffer([ 1, 13, 20 ]));
      assert.deepEqual(ColorTransform.cmyk2rgb(new Buffer([ 255, 255, 255, 255, 0, 56, 128, 32 ])), new Buffer([ 255, 255, 255, 1, 13, 20 ]))
    });
    
    it('cmyk2rgba', function() {
      assert.deepEqual(ColorTransform.cmyk2rgba(new Buffer([ 255, 255, 255, 255 ])), new Buffer([ 255, 255, 255, 255 ]));
      assert.deepEqual(ColorTransform.cmyk2rgba(new Buffer([ 0, 56, 128, 32 ])), new Buffer([ 1, 13, 20, 255 ]));
      assert.deepEqual(ColorTransform.cmyk2rgba(new Buffer([ 0, 56, 128, 32, 1 ])), new Buffer([ 1, 13, 20, 255 ]));
      assert.deepEqual(ColorTransform.cmyk2rgba(new Buffer([ 255, 255, 255, 255, 0, 56, 128, 32 ])), new Buffer([ 255, 255, 255, 255, 1, 13, 20, 255 ]))
    });
    
    it('cmyk2gray', function() {
      assert.deepEqual(ColorTransform.cmyk2gray(new Buffer([ 255, 255, 255, 255 ])), new Buffer([ 254 ]));
      assert.deepEqual(ColorTransform.cmyk2gray(new Buffer([ 0, 56, 128, 32 ])), new Buffer([ 10 ]));
      assert.deepEqual(ColorTransform.cmyk2gray(new Buffer([ 0, 56, 128, 32, 1 ])), new Buffer([ 10 ]));
      assert.deepEqual(ColorTransform.cmyk2gray(new Buffer([ 255, 255, 255, 255, 0, 56, 128, 32 ])), new Buffer([ 254, 10 ]))
    });
    
    it('cmyk2graya', function() {
      assert.deepEqual(ColorTransform.cmyk2graya(new Buffer([ 255, 255, 255, 255 ])), new Buffer([ 254, 255 ]));
      assert.deepEqual(ColorTransform.cmyk2graya(new Buffer([ 0, 56, 128, 32 ])), new Buffer([ 10, 255 ]));
      assert.deepEqual(ColorTransform.cmyk2graya(new Buffer([ 0, 56, 128, 32, 1 ])), new Buffer([ 10, 255 ]));
      assert.deepEqual(ColorTransform.cmyk2graya(new Buffer([ 255, 255, 255, 255, 0, 56, 128, 32 ])), new Buffer([ 254, 255, 10, 255 ]))
    });
  });
  
  describe('stream', function() {
    it('throws an error if transform function doesn\'t exist', function() {
      assert.throws(function() {
        var s = new ColorTransform('rgba', 'unknown');
      }, /Unsupported color conversion/);
    });
        
    it('converts data', function(done) {
      var s = new ColorTransform('rgba', 'rgb');
      var c = 0;
      
      s.on('data', function(data) {
        assert.deepEqual(data, new Buffer([ 250, 100, 4, 0, 222, 3 ]));
        if (++c === 2) done();
      });
      
      s.write(new Buffer([ 250, 100, 4, 255, 0, 222, 3, 255 ]));
      s.write(new Buffer([ 250, 100, 4, 255, 0, 222, 3, 255 ]));
      s.end();
    });
    
    it('uses passthrough if converting to the same color space', function(done) {
      var s = new ColorTransform('rgba', 'rgba');
      var c = 0;
      
      s.on('data', function(data) {
        assert.deepEqual(data, new Buffer([ 250, 100, 4, 255, 0, 222, 3, 255 ]));
        if (++c === 2) done();
      });
      
      s.write(new Buffer([ 250, 100, 4, 255, 0, 222, 3, 255 ]));
      s.write(new Buffer([ 250, 100, 4, 255, 0, 222, 3, 255 ]));
      s.end();
    });
    
    it('handles buffers smaller than a single pixel', function(done) {
      var s = new ColorTransform('rgba', 'rgb');
      
      s.on('data', function(data) {
        assert.deepEqual(data, new Buffer([ 250, 100, 4 ]));
        done();
      });
      
      s.write(new Buffer([ 250 ]));
      s.write(new Buffer([ 100 ]));
      s.write(new Buffer([ 4 ]));
      s.write(new Buffer([ 255 ]));
      s.end();
    });
    
    it('handles buffers that are not even pixel lengths', function(done) {
      var s = new ColorTransform('rgba', 'rgb');
      
      s.once('data', function(data) {
        assert.deepEqual(data, new Buffer([ 250, 100, 4 ]));
      });
      
      s.write(new Buffer([ 250, 100, 4, 255, 0, 222 ]));
      
      s.once('data', function(data) {
        assert.deepEqual(data, new Buffer([ 0, 222, 3 ]));
        done();
      });
      
      s.write(new Buffer([ 3, 255 ]));
      s.end();
    });
    
    it('emits frame objects', function() {
      var s = new ColorTransform('rgba', 'rgb');
      var emitted = false;
      
      s.once('frame', function() {
        emitted = true;
      });
      
      s.addFrame({ test: true });
      assert(emitted);
    });
    
    it('supports constructor with a single argument for piping', function(done) {
      var p = new PassThrough;
      p.width = p.height = 100;
      p.colorSpace = 'rgba';
      var s = new ColorTransform('rgb');
      
      p.pipe(s);
      
      s.on('data', function(data) {
        assert.deepEqual(data, new Buffer([ 250, 100, 4, 0, 222, 3 ]));
        done();
      });
      
      p.end(new Buffer([ 250, 100, 4, 255, 0, 222, 3, 255 ]));
    });
  });
});
