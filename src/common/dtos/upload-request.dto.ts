import { ApiProperty } from "@nestjs/swagger";

export class UploadRequestDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  readonly file: Express.Multer.File
}