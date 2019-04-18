const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.encoding = options && options.encoding ? options.encoding : 'utf-8';
    this.string = '';
  }

  _transform(chunk, encoding, callback) {
    this.string += chunk.toString();

    const lines = this.string.split(os.EOL);

    if (lines.length > 1) {
      lines.forEach((line) => {
        this.push(Buffer.from(line, this.encoding));
      });
    }

    callback();
  }
}

module.exports = LineSplitStream;
