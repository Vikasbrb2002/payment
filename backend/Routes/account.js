// backend/routes/account.js
const express = require('express');
const zod = require('zod') ; 
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');

const AccountRouter = express.Router();

AccountRouter.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
});

const transferSchema = zod.object({
    to: zod.string(),
    amount: zod.string() 
  });
  
  AccountRouter.post("/transfer", authMiddleware, async (req, res) => {
      const session = await mongoose.startSession();
  
      const ValidData = transferSchema.safeParse(req.body); 
  
      if (!ValidData.success) {
          return res.status(400).json({
              message: "Invalid data"
          });
      }
  
      session.startTransaction();
      const { amount, to } = req.body;
  
      // Fetch the accounts within the transaction
      const account = await Account.findOne({ userId: req.userId }).session(session);
  
      if (!account || account.balance < amount) {
          await session.abortTransaction();
          return res.status(400).json({
              message: "Insufficient balance"
          });
      }
  
      const toAccount = await Account.findOne({ userId: to }).session(session);
  
      if (!toAccount) {
          await session.abortTransaction();
          return res.status(400).json({
              message: "Invalid account"
          });
      }
  
      // Perform the transfer
      await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
      await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
  
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
  
      // Fetch the updated balance
      const updatedAccount = await Account.findOne({ userId: req.userId });
  
      res.json({
          message: "Transfer successful",
          balance: updatedAccount.balance
      });
  });

module.exports = AccountRouter;