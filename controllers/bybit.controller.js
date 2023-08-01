import { createExchange } from "@compendiumfi/pendax/exchanges/exchange.js";

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

async function getbalance(exchange, options) {
    try {
        let result = await exchange.getWalletBalance(options);
        let usdtBalance = result.data.list[0].coin[0].walletBalance;
        let usdtBalanceparsed = parseFloat(usdtBalance);
        return usdtBalanceparsed
    } catch (error) {
        console.log(error.message);
    }
}
async function getTickers(exchange, options) {
    try {
        let result = await exchange.getTickers(options);
        let price = result.data.list[0].lastPrice;
        return parseFloat(price);
    } catch (error) {
        console.log(error.message);
    }
}
async function getPositionInfo(exchange, options) {
    try {
        let result = await exchange.getPositionInfo(options);
        console.log(result);
        let openSize = result.data.list[0].size;
        return parseFloat(openSize)
    } catch (error) {
        console.log(error.message);
    }
}

async function getInstrumentsInfo(exchange, options) {
    try {
        let result = await exchange.getInstrumentsInfo(options);
        console.log(result);
        let precision = result.data.list[0].lotSizeFilter.minOrderQty;
        return precision;
    } catch (error) {
        console.log(error.message);
    }
}

async function calcQty(equity, precision, balance, ticker) {
    let decimals = Math.log10(1 / precision)
    let maxAmt = equity * balance
    let amt = (maxAmt / ticker).toFixed(decimals)
    let trial = amt * ticker
    let result = trial > maxAmt ? amt - (1 / Math.pow(10, decimals)) : amt
    return result
}




const test = async (req, res) => {
    console.log('passed');
    res.json({
        status: 'passed'
    })
}
const testPost = async (req, res) => {
    console.log('sent from tradingview');
    res.json({
        status: 'passed'
    })
}

const getApiInfo = async (req, res) => {
    try {
        let keyInfo = await getApiKeyInfo(bybit_exchange);
        res.json(keyInfo)
    } catch (error) {
        res.json(error);
        console.log(error);
    }
}

const placeTrade = async (req, res) => {
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

const tradeByEquity = async (req, res) => {
    try {
        let precision = await getInstrumentsInfo(bybit_exchange,
            {
                category: 'linear',
                symbol: req.body.symbol
            });
        let balance;
        let equity = req.body.equity;
        let trade;
        let qty;
        let amount;
        let assetPrice;
        let currentPosition;
        let symbol = req.body.symbol;
        const type = req.body.type;
        switch (type) {
            case "long":
                balance = await getbalance(bybit_exchange,
                    {
                        accountType: "UNIFIED",
                        coin: "USDT"
                    });
                console.log("long")
                console.log(balance)
                assetPrice = await getTickers(bybit_exchange,
                    {
                        category: 'linear',
                        symbol: symbol
                    });
                console.log(assetPrice);
                amount = (balance * equity) / assetPrice;
                qty = await calcQty(equity, precision, balance, assetPrice);
                trade = await placeOrder(bybit_exchange, {
                    category: "linear",
                    symbol: req.body.symbol,
                    side: "Buy",
                    orderType: req.body.orderType,
                    qty: qty.toString()
                });
                console.log(trade);
                break;
            case "short":
                balance = await getbalance(bybit_exchange,
                    {
                        accountType: "UNIFIED",
                        coin: "USDT"
                    });
                console.log("long")
                console.log(balance)
                assetPrice = await getTickers(bybit_exchange,
                    {
                        category: 'linear',
                        symbol: symbol
                    });
                console.log(assetPrice);
                amount = (balance * equity) / assetPrice;
                qty = await calcQty(equity, precision, balance, assetPrice);
                trade = await placeOrder(bybit_exchange, {
                    category: "linear",
                    symbol: req.body.symbol,
                    side: "Sell",
                    orderType: req.body.orderType,
                    qty: qty.toString()
                });
                console.log(trade);
                break;
            case "close long":
                currentPosition = await getPositionInfo(bybit_exchange, {
                    category: 'linear',
                    symbol: req.body.symbol
                });
                amount = currentPosition * equity;
                qty = amount.toFixed(Math.log10(1 / precision))
                console.log("close long")
                trade = await placeOrder(bybit_exchange, {
                    category: "linear",
                    symbol: req.body.symbol,
                    side: "Sell",
                    orderType: req.body.orderType,
                    qty: qty.toString()
                });
                console.log(trade);
                break;
            case "close short":
                currentPosition = await getPositionInfo(bybit_exchange, {
                    category: 'linear',
                    symbol: req.body.symbol
                });
                amount = currentPosition * equity;
                qty = amount.toFixed(Math.log10(1 / precision))
                console.log("close short")
                trade = await placeOrder(bybit_exchange, {
                    category: "linear",
                    symbol: req.body.symbol,
                    side: "Buy",
                    orderType: req.body.orderType,
                    qty: qty.toString()
                });
                console.log(trade);
                break;
            default:
                console.log("error")
                break;
        }

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
export { test, getApiInfo, placeTrade, testPost, tradeByEquity }