import internal from "stream";
import { IsString, IsNumber, IsDate, IsBoolean } from 'class-validator';
import { FoodLevel } from '../../food/entities/food_level.entity';
import { TasteTag } from '../entities/taste_tag.entity';
import { Food } from '../../food/entities/food.entity';
import { User } from '../../user/entities/user.entity';

export class CreateReviewDto 
{

    hotLevelId : FoodLevel;
    @IsBoolean()

    food: Food;

    user: User;
    
}
