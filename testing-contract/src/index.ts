import { ethers } from 'ethers';
import { HelpersWrapper } from './helpers/helpers';



const main = async()=> {
  try {    

    const tokenAddress = "0xb55d3128919d4576aaa3d390638490a053cdea13"
    const wbnbAddress = "0x4200000000000000000000000000000000000006"
    const factoryAddress = "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E"
    const wbnbSymbol = "wbnb"
    const rpcUrl = "https://opbnb-mainnet-rpc.bnbchain.org"


    const fromAddress = "0xbab61b2fd3133e9c5627a0b3fe166572274f37c1" 
    const toAddress = "0x68601FCb114F5480D20c0338a63411aaDfe7c9ce"; 
    const amount = "0.00001"; 
    const data = "0x";


    const balance = await HelpersWrapper.getUICTokenBalance(fromAddress, rpcUrl)
     console.log({balance})
    // const priceUSD = await HelpersWrapper.calculatePriceOfTokenAInUSD(
    //    tokenAddress,
    //    wbnbAddress,
    //    factoryAddress,
    //    wbnbSymbol,
    //    rpcUrl
    // )

    // console.log("priceUSD",priceUSD)

    // const details = await HelpersWrapper.simulateTransactionCost(
    //   fromAddress,
    //   toAddress,
    //   amount,
    //   data,
    //   rpcUrl
    // )

    //console.log("details", details)

    // const coinIds = ['ethereum', 'bitcoin', 'binancecoin', 'polygon', 'matic-network'];
  
    // const coins = await HelpersWrapper.fetchCoinDataForSpecificCoins(coinIds)
    // console.log(coins)
    
  } catch (error) {
    throw error;
  }
}

main()