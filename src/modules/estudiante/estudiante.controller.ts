import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEstudianteDto } from '../../dtos/estudiante/create-estudiante.dto';
import { EstudianteDto } from '../../dtos/estudiante/estudiante.dto';
import { EstudianteService } from './estudiante.service';

@ApiTags('estudiantes')
@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo estudiante' })
  @ApiResponse({ status: 201, description: 'Estudiante creado exitosamente', type: EstudianteDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createEstudianteDto: CreateEstudianteDto): Promise<EstudianteDto> {
    return await this.estudianteService.create(createEstudianteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los estudiantes' })
  @ApiResponse({ status: 200, description: 'Lista de estudiantes', type: [EstudianteDto] })
  async findAll(): Promise<EstudianteDto[]> {
    return await this.estudianteService.findAll();
  }
}
