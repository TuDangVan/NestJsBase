import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UploadRequestDto } from './common/dtos/upload-request.dto';
import { ApiConsumes } from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'file',
          maxCount: 10,
        },
      ],
    ),
  )
  uploadFile(@Body() body: UploadRequestDto, @UploadedFiles() files: Express.Multer.File) {
    try {
      this.appService.tranformFile(files);
    } catch (error) {
      return error;
    }
  }
}
