import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransferService } from './transfer.service';
import { TransferDto } from '../../dtos/transfer/transfer.dto';
import { DepositDto } from '../../dtos/transfer/deposit.dto';
import { WithdrawDto } from '../../dtos/transfer/withdraw.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../entities/user/user.entity';

@ApiTags('Transferencias (RF-01 / RF-02)')
@ApiBearerAuth()
@Controller('transfer')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  // ─── RF-01: Notificación de Transferencias ────────────────────────────────
  @Post()
  @Roles(Role.USER)
  @ApiOperation({
    summary: 'RF-01 – Realizar una transferencia entre cuentas (Solo USER)',
    description:
      'Transfiere dinero de tu cuenta a otra cuenta por su ID. ' +
      'Al completarse con éxito, el sistema envía automáticamente una notificación ' +
      'en tiempo real por WebSocket (evento: transfer_sent / transfer_received) ' +
      'y un correo electrónico de comprobante al emisor y receptor.',
  })
  @ApiBody({ type: TransferDto })
  @ApiResponse({
    status: 201,
    description: 'Transferencia exitosa. Se generará notificación por WebSocket y correo.',
    schema: {
      example: {
        message: 'Transferencia exitosa',
        fromAccount: { id: 1, saldo: 850 },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Fondos insuficientes o datos inválidos' })
  @ApiResponse({ status: 403, description: 'No tienes permiso sobre la cuenta origen' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async transfer(@Request() req: any, @Body() transferDto: TransferDto) {
    // req.user viene del jwt-auth.guard (jwt.strategy.ts validate() return)
    const fromId = req.user.id;
    return this.transferService.transfer(
      fromId,
      transferDto.toAccountId,
      transferDto.amount,
    );
  }

  // ─── RF-02: Actualización Automática del Saldo – Depósito ─────────────────
  @Post('deposit')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'RF-02 – Realizar un depósito en una cuenta (Solo ADMIN)',
    description:
      'Acredita dinero en la cuenta indicada. ' +
      'Al completarse, el saldo se actualiza inmediatamente y el usuario recibe ' +
      'una notificación en tiempo real por WebSocket (evento: deposit_received) ' +
      'y un correo electrónico de confirmación.',
  })
  @ApiBody({ type: DepositDto })
  @ApiResponse({
    status: 201,
    description: 'Depósito exitoso. El saldo se actualiza inmediatamente.',
    schema: {
      example: {
        message: 'Depósito exitoso',
        accountId: 1,
        saldo: 1500,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Cuenta no encontrada o monto inválido' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Se requiere rol ADMIN' })
  async deposit(@Body() depositDto: DepositDto) {
    return this.transferService.deposit(
      depositDto.toAccountId,
      depositDto.amount,
    );
  }

  // ─── RF-02: Actualización Automática del Saldo – Retiro ───────────────────
  @Post('withdraw')
  @Roles(Role.USER)
  @ApiOperation({
    summary: 'RF-02 – Realizar un retiro de tu propia cuenta (Solo USER)',
    description:
      'Debita dinero de tu cuenta. Valida que tengas saldo suficiente. ' +
      'Al completarse, el saldo se actualiza inmediatamente y recibes ' +
      'una notificación en tiempo real por WebSocket (evento: withdraw_completed) ' +
      'y un correo electrónico de confirmación.',
  })
  @ApiBody({ type: WithdrawDto })
  @ApiResponse({
    status: 201,
    description: 'Retiro exitoso. El saldo se actualiza inmediatamente.',
    schema: {
      example: {
        message: 'Retiro exitoso',
        accountId: 1,
        saldo: 650,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Fondos insuficientes o monto inválido' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async withdraw(@Request() req: any, @Body() withdrawDto: WithdrawDto) {
    const userId = req.user.id;
    return this.transferService.withdraw(userId, withdrawDto.amount);
  }
}
