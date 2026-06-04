import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEstudianteDto } from '../../dtos/estudiante/create-estudiante.dto';
import { Estudiante } from '../../entities/estudiante/estudiante.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
  ) {}

  async create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
    const estudiante = this.estudianteRepository.create(createEstudianteDto);
    return await this.estudianteRepository.save(estudiante);
  }

  async findAll(): Promise<Estudiante[]> {
    return await this.estudianteRepository.find();
  }

  async findById(id: number): Promise<Estudiante | null> {
    return await this.estudianteRepository.findOne({ where: { id } });
  }

  async findByCodigo(codigo: string): Promise<Estudiante | null> {
    return await this.estudianteRepository.findOne({ where: { codigo } });
  }
}
