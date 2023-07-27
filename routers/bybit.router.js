import router from "express";
const bybitRouter = router();
import { test, getApiInfo, placeTrade } from "../controllers/bybit.controller.js";

bybitRouter.get("/test", test);
bybitRouter.get("/getApiInfo", getApiInfo);
bybitRouter.post("/placeTrade", placeTrade);

export { bybitRouter, test, getApiInfo, placeTrade }