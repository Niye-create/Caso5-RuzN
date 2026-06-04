import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class TransferDto {
  @ApiProperty({ example: 2, description: 'ID de la cuenta destino a la que se enviará el dinero' })
  @IsNotEmpty()
  @IsInt()
  toAccountId: number;

  @ApiProperty({ example: 150.00, description: 'Monto a transferir (debe ser mayor a 0)' })
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  amount: number;
}
