const axios = require('axios').default;
//const moment = require("moment");
const RSI = require('technicalindicators').RSI
const { Client, Intents  } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const SMA = require('technicalindicators').SMA
const WMA = require('technicalindicators').WMA
const EMA = require('technicalindicators').EMA
const ADX = require('technicalindicators').ADX
var ATR = require('technicalindicators').ATR
var MACD = require('technicalindicators').MACD;
var ROC = require('technicalindicators').ROC
var SUM = require('technicalindicators').sum
const VWAP = require('vwap')
const Highest = require('technicalindicators').highest
const Lowest = require('technicalindicators').lowest
const chalk = require ('chalk');
const express = require('express');
const app = express();
const cors = require('cors');
const Stock = require("stock-technical-indicators")
const Indicator = Stock.Indicator
const { Supertrend } = require("stock-technical-indicators/study/Supertrend")

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

var db = require('diskdb');

const mongoose = require('mongoose')
// let rsi = new RSI({ values: clossingValues, period: 16 })


// let sma = new SMA({ values: clossingValues, period: 16 })


// let ema = new EMA({ values: clossingValues, period: 16 })


// let wma = new WMA({ values: clossingValues, period: 16 })
// let wma2 = new WMA({ values: clossingValues, period: 8 })


// let adx = new ADX({ low:lowValues , high:highValues  , close: clossingValues, period: 16 })
// 
// let macd = new MACD({ values:clossingValues ,  fastPeriod: 12,slowPeriod: 26,signalPeriod: 9 ,SimpleMAOscillator: true,SimpleMASignal: true })



// let hmadata =[]

// for (let index = 0; index < wma.result.length; index++) {
//     const element = wma.result[index];
//     const element2 = wma2.result[index]*2;
//     const re = element2 - element
//     hmadata.push(re)
// }


// const HMA= new WMA({ values: hmadata, period: 4 }) 

mongoose.connect('XXXXXXXXXXXXXXXXXXXX YOUR MONGO-DB ACCOUNT XXXXXXXXXXXXXXXXXXXX', ()=>{
    console.log('your db is connected now')
  })


// const vwap = VWAP(vwapin)

let last_blance = 0;

