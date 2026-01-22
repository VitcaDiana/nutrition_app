import {Module} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {AuthService} from './auth.service.js';

@Module({
    imports: [
        JwtModule.register({
            secret: 'SUPER_SECRET_KEY',
            signOptions: {expiresIn: '1d'},
        }),
    ],
    providers:[AuthService],
    exports:[AuthService,JwtModule],
})
export class AuthModule{}