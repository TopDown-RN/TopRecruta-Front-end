import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CepController } from './cep.controller';
import { CepService } from './cep.service';

@Module({
  imports: [
    AuthModule,
    HttpModule.register({
      timeout: 10_000,
      maxRedirects: 3,
    }),
  ],
  controllers: [CepController],
  providers: [CepService],
})
export class CepModule {}