client.on("ready", msg => {


    tick()



async function tick() {
    

 

    const list = await axios.get('https://api.coinex.com/v1/market/list')

let listOfUsdt = []

    for (let index = 0; index < list.data.data.length; index++) {

       

        if (list.data.data[index].charAt(list.data.data[index].length - 1) == "T") {
            
            await listOfUsdt.push(list.data.data[index])



        }

}




  

for (let index = 0; index < listOfUsdt.length; index++) {
    
    
 

    const data15 = await axios.get(`https://api.coinex.com/v1/market/kline?market=${listOfUsdt[index]}&limit=1000&type=1hour`)


const highValues = data15.data.data.map(e=> e[3]*1    )
const lowValues = data15.data.data.map(e=> e[4]*1    )
const clossingValues = data15.data.data.map(e=> e[2]*1    )
const volumeValues = data15.data.data.map(e=> e[5]*1    )
const openingValues = data15.data.data.map(e=> e[1]*1    )
const date = data15.data.data.map(e=> e[0]*1    )


/*   
   let atrCHOP = new ATR({ low:lowValues , high:highValues  , close: clossingValues, period: 1 })
   let HIG= new Highest({ values:clossingValues, period: 14 })
   let LOW= new Lowest({ values:clossingValues, period: 14 })
   let sumCHOP = new SUM({ values: atrCHOP.result, period: 14 })
   let ema200 = new EMA({ values: clossingValues, period: 200 })
   let CHOP=  100 * Math.log( (sumCHOP[985] / ( HIG[986] - LOW[986] )) ) / Math.log(14)
*/


const data = await axios.get(`https://api.coinex.com/v1/market/kline?market=${listOfUsdt[index]}&limit=1&type=1hour`)
const data2 = await axios.get(`https://api.coinex.com/v1/market/kline?market=${listOfUsdt[index]}&limit=60&type=1hour`)
   let sumRsi = RSI.calculate({ values: clossingValues, period: 2 })
   let last = data.data.data[0][2]
   var lastrsi = sumRsi[997]
   var beforelastrsi = sumRsi[996]
   var Rsisubtract = lastrsi - beforelastrsi
   var Rsi_Buy_position = ( lastrsi > beforelastrsi)
   var Rsi_Sell_position = ( lastrsi < beforelastrsi)
   var Rsi_Sell = (lastrsi >= 70 && beforelastrsi >= 70)
   var Rsi_Buy = (lastrsi <= 30 && beforelastrsi <= 30)
   
   
//=========ROC===============
   let Roc = ROC.calculate({period : 12, values : clossingValues})
   var Roc1 = Roc[987]
   var Roc2 = Roc[986]
   var RocSubtract = Roc1 - Roc2 
   var Roc_Buy_position = ( Roc1 > Roc2)
   var Roc_Sell_position = ( Roc1 < Roc2)
   var Roc_Buy = ( Roc1 < 0)
   var Roc_Sell = ( 0 < Roc1 )
//===========================
   

   let old_history = data2.data.data[58][2]
   let new_history = data2.data.data[59][2]
   let fee = last*0.3/100

   
   let ema = new EMA({ values: clossingValues, period: 8 })
   let emaResult = EMA.calculate({ values: ema.result, period: 8 })
   let emamintprice = last-JSON.stringify(emaResult[985])
   let ema_history1 = emaResult[985]
   let ema_history2 = emaResult[984]
   let ema_history_sell = ( ema_history1 - ema_history2 < 0 )
   let ema_history_buy = ( ema_history1 - ema_history2 > 0 )
   let EMA_Buy = (emamintprice >= 0)
   let EMA_Sell = (emamintprice < 0)
   
   let EMa_percent = last/emaResult[985]
   let trade_percent_pos = ( 0.98  <= EMa_percent && EMa_percent < 1)
   let trade_percent_nev = (EMa_percent >= 1)


       //======================mongo db
       const coinsSchema = {
        price : Number,
        coin: String,
        date: String,
        position: String,
        Net_profit: Number,
        time: String,
        position_State: String, 

        Atr_value: Number
      }
      const coinlist = mongoose.models.coinlist || mongoose.model('coinlist', coinsSchema)
      const coindoc = await coinlist.find({coin : `${listOfUsdt[index]}`}).sort({_id:-1}).limit(1)

   const price_data = ( coindoc[0].price )
   let blance = price_data
   let blance_check = ( blance == new_history )
   let total_profit_nev = await new_history - blance - fee
   let total_profit_pos = await blance - new_history- fee
   let profit_state_nev = (total_profit_nev > 0)
   let profit_state_pos = (total_profit_pos > 0)
   let Net_Profit  = 0
   const your_PS = ( coindoc[0].position_State )
   
   let position_state_sell = ( your_PS == 'true')
   let position_state_buy = ( your_PS == 'false')

   //===================supertrend=====================
const superData = []
for (let st = 0; st < 1000; st++) {
const a = [date[st],openingValues[st],highValues[st] ,lowValues[st],clossingValues[st],volumeValues[st]    ]
superData.push(a)
}
const newStudyATR = new Indicator(new Supertrend());
const trend = newStudyATR.calculate(superData,{ period: 14, multiplier: 1.5 })
console.log(trend[999])

const direction_Buy = (trend[999].Supertrend.Direction > 0)
const direction_Sell = (trend[999].Supertrend.Direction < 0)
const sumTrueRange = (trend[999].ATR.SumTrueRange < 0.01)

const Supertrande_stoploss_Buy = ( last > trend[999].Supertrend.Down + trend[999].Supertrend.Down*0.5/100)//buy lower value
const Supertrande_stoploss_Sell = ( last < trend[999].Supertrend.Up - trend[999].Supertrend.Up*0.5/100)
//const Supertrande_stoploss_Buy = ( coindoc[0].Atr_value < trend[999].ATR.Value*75/100)//buy lower value
//const Supertrande_stoploss_Sell = ( coindoc[0].Atr_value > trend[999].ATR.Value*75/100)

console.log(`range: ${trend[999].ATR.SumTrueRange},${sumTrueRange}\n stop_buy${coindoc[0].Atr_value},now:${trend[999].Supertrend.Up - trend[999].Supertrend.Up*0.5/100},${Supertrande_stoploss_Buy},sell:${Supertrande_stoploss_Sell}`)

//console.log(direction_Sell,sumTrueRange)

const super_1 = trend[999].Supertrend.Direction
const super_2 = trend[998].Supertrend.Direction
const super_3 = trend[997].Supertrend.Direction
const super_4 = trend[996].Supertrend.Direction
const super_5 = trend[995].Supertrend.Direction
const sum_true_range = trend[999].ATR.SumTrueRange

   //console.log(`${listOfUsdt[index]},EMA:${JSON.stringify(emaResult[985])},PRICE:${last},OPEN:${openprice},MINES:${emamintprice},RSI:${lastrsi},+pos(0=<x=<1)${trade_percent_pos},+nev(x>1)${trade_percent_nev},${EMa_percent}`)

   /*Ema strategy
   if( 0 <= emamintprice && emamintprice <= 0.005){
       let Ema_deside = 'sell'
       //console.log(Ema_deside)
       //console.log(`EMA:${JSON.stringify(emaResult[985])},PRICE:${last},MINES:${emamintprice}`)
   }else if( -0.005 <= emamintprice && emamintprice <= 0){
       let Ema_deside = 'Buy'
       //console.log(Ema_deside)
       //console.log(`EMA:${JSON.stringify(emaResult[985])},PRICE:${last},MINES:${emamintprice}`)
   }else{
       console.log('dont move!')
   }
*/
//=======================STOP-LOSS============================
var risk = 1.5
//sell
var detriment_sell = total_profit_nev
var loss_sell = detriment_sell/blance*100
var loss_protcol_sell = (loss_sell + risk < 0) 
//buy
var detriment_buy = total_profit_pos
var loss_buy = detriment_buy/blance*100
var loss_protcol_buy = (loss_buy + risk < 0) 
//============================================================
var psp = 0
if(profit_state_pos == true){
  psp = 20
}

var tpn = 0
if(Roc_Buy_position == true){
  var tpn = 20
}

var psn = 0
if(profit_state_nev == true){
  psn = 20
}

var tpp = 0
if(Roc_Sell_position == true){
  tpp = 20
}

var eb = 0
if(Roc_Buy == true){
  eb = 20
}

var es = 0
if(Roc_Sell == true){
  es = 20
}

var st = '0'
if( position_state_sell == true ){
  st = 'Sell'
}else{
  st = 'Buy'
}

var ehs = 0
if(Rsi_Sell == true){
  ehs = 20
}

var ehb = 0
if(Rsi_Buy == true){
  ehb = 20
}

//RSI
var rbp = 0
if(Roc_Buy_position == true){
  rbp = 20
}
var rsp = 0
if(Roc_Sell_position == true){
  rsp = 20
}

var BUY_state = Math.floor(psp) +  Math.floor(tpn) +  Math.floor(eb) +  Math.floor(ehb) + Math.floor(rbp)
var SELL_state =  Math.floor(psn) +  Math.floor(tpp) +  Math.floor(es) +  Math.floor(ehs) + Math.floor(rsp)

var BUY_NETprofit = (total_profit_pos/last)*100
var SELL_NETprofit = (total_profit_nev/last)*100

const infoSchema = {
  coin : String,
  price : Number,
  position : String,
  ema1 : Number,
  ema2 : Number,
  emapercent : Number,
  ema_subtract : Number,
  emas : Number,
  emab : Number,
  buy_state : Number,
  sell_state : Number,
  buy_netprofit : Number,
  sell_netprofit : Number,
  RSI_per : Number,
  ROC1 : Number,
  ROC2 : Number,
  Roc_Subtract : Number,
  super1 : Number,
  super2 : Number,
  super3 : Number,
  super4 : Number,
  super5 : Number,

  Sum_true_range : Number
}
const coin = listOfUsdt[index]
const price = last
const position = st
const ema1 = ema_history1
const ema2 = ema_history2
const emapercent = EMa_percent
const ema_subtract = emamintprice
const emas = ehs
const emab = ehb
const buy_state = BUY_state
const sell_state = SELL_state
const buy_netprofit = BUY_NETprofit
const sell_netprofit = SELL_NETprofit
const RSI_per = lastrsi
const ROC1 = Roc1
const ROC2 = Roc2
const Roc_Subtract = RocSubtract
const super1 = super_1
const super2 = super_2
const super3 = super_3
const super4 = super_4
const super5 = super_5

const Sum_true_range = sum_true_range

const informations = mongoose.models.informations || mongoose.model('informations', infoSchema)
const infos = new informations ({
  coin,
  price,
  position,
  ema1,
  ema2,
  emapercent,
  ema_subtract,
  emas,
  emab,
  buy_state,
  sell_state,
  buy_netprofit,
  sell_netprofit,
  RSI_per,
  ROC1,
  ROC2,
  Roc_Subtract,
  super1,
  super2,
  super3,
  super4,
  super5,

  Sum_true_range
});




    //let check_buy = (/*emamintprice <= 0 &&*/  emamintprice <= 0 &&  trade_percent_pos == true && profit_state_pos == false )
    //let check_sell = (/* 0 <= emamintprice  &&*/ 0 < emamintprice &&  trade_percent_nev == true && profit_state_nev == true)

    //let check_buy = ( EMA_Buy == true  &&  trade_percent_nev == true  &&  profit_state_pos == true  &&  blance_check == false    &&  position_state_buy == true)
    //let check_sell = ( EMA_Sell == true  &&  trade_percent_pos == true  &&  profit_state_nev == true  &&  blance_check == false  &&  position_state_sell == true)

    //let check_buy = true

   //console.log(listOfUsdt[index],sumRsi[967])
if( /*25<= sumRsi[967] && sumRsi[967] <= 30   &&*/      (/*EMA_Buy == true  &&  trade_percent_nev == true  &&*/  profit_state_pos == true   &&  position_state_buy == true /*&& ema_history_buy == true*/  && Roc_Buy_position == true && Roc_Buy == true && direction_Buy == true) || ( /*EMA_Buy == true  &&  trade_percent_nev == true   &&*/  position_state_buy == true /*&& ema_history_buy == true*/ && Roc_Buy_position == true && Supertrande_stoploss_Buy == true && direction_Buy == true) ){
    let Net_Profit = blance - new_history- fee
    client.channels.cache.get('YOUR DISCORD CHANNEL ID').send(`>>> Name:  **${listOfUsdt[index]}**\n :green_circle: Buy : ${last}\n :round_pushpin: ${(Net_Profit/blance)*100}\n :arrow_up_small: ${Net_Profit}\n :recycle:  ${emaResult[985]}\n :page_facing_up: Fee:${fee} `)

    const coinsSchema = {
        price : Number,
        coin: String,
        date: String,
        position: String,
        Net_profit: Number,
        time: String,
        position_State: String,

        Atr_value: Number
      }

      const price = last
      const coin = listOfUsdt[index]
      const date = Date.now()
      const position = "Buy"
      const Net_profit= Net_Profit
      const time = new Date()
      const position_State = true

      const Atr_value = trend[999].ATR.Value*75/100


      const coinlist = mongoose.models.coinlist || mongoose.model('coinlist', coinsSchema)

      const coindata = new coinlist ({
        price,
        coin,
        date,
        position,
        Net_profit,
        time,
        position_State,

        Atr_value
      });
      
      coindata.save()



}else if( /*70<= sumRsi[967] && sumRsi[967] <= 75 &&*/ (/*EMA_Sell == true  &&  trade_percent_pos == true  &&*/  profit_state_nev == true   &&  position_state_sell == true /*&& ema_history_sell == true*/  && Roc_Sell_position == true && Roc_Sell == true && direction_Sell == true) || (/*EMA_Sell == true  &&  trade_percent_pos == true   &&*/  position_state_sell == true /*&& ema_history_sell == true*/ && Roc_Sell_position == true && Supertrande_stoploss_Sell == true && direction_Sell == true) ){
    Net_Profit = new_history - blance - fee
    client.channels.cache.get('YOUR DISCORD CHANNEL ID').send(` >>> Name: **${listOfUsdt[index]}**\n :red_circle: sell : ${last}\n :round_pushpin: ${(Net_Profit/blance)*100}\n :arrow_up_small: ${Net_Profit}\n :recycle:  ${emaResult[985]}\n :page_facing_up: Fee:${fee}`)
    const coinsSchema = {
        price : Number,
        coin: String,
        date: String,
        position: String,
        Net_profit: Number,
        time: String,
        position_State: String,

        Atr_value: Number
      }

      const price = last
      const coin = listOfUsdt[index]
      const date = Date.now()
      const position = "Sell"
      const Net_profit= Net_Profit
      const time = new Date()
      const position_State = false

      const Atr_value = trend[999].ATR.Value*75/100


      const coinlist = mongoose.models.coinlist || mongoose.model('coinlist', coinsSchema)

      const coindata = new coinlist ({
        price,
        coin,
        date,
        position,
        Net_profit,
        time,
        position_State,

        Atr_value
      });
      
      coindata.save()


      
}
else{

        
        /*
        app.get("/doge", async (req, res) => {
            const coinlist = mongoose.models.coinlist || mongoose.model('coinlist', coinsSchema)
            const coindoc = await coinlist.find({coin : 'DOGEUSDT'}).sort({_id:-1}).exec((err, coinlist) => {
                 res.send(coinlist) 
              });  
            });
            app.get("/shib", async (req, res) => {
                const coinlist = mongoose.models.coinlist || mongoose.model('coinlist', coinsSchema)
                const coindoc = await coinlist.find({coin : 'SHIBUSDT'}).sort({_id:-1}).exec((err, coinlist) => {
                     res.send(coinlist) 
                  });  
                });  
                */   
    //client.channels.cache.get('YOUR DISCORD CHANNEL ID').send(`${listOfUsdt[index]} warning :coin: ${last} :round_pushpin: ${lastrsi} :warning: `)
}
/*
client.on('message', (message) => {
    //console.log(`[${message.author.tag}]: ${message.content}`)
    if (message.content === 'info'){
        client.channels.cache.get('YOUR DISCORD CHANNEL ID').send(`>>> Name : **${listOfUsdt[index]}**\n :moneybag: Blance : ${blance}\n  :coin: Price : ${last}\n  :bar_chart:  Position State : ${your_PS} (true:buy/false:sell)\n  __BUY__\n :green_square: Buy profit price : ${total_profit_pos}\n  :green_square: Buy profit : ${profit_state_pos}\n :green_square: Trade for buy : ${trade_percent_nev}\n :green_square: EMA buy : ${EMA_Buy}\n  Blance Check(false is ok): ${blance_check}\n __SELL__\n :res_square: Sell profit price : ${total_profit_nev}\n :red_square: Sell profit : ${profit_state_nev}\n :red_square: Trade for sell : ${trade_percent_pos}\n  :red_square: EMA sell : ${EMA_Sell}\n  Blance Check(false is ok): ${blance_check}\n  __EMA State__\n :white_large_square: EMA : ${EMa_percent}\n :white_large_square: EMA=1=${ema_history1}\n  :white_large_square: EMA=2=${ema_history2}\n  :x:  EMA sell = ${ema_history_sell}\n  :x:  EMA buy = ${ema_history_buy}\n  ***----------------------***`)
    }
})
*/

  const update = { 
  price: last, 
  position : st, 
  ema1 : ema_history1, 
  ema2 : ema_history2, 
  emapercent : EMa_percent, 
  ema_subtract : emamintprice, 
  emab: ehb, 
  emas: ehs, 
  buy_state: BUY_state, 
  sell_state: SELL_state, 
  buy_netprofit: BUY_NETprofit, 
  sell_netprofit: SELL_NETprofit, 
  RSI_per : lastrsi,
  ROC1 : Roc1,
  ROC2 : Roc2,
  Roc_Subtract : RocSubtract,
  super1 : super_1,
  super2 : super_2,
  super3 : super_3,
  super4 : super_4,
  super5 : super_5,

  Sum_true_range : sum_true_range
};
await informations.findOneAndUpdate({coin : listOfUsdt[index]},update)
//infos.save()
  app.get("/xlm", async (req, res) => {
      const coinlist = mongoose.models.coinlist || mongoose.model('coinlist', coinsSchema)
      const coindoc = await coinlist.find({coin : 'XLMUSDT' }).sort({_id:-1}).exec((err, coinlist) => {
           res.send(coinlist) 
        });  
      });

      app.get("/other", async (req, res) => {
        const informations = mongoose.models.informations || mongoose.model('informations', infoSchema)
        const infodoc = await informations.find({coin : 'XLMUSDT' }).exec((err, informations) => {
          res.send(informations) 
       });  
        });

        app.get("/doge", async (req, res) => {
          const coinlist = mongoose.models.coinlist || mongoose.model('coinlist', coinsSchema)
          const coindoc = await coinlist.find({coin : 'DOGEUSDT' }).sort({_id:-1}).exec((err, coinlist) => {
               res.send(coinlist) 
            });  
          });
    
          app.get("/otherdoge", async (req, res) => {
            const informations = mongoose.models.informations || mongoose.model('informations', infoSchema)
            const infodoc = await informations.find({coin : 'DOGEUSDT' }).exec((err, informations) => {
              res.send(informations) 
           });  
            });
            
                    app.get("/shib", async (req, res) => {
          const coinlist = mongoose.models.coinlist || mongoose.model('coinlist', coinsSchema)
          const coindoc = await coinlist.find({coin : 'SHIBUSDT' }).sort({_id:-1}).exec((err, coinlist) => {
               res.send(coinlist) 
            });  
          });
    
          app.get("/othershib", async (req, res) => {
            const informations = mongoose.models.informations || mongoose.model('informations', infoSchema)
            const infodoc = await informations.find({coin : 'SHIBUSDT' }).exec((err, informations) => {
              res.send(informations) 
           });  
            });
          
            //console.log(position_state_buy,Roc_Buy_position,sumTrueRange,Supertrande_stoploss_Buy,direction_Buy)
        
/*
console.log(chalk.white.bgRed.bold(`Name==============================${listOfUsdt[index]}=================================`))
console.log(`Your blance==== ${blance}`)
//console.log(found_history)
console.log('..................')
console.log(`old=${blance}`)
console.log(`new=${new_history},${last}`)
console.log(`fee=${fee}`)
console.log(chalk.white.bgBlue.bold(`net profit:${Net_Profit},%${Net_Profit/blance}`))
console.log(chalk.white.bgBlue.bold(`position state:${your_PS} (false:buy/true:sell)`))
console.log('..............')
console.log(`profit buy=====${total_profit_pos}`)
console.log(`profit buy=====${profit_state_pos}`)
console.log(`trade per buy=====${trade_percent_nev}`)
console.log(`EMA buy=====${EMA_Buy}`)
console.log('..............')
console.log(`profit sell=====${total_profit_nev}`)
console.log(`profit sell=====${profit_state_nev}`)
console.log(`trade per sell=====${trade_percent_pos}`)
console.log(`EMA sell=====${EMA_Sell}`)
console.log('..............')
console.log(`EMA=====${EMa_percent}`)
console.log(`EMA==result===${emaResult[985]}`)
console.log(`EMA==mints===${emamintprice}`)
console.log('.......EMA HISTORY.......')
console.log(chalk.white.bgGreen.bold(`EMA==1===${ema_history1}`))
console.log(chalk.white.bgGreen.bold(`EMA==2===${ema_history2}`))
console.log(`ema sell history=== ${ema_history_sell}`)
console.log(`ema buy history=== ${ema_history_buy}`)
console.log('----------------------------------------------------------------------------------------------------------')
*/



/*
if ( (20 >= CHOP <= 45)&& (ema200.result[800] <= clossingValues[999] )  ) {
    
    client.channels.cache.get('YOUR DISCORD CHANNEL ID').send(`${listOfUsdt[index]} is tranding up :green_circle: `)

}
*/




}


 






}
     






function run() {

setInterval(() => {
    tick()
},1000*60*15 );
}
try{
run()
}catch(err){
    console.log(err)
}
})


client.login('XXXXXXXXXXXXXXXXXXXXXXX YOUR DISCORD TOKEN XXXXXXXXXXXXXXXXXXXX');
app.listen(3520, function(){
    console.log('express server is running on port 3520');
}) 
//RSI 14 & EMA 8
