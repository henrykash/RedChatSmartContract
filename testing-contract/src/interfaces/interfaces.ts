export interface GasPriceResponse {
    gasPrice?: string;
    maxFeePerGas?: string; // EIP-1559 field
    maxPriorityFeePerGas?: string; // EIP-1559 field
  }

  export interface TransactionCostSimulationResponse {
    gasLimit: string;
    gasPrice: string;
    totalCost: string;
    lowFee: string;
    averageFee: string;
    highFee: string;
  }

  export interface CoinData {
    id: string;
    current_price: number;
    price_change_percentage_24h: string;
  }