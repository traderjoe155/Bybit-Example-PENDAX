import router from "express";
const bybitRouter = router();
import { test, getApiInfo, placeTrade, testPost, tradeByEquity } from "../controllers/bybit.controller.js";

bybitRouter.get("/test", test);
bybitRouter.get("/getApiInfo", getApiInfo);
bybitRouter.post("/placeTrade", placeTrade);
bybitRouter.post("/testPost", testPost);
bybitRouter.post("/tradeByEquity", tradeByEquity);

export { bybitRouter, test, getApiInfo, placeTrade, testPost, tradeByEquity }