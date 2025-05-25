export interface BetSlipResponse {
  id: string;
  date: string;
  betSlipNumber: string;
  maxWin: string;
  minWin: string;
  cashierCreateId: string;
  shopId: string;
  createdAt: string;
  updatedAt: string;
  Tickets: Ticket[];
  Cashier: Cashier;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  nums: number[];
  redeem: boolean;
  cancelled: boolean;
  stake: string;
  ticketExpiry: string;
  maxWin: string;
  win: any;
  oddId: string;
  cashierRedeemId: any;
  gameId: string;
  gameType: string;
  oddType: string;
  oddInformation: OddInformation;
  betSlipId: string;
  createdAt: string;
  updatedAt: string;
  Game: Game;
}

export interface OddInformation {
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

export interface Game {
  id: string;
  gameType: string;
  gamenumber: number;
  gameData: GameData;
  result: any;
  status: string;
  startTime: string;
  endTime: string;
  shopId: string;
  gameRTP: string;
  actualRTP: string;
  KironCookieIds: number;
  createdAt: string;
  updatedAt: string;
  KironCookieId: string;
}

export interface GameData {
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
  CacheExpiryDate: string;
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
export interface EventDetailInterface {
  data: {
    id: string;
    gameId: string;
    gameData: EventDetail;
    createdAt: string;
    updatedAt: string;
    GameDataId: string;
    RaceGameId: string;
  };
  message: string;
  error: string;
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
  CacheExpiryDate: string;
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

export interface Cashier {
  id: string;
  shopId: string;
  active: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  User: User;
  isSuperCashier: boolean;
}

export interface User {
  username: string;
}

export interface ShopDataApiResponse {
  data: ShopDatas;
  message: string;
  error: any;
}

export interface ShopDatas {
  id: string;
  name: string;
  address: string;
  phone: string;
  rtp: string;
  maxWin: number;
  agentId: string;
  oddId: string;
  gameStartNumber: string;
  depositBalance: string;
  KironCookieId: string;
  shopLimit: string;
  createdAt: string;
  updatedAt: string;
  Agent: Agent;
}

export interface Agent {
  id: string;
  agentName: string;
  address: string;
  active: boolean;
  userId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  isSuperCashier: boolean;
}
