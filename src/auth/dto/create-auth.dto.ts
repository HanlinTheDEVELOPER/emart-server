import { IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  email: string;
}
