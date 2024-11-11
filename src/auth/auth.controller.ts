import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up new user' })
  @ApiBody({
    description: 'Data to add the user',
    type: AuthDto,
    examples: {
      example1: {
        summary: 'Register user',
        value: {
          email: 'test@gmail.com',
          password: '123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Add user to the database.',
  })
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @ApiOperation({ summary: 'Sign in new user' })
  @ApiBody({
    description: 'Data to add the user',
    type: AuthDto,
    examples: {
      example1: {
        summary: 'Sign in user',
        value: {
          email: 'test@gmail.com',
          password: '123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User signed in',
  })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
