import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user details.',
  })
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @ApiOperation({ summary: 'Edit user information' })
  @ApiBody({
    description: 'Data to edit the user',
    type: EditUserDto,
    examples: {
      example1: {
        summary: 'Update user profile',
        value: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
