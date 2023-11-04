import { CreateGames } from '@app/use-cases/teacher/create-games';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateGamesBody } from '../dtos/create-games-body';
import { GameViewModel } from '../view-models/game-view-model';
import { JwtAuthGuard } from '@infra/auth/jwt-auth.guard';
import { JWTReqPayload } from 'src/interfaces';
import { AddQuestionsToGameBody } from '../dtos/add-questions-to-game-body';
import { AddQuestionsToGame } from '@app/use-cases/teacher/add-questions-to-game';
import { ListGroupsParams } from '../dtos/list-groups-params';
import { ListGamesByTeacher } from '@app/use-cases/user/list-games-by-teacher';
import { ListGamesByGroupParams } from '../dtos/list-games-by-group-params';
import { ListGamesByGroup } from '@app/use-cases/user/list-games-by-group';
import { PaginationQuery } from '../dtos/pagination-query';
import { parseToNumber } from '@helpers/parseToNumber';
import { StartAGame } from '@app/use-cases/teacher/start-a-game';
import { StartAGameBody } from '../dtos/start-a-game-body';

@Controller('games')
export class GameController {
  constructor(
    private readonly createGame: CreateGames,
    private addQuestionsToGame: AddQuestionsToGame,
    private listGamesByTeacher: ListGamesByTeacher,
    private listGamesByGroup: ListGamesByGroup,
    private startGame: StartAGame,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: CreateGamesBody, @Req() req: JWTReqPayload) {
    const { amount_games, game_level, group_id } = body;
    const { userId } = req.user;
    try {
      const { games } = await this.createGame.execute({
        amount_games,
        game_level,
        group_id,
        teacher_user_id: userId,
      });

      return {
        games: games.map((game) => GameViewModel.toHTTP(game)),
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Não foi possível criar os jogos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/questions')
  @UseGuards(JwtAuthGuard)
  async addQuestions(
    @Body() body: AddQuestionsToGameBody,
    @Req() req: JWTReqPayload,
  ) {
    const { game_id, questions_id } = body;
    const { userId: user_id } = req.user;
    try {
      const { game } = await this.addQuestionsToGame.execute({
        game_id,
        questions_id,
        user_id,
      });

      return {
        game: GameViewModel.toHTTP(game),
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Não foi possível adicionar essas questões',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/list/:teacher_id')
  async listByTeacher(
    @Param() { teacher_id }: ListGroupsParams,
    @Query() query: PaginationQuery,
  ) {
    try {
      const { page, per_page } = query;
      const { games, total_results } = await this.listGamesByTeacher.execute({
        user_id: teacher_id,
        page: parseToNumber(page),
        per_page: parseToNumber(per_page),
      });

      return {
        games: games.map((game) => GameViewModel.toHTTP(game)),
        total_results,
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Não foi listar os grupos desse professor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/list')
  async list(@Req() req: JWTReqPayload, @Query() query: PaginationQuery) {
    try {
      const { userId: user_id } = req.user;
      const { page, per_page } = query;
      const { games, total_results } = await this.listGamesByTeacher.execute({
        user_id,
        page: parseToNumber(page),
        per_page: parseToNumber(per_page),
      });

      return {
        games: games.map((game) => GameViewModel.toHTTP(game)),
        total_results,
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Não foi listar os grupos desse professor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/list/by-group/:group_id')
  async listByGroup(
    @Param() { group_id }: ListGamesByGroupParams,
    @Query() query: PaginationQuery,
  ) {
    try {
      const { page, per_page } = query;
      const { games, total_results } = await this.listGamesByGroup.execute({
        group_id,
        page: parseToNumber(page),
        per_page: parseToNumber(per_page),
      });

      return {
        games: games.map((game) => GameViewModel.toHTTP(game)),
        total_results,
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Não foi listar os grupos desse professor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/start')
  @UseGuards(JwtAuthGuard)
  async start(@Body() body: StartAGameBody, @Req() req: JWTReqPayload) {
    const { game_id } = body;
    const { userId: user_id } = req.user;
    try {
      const { game } = await this.startGame.execute({
        game_id,
        user_id,
      });

      return {
        game: GameViewModel.toHTTP(game),
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Não foi possível iniciar o jogo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
