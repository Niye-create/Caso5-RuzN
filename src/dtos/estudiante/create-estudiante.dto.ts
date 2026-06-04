import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateEstudianteDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre del estudiante' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  nombre: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del estudiante' })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @Length(1, 100, { message: 'El apellido debe tener entre 1 y 100 caracteres' })
  apellido: string;

  @ApiProperty({ example: '2024001', description: 'Código único del estudiante' })
  @IsString()
  @IsNotEmpty({ message: 'El código es requerido' })
  @Length(1, 50, { message: 'El código debe tener entre 1 y 50 caracteres' })
  codigo: string;
}
