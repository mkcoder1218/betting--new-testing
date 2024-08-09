import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../config/interceptor";

export interface GameData {
  id: string;
  gamenumber: number;
  result: null | any;
  status: string;
  startTime: string;
  shopId: string;
  createdAt: string;
  updatedAt: string;
  gameData: string;
  gameType: string;
}

interface GameResponse {
  data: GameData[];
  message: string;
  error: null | any;
}

interface RacingGameState {
  loading: boolean;
  error: string | null;
  message: string | null;
  game: GameData[] | null;
  gameType: string;
}

export interface RootEventData {
  FeedId: number;
  EventId: string;
  ParentEventId: any;
  TypeValue: number;
  BettingLayoutEnumValue: number;
  TypeName: string;
  SubTypeName: string;
  StartDateTimeAsWords: string;
  StartTimeAsWords: string;
  FinishTimeAsWords: string;
  Race: Race;
  Boxing: any;
  PlayerVsPlayer: any;
  Archery: any;
  FootballMatch: any;
  FootballTournamentMatch: any;
  RacingRouletteV2: any;
  SpinAndWin: any;
  FootballLeagueWeek: any;
  IceHockeyMatch: any;
  FinalHoopsMatch: any;
  PrimaryMarkets: any[];
  PrimaryMarketsStore: any[];
  Markets: any[];
  Events: any;
  AdjustedStartTime: string;
  AdjustedFinishTime: string;
  BetCloseTime: string;
  Number: number;
  StatusValue: number;
  IsFinished: boolean;
  FeedGuid: string;
  CacheExpiryDate: any;
  CacheExpiryDateAsWords: string;
  EstimatedFinishTime: string;
  IsNow: boolean;
  IsNext: boolean;
  HasBeenProcessed: boolean;
  GameProviderGUID: string;
  IceHockeyLeagueWeek: any;
  FinalHoopsLeagueWeek: any;
  FootballTournamentLeagueWeek: any;
  CricketMatch: any;
  LuckyRacing: any;
  ID: string;
  HasErrorOccured: boolean;
  ErrorMessage: any;
  eventDetail: EventDetail;
}

export interface Race {
  Name: string;
  PlacePaysOn: number;
  Distance: number;
  Entries: any[];
  Result: any;
  KenoFeedID: number;
  KenoResult: any;
  NoOfParticipants: any;
  ID: number;
  HasErrorOccured: boolean;
  ErrorMessage: any;
}

export interface EventDetail {
  Event: Event;
}

export interface Event {
  FeedId: number;
  EventId: string;
  ParentEventId: any;
  TypeValue: number;
  BettingLayoutEnumValue: number;
  TypeName: string;
  SubTypeName: string;
  StartDateTimeAsWords: string;
  StartTimeAsWords: string;
  FinishTimeAsWords: string;
  Race: Race2;
  Boxing: any;
  PlayerVsPlayer: any;
  Archery: any;
  FootballMatch: any;
  FootballTournamentMatch: any;
  RacingRouletteV2: any;
  SpinAndWin: any;
  FootballLeagueWeek: any;
  IceHockeyMatch: any;
  FinalHoopsMatch: any;
  PrimaryMarkets: any[];
  PrimaryMarketsStore: any[];
  Markets: Market[];
  Events: any;
  AdjustedStartTime: string;
  AdjustedFinishTime: string;
  BetCloseTime: string;
  Number: number;
  StatusValue: number;
  IsFinished: boolean;
  FeedGuid: string;
  CacheExpiryDate: any;
  CacheExpiryDateAsWords: string;
  EstimatedFinishTime: string;
  IsNow: boolean;
  IsNext: boolean;
  HasBeenProcessed: boolean;
  GameProviderGUID: string;
  IceHockeyLeagueWeek: any;
  FinalHoopsLeagueWeek: any;
  FootballTournamentLeagueWeek: any;
  CricketMatch: any;
  LuckyRacing: any;
  ID: string;
  HasErrorOccured: boolean;
  ErrorMessage: any;
}

export interface Race2 {
  Name: string;
  PlacePaysOn: number;
  Distance: number;
  Entries: Entry[];
  Result: any;
  KenoFeedID: number;
  KenoResult: any;
  NoOfParticipants: any;
  ID: number;
  HasErrorOccured: boolean;
  ErrorMessage: any;
}

