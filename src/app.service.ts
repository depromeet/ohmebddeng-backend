import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): string {
    return 'Good! 👍 👍';
  }
  getReview(): string{
    return 'This is review';
  }
}
