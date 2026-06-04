import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from '../../entities/estudiante/estudiante.entity';
import { EstudianteController } from './estudiante.controller';
import { EstudianteService } from './estudiante.service';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante])],
  providers: [EstudianteService],
  controllers: [EstudianteController],
  exports: [EstudianteService],
})
export class EstudianteModule {}
