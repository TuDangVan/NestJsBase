import { Injectable } from '@nestjs/common';
const Transform = require("stream").Transform;
const zlib = require('zlib');
const fs = require('fs');
@Injectable()
export class AppService {

  // processing tranfrom stream
  tranformFile(files: any) {
    try {
      if (!files) return;
      console.log('tranformFile file === ', files?.file);
      //
      //	Create a new file which will contain the compressed data
      //
      const to_compressed_file = fs.createWriteStream(`${__dirname}/file.gz`, {
        flags: 'w',
        defaultEncoding: 'ascii',
        fd: null,
        mode: 0o666,
        autoClose: true
      });
      console.log(99999999999999999);

      //
      //	Compressor
      //
      const gz = zlib.createGzip();

      //
      //	Pipe
      //
      // get stream data from file.txt pass it to stream.Transform Gzip then pass stream to file gz
      files?.file?.[0]?.buffer
        .pipe(gz)
        .pipe(to_compressed_file);
      console.log('111111111111111 files?.file?.[0]?.buffer ==== ', files?.file?.[0]?.buffer);
    } catch (error) {
      throw error
    }
  }
}