export interface Entry {
  FeedId: number;
  Draw: number;
  Name: string;
  Finish: any;
  Form: string;
  LBW: string;
  StarRating: number;
  RacesSinceWin: number;
  RacesSincePlace: number;
  WinOdds: number;
  PlaceOdds: number;
  ShowOdds: number;
  SecondOdds: number;
  ThirdOdds: number;
  LastOdds: number;
  Last3Odds: number;
  Gender: any;
  Age: any;
  SilkImagePath: any;
  SilkNumber: string;
  DisplayFinish: number;
  LBWAsArray: number[];
  InverseRating: number;
  Description: string;
  Favorite?: number;
  BallAllocations: any;
  BallsDrawn: any;
  ID: number;
  HasErrorOccured: boolean;
  ErrorMessage: any;
}

export interface Market {
  FeedId?: string;
  Name?: string;
  Abbreviation?: string;
  ClassValue: number;
  ArcherySelections: any[];
  BoxingSelections: any[];
  InstantBetSelections: any[];
  PlayerVsPlayerSelections: any[];
  FootballMatchSelections: any[];
  KenoSelections: any[];
  LuckyLoot624Selections: any[];
  RaceSelections: RaceSelection[];
  RacingRouletteSelections: any[];
  SpinAndWinSelections: any[];
  IceHockeyMatchSelections: any[];
  FinalHoopsMatchSelections: any[];
  CricketMatchSelections: any[];
  MarketClassSelections: any[];
  FootballTournamentMatchSelections: any[];
  LuckyRacingSelections: any[];
  Split: any;
  IsClassAvailableForBetting: boolean;
  IsClassParticipants: boolean;
  ClassEnumValue: string;
  MarketClassID: number;
  DisplayDescription: string;
  AmericanDisplayDescription: any;
  CssClass: any;
  BettingLayouts: BettingLayout[];
  WinningSelectionID: any;
  WinningSelectionDescription?: string;
  ResourceKey: string;
  ID: string;
  HasErrorOccured: boolean;
  ErrorMessage: any;
}

export interface RaceSelection {
  First: number;
  Second: any;
  Third: any;
  FeedId: string;
  Odds: number;
  IsWinner: boolean;
  Sort: number;
  FeedDescription: string;
  DisplayDescription: string;
  ExtraDescription: string;
  EntryID?: number;
}

export interface BettingLayout {
  EventTypeEnumValue: number;
  MarketClassEventTypeID: number;
  Position: number;
  IsExpanded: boolean;
  BettingLayoutEnumValue: number;
  MarketClassID: number;
  ParentEventTypeEnumValue: any;
  LayoutPattern: any;
}

const initialState: RacingGameState = {
  loading: false,
  error: null,
  message: null,
  gameType: "SmartPlayKeno",
};

const racingGameSlice = createSlice({
  name: "racinggame",
  initialState: initialState,
  reducers: {
    addRacingGame: (state, action: PayloadAction<RacingGameState>) => {
      state.loading = action.payload.loading;
      state.error = action.payload.error;
      state.message = action.payload.message;
      state.game = action.payload.game;
    },
  },
});

export const { addRacingGame } = racingGameSlice.actions;

export default racingGameSlice.reducer;

export const getLastRacingGames =
  (shopId: string | undefined, gameType: string) =>
  async (
    dispatch: (arg0: {
      payload: RacingGameState;
      type: "racinggame/addRacingGame";
    }) => void
  ) => {
    dispatch(
      addRacingGame({
        loading: true,
        error: null,
        message: null,
        game: null,
        gameType,
      })
    );

    try {
      const gameResponse: GameResponse = (
        await axiosInstance.post("game/getEventsAndDetails", {
          shopId: shopId,
          name: gameType,
        })
      ).data;

      if (gameResponse.message === "success") {
        dispatch(
          addRacingGame({
            loading: false,
            error: gameResponse.error,
            message: gameResponse.message,
            game: gameResponse.data.reverse(),
            gameType,
          })
        );
      } else {
        dispatch(
          addRacingGame({
            loading: false,
            error: gameResponse.message,
            message: null,
            game: null,
            gameType,
          })
        );
      }


    } catch (err: AxiosError | any) {
      dispatch(
        addRacingGame({
          message: "",
          error: err?.response?.data
            ? err.response.data.error
            : "Something went wrong",
          loading: false,
          game: null,
          gameType,
        })
      );
    }
  };
