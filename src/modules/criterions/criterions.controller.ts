import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CriterionsService } from './criterions.service';
import { CreateCriterionDto } from './dto/create-criterion.dto';
import { UpdateCriterionDto } from './dto/update-criterion.dto';

@Controller('criterions')
export class CriterionsController {
  constructor(private readonly criterionsService: CriterionsService) {}

  @Post()
  create(@Body() createCriterionDto: CreateCriterionDto) {
    return this.criterionsService.create(createCriterionDto);
  }

  @Get()
  findAll() {
    return this.criterionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.criterionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCriterionDto: UpdateCriterionDto) {
    return this.criterionsService.update(+id, updateCriterionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.criterionsService.remove(+id);
  }
}
