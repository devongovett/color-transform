# color-transform

Streaming image color space transforms

## Installation

    npm install color-transform

## Example

```javascript
var ColorTransform = require('color-transform');

// Convert a buffer (list of supported transforms below)
var rgb = ColorTransform.cmyk2rgb(new Buffer([ 0, 56, 128, 32 ]))
// => new Buffer([ 1, 13, 20 ])

// Streaming example. Converts a CMYK JPEG to an RGB PNG
fs.createReadStream('cmyk.jpg')
  .pipe(new JPEGDecoder)
  .pipe(new ColorTransform('rgb'))
  .pipe(new PNGEncoder)
  .pipe(fs.createWriteStream('out.png'));
```

## Supported color spaces

`color-transform` supports transforms between the following color spaces.
The only exception is CMYK, which is currently only supported in one direction -
you can convert from CMYK to any of the other color spaces, but not to CMYK.

* `'rgb'` - standard RGB
* `'rgba'` - RGB with alpha
* `'gray'` - grayspace
* `'graya'` - grayspace with alpha
* `'cmyk'` - CMYK

## API

You can call the conversion functions directly with a buffer to convert, as 
shown in the example. The functions are named by joining the two color spaces
with a `2`, such as `rgb2gray`, and `cmyk2rgb`.

You can also use the streaming API, which is a [pixel-stream](https://github.com/devongovett/pixel-stream).
The constructor accepts two parameters: source color space, and destination color space.
If you pipe another pixel-stream into `color-transform`, the source color space is optional
in the constructor since it will be learned from the source stream.

```javascript
// create a stream that converts from cmyk to rgb
var s = new ColorTransform('cmyk', 'rgb');

// pipe a stream that happens to be cmyk to an rgb color transform.
fs.createReadStream('cmyk.jpg')
  .pipe(new JPEGDecoder)
  .pipe(new ColorTransform('rgb'))
  // ...
```

## License

MIT
