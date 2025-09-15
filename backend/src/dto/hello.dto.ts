import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateGreetingDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}
