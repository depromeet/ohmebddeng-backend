import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Review } from 'src/review/entities/review.entity';
import { User } from '../entities/user.entity';

class UserLevelDto {
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: 'name' })
  name: string;

  @ApiProperty({ description: 'imageUrl' })
  imageUrl: string;

  @ApiProperty({ description: 'summary' })
  summary: string;

  @ApiProperty({ description: 'description' })
  description: string;

  @ApiProperty({ description: 'detail' })
  details: string[];

  @ApiProperty({ description: 'level' })
  level: number;
}

export class FindUserDto
  implements Omit<User, 'userLevel' | 'isDeleted' | 'role'>
{
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: 'anonymousId' })
  anonymousId: string;

  @ApiProperty({ description: 'appleId' })
  appleId: string;

  @ApiProperty({ description: 'googleId' })
  googleId: string;

  @ApiProperty({ description: 'kakaoId' })
  kakaoId: string;

  @ApiProperty({ description: 'naverId' })
  naverId: string;

  @ApiProperty({ description: 'facebookId' })
  facebookId: string;

  @ApiProperty({ description: 'email' })
  email: string;

  @ApiProperty({ description: 'password' })
  password: string;

  @ApiProperty({ description: 'nickname' })
  nickname: string;

  @ApiProperty({ description: 'profileImageUrl' })
  profileImageUrl: string;

  @ApiProperty({ description: 'createdAt' })
  createdAt: Date;

  @ApiProperty({ description: 'updatedAt' })
  updatedAt: Date;

  @ApiProperty({ description: 'deletedAt' })
  deletedAt: Date;

  @ApiProperty({ description: 'userLevel', type: UserLevelDto })
  userLevel: UserLevelDto;

  @ApiProperty({ description: 'reviews' })
  reviews: Review[];
}
