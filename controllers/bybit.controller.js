import {createExchange} from "@compendiumfi/pendax/exchanges/exchange.js";

let bybit_exchange = createExchange({
    exchange: "bybit",
    authenticate: true,
    key: process.env.API_KEY,
    secret: process.env.API_SECRET,
    label: "bybit"
  });

  async function getApiKeyInfo(exchange) {
    try {
        let result = await exchange.getApiKeyInfo();
        return result;
        //console.log(result);
    } catch (error) {
        console.log(error.message);
    }
}
async function placeOrder(exchange, options) {
    try {
        let result = await exchange.placeOrder(options);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error.message);
    }
}

const test = async (req, res) => {
    console.log('passed');
    res.json({
        status: 'passed'
    })
}

const getApiInfo = async (req,res) => {
    try {
        let keyInfo = await getApiKeyInfo(bybit_exchange);
        res.json(keyInfo)
    } catch(error) {
        res.json(error);
        console.log(error);
    }
}

const placeTrade = async(req,res) => {
    try {
const trade = await placeOrder(bybit_exchange, {
    category: req.body.category,
    symbol: req.body.symbol,
    side: req.body.side,
    orderType: req.body.orderType,
    qty: req.body.qty
})
console.log(trade);
res.json(trade);
    } catch (error) {
        console.log(error);
        res.json(error)
    }
}
// const result = await placeOrder(bybit_exchange, 
//     {
//        category: 'linear',
//        symbol: 'BTCUSDT',
//        side: 'Buy',
//        orderType: 'Market',
//        qty: '10'
//      });
export {test, getApiInfo, placeTrade}