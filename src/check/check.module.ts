import { Module } from '@nestjs/common';
import { CheckController } from './check.controller';

@Module({
  controllers: [CheckController],
})
export class CheckModule {}
