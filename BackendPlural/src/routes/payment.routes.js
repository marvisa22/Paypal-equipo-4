import {Router} from "express";
import {
    cancelPayment,
    captureOrder,
    createOrder,
    createOrder2
} from '../controllers/payment.controller.js';

const router = Router();

router.post("/create-order", createOrder);
router.get("/capture-order", captureOrder );
router.get("/cancel-payment", cancelPayment);
router.post("/create-order2", createOrder2)


export default router;