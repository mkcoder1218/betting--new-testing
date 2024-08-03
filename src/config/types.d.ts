export interface RootResultInterface {
  EventId: number;
  StartDateTimeAsWords: string;
  StartTimeAsWords: string;
  FinishTimeAsWords: string;
  TypeName: string;
  EventNumber: number;
  StatusValue: number;
  IsResulted: boolean;
  AdjustedStartTime: string;
  AdjustedFinishTime: string;
  MarketResults: any[];
  Race: Race;
  FootballMatch: any;
  FootballTournamentMatch: any;
  Archery: any;
  Boxing: any;
  PlayerVsPlayer: any;
  RacingRoulette: any;
  SpinAndWin: any;
  IceHockey: any;
  FinalHoops: any;
  CricketMatch: any;
  EventTypeCategoryEnumValue: number;
  EventTypeDisplayResourceKey: string;
  AssetPath: string;
  ID: any;
  HasErrorOccured: boolean;
  ErrorMessage: any;
}

export interface Race {
  Name: string;
  PlacePaysOn: number;
  Distance: number;
  Entries: Entry[];
  Result: string;
  KenoFeedID: number;
  KenoResult: any;
  NoOfParticipants: string;
  ID: number;
  HasErrorOccured: boolean;
  ErrorMessage: any;
}

export interface Entry {
  FeedId: number;
  Draw: number;
  Name: string;
  Finish: number;
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
  Favorite: any;
  BallAllocations: any;
  BallsDrawn: any;
  ID: number;
  HasErrorOccured: boolean;
  ErrorMessage: any;
}
