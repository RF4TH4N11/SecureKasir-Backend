import express from "express";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  deleteTransaction,
  getTransactionSummary,
  getTodaysSales,
  getTransactionByReceiptNumber,
} from "../controllers/transactionController.js";

const router = express.Router();

// Get today's sales
router.get("/sales/today", getTodaysSales);

// Get transaction summary/report
router.get("/summary/report", getTransactionSummary);

// Get all transactions
router.get("/", getTransactions);

// Get transaction by receipt number
router.get("/receipt/:receiptNumber", getTransactionByReceiptNumber);

// Get single transaction
router.get("/:id", getTransactionById);

// Create transaction
router.post("/", createTransaction);

// Delete/Cancel transaction
router.delete("/:id", deleteTransaction);

export default router;
