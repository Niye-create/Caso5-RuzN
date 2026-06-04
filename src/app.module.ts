import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MailModule } from './mail/mail.module';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { EstudianteModule } from './modules/estudiante/estudiante.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { TransferModule } from './modules/transfer/transfer.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    DatabaseModule,
    EventEmitterModule.forRoot(),
    AuthModule,
    TransferModule,
    UserModule,
    AccountModule,
    TransactionModule,
    NotificationsModule,
    MailModule,
    EstudianteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
