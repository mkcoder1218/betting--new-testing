export interface TicketInterface {
  shopName: string;
  minPayout: number;
  maxPayout: number;
  gameStart: string;
  gameEnd: string;
  cashierName: string;
  betSlipNumber: string;
  stake: number;
  tickets: Ticket[];
  isCopy: boolean;
}

export interface Ticket {
  stake: number;
  game: string;
  selected: string;
  oddType: string;
}
