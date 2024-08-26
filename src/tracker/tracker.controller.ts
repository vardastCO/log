import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';
import * as winston from 'winston';
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
});

@Controller()
export class TrackerController {
  constructor(private readonly compressionService: CompressionService,
    private readonly decompressionService: DecompressionService ,
    @InjectDataSource() private readonly dataSource: DataSource  
  ) {}

  @MessagePattern({ cmd: 'create_log' })
  async create_log(@Payload() data: any, @Ctx() context: any)  {
    try {
      logger.info('End APIssssssssssssssssss'); 


      return this.compressionService.compressData(true);
    } catch(e) {
      throw new Error('log with the same name or name_en already exists');
    }
  }
  @MessagePattern({ cmd: 'add_view' })
  async add_view(@Payload() data: any, @Ctx() context: any)  {
    try {
      const input = this.decompressionService.decompressData(data.data)
      if (input.type == 'BRAND') {
        const sql = `
          UPDATE product_brands
          SET views = COALESCE(views, 0) + 1
          WHERE id = ${input.id};
        `;

       await this.dataSource.query(sql);

      }
      if (input.type == 'PRODUCT') {
        const sql = `
          UPDATE products
          SET views = COALESCE(views, 0) + 1
          WHERE id = ${input.id};
        `;

       await this.dataSource.query(sql);

      }
      

      if (input.type == 'SELLER') {
        const sql = `
          UPDATE product_sellers
          SET views = COALESCE(views, 0) + 1
          WHERE id = ${input.id};
        `;

       await this.dataSource.query(sql);

      }

      return this.compressionService.compressData(true);
    } catch(e) {
     console.log('rrr',e)
    }
  }
}
