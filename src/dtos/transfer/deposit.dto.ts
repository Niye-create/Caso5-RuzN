import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class DepositDto {
  @ApiProperty({ example: 1, description: 'ID de la cuenta a la que se depositará el dinero' })
  @IsNotEmpty()
  @IsInt()
  toAccountId: number;

  @ApiProperty({ example: 500.00, description: 'Monto a depositar (debe ser mayor a 0)' })
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  amount: number;
}
