import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('estudiantes')
export class Estudiante {
  @ApiProperty({ example: 1, description: 'ID único del estudiante' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Juan', description: 'Nombre del estudiante' })
  @Column({ length: 100 })
  nombre: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del estudiante' })
  @Column({ length: 100 })
  apellido: string;

  @ApiProperty({ example: '2024001', description: 'Código único del estudiante' })
  @Column({ unique: true, length: 50 })
  codigo: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @UpdateDateColumn()
  updated_at: Date;
}
