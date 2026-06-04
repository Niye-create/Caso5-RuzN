import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class WithdrawDto {
  @ApiProperty({ example: 200.00, description: 'Monto a retirar de tu propia cuenta (debe ser mayor a 0)' })
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  amount: number;
}
