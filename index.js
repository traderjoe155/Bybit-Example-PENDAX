import 'dotenv/config'
import express from "express";
import { bybitRouter } from './routers/bybit.router.js';


const app = express();
app.use(express.json());
app.use("/bybit", bybitRouter)

app.listen(8000, () => {
    console.log("Server running on port 8000");
   });



//const result = await getApiKeyInfo(bybit_exchange);
