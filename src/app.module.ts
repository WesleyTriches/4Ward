import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SpecialtiesModule } from './specialties/specialties.module';


@Module({
  imports: [//adicionado aqui global o configModule
    ConfigModule.forRoot({ isGlobal: true }), 
    UsersModule, 
    ProfilesModule, 
    AuthModule, 
    SpecialtiesModule], //conectar sub modulos
  controllers: [],
  providers: [],
})
export class AppModule { }
