import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 1. เพิ่มบรรทัดนี้

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.setGlobalPrefix('api', {
    exclude: ['auth/(.*)'], // ยกเว้นทุกเส้นทางที่ขึ้นต้นด้วย auth/ ไม่ต้องมี /api นำหน้า
  });

  // 2. เพิ่มบรรทัดนี้ (สั่งเปิดใช้งานตัวตรวจสอบ)
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();