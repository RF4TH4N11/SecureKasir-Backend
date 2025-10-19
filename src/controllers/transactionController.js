import Transaction from "../models/Transaction.js";
import Product from "../models/Product.js";

/**
 * Get all transactions
 * Query params:
 * - sort: sort field (date, total, paymentMethod)
 * - order: asc or desc
 * - status: filter by status
 * - startDate: filter transactions from this date
 * - endDate: filter transactions until this date
 * - paymentMethod: filter by payment method
 */
export const getTransactions = async (req, res, next) => {
  try {
    const {
      sort = "createdAt",
      order = "desc",
      status,
      startDate,
      endDate,
      paymentMethod,
    } = req.query;

    // Build filter
    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    // Build sort
    let sortObj = {};
    sortObj[sort] = order === "desc" ? -1 : 1;

    const transactions = await Transaction.find(filter)
      .populate("items.productId", "name price")
      .sort(sortObj)
      .lean();

    res.json({
      success: true,
      data: transactions,
      count: transactions.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get transaction by ID
 */
export const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Invalid transaction ID format",
      });
    }

    const transaction = await Transaction.findById(id).populate(
      "items.productId",
      "name price category"
    );

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found",
      });
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new transaction
 */
export const createTransaction = async (req, res, next) => {
  try {
    const {
      items,
      subtotal,
      discount,
      total,
      paymentMethod,
      cashReceived,
      change,
      customerName,
      note,
    } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Items are required and must be an array",
      });
    }

    if (!paymentMethod || !["cash", "qris", "card"].includes(paymentMethod)) {
      return res.status(400).json({
        error:
          "Payment method is required and must be one of: cash, qris, card",
      });
    }

    // Validate required numeric fields
    if (subtotal === undefined || subtotal < 0) {
      return res.status(400).json({
        error: "Subtotal is required and must be non-negative",
      });
    }

    if (total === undefined || total < 0) {
      return res.status(400).json({
        error: "Total is required and must be non-negative",
      });
    }

    if (cashReceived === undefined || cashReceived < 0) {
      return res.status(400).json({
        error: "Cash received is required and must be non-negative",
      });
    }

    // Validate cash payment
    if (paymentMethod === "cash" && cashReceived < total) {
      return res.status(400).json({
        error: "Cash received must be at least equal to total",
      });
    }

    // Validate items
    const processedItems = [];
    for (const item of items) {
      // Check product exists
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          error: `Product with ID ${item.productId} not found`,
        });
      }

      const itemUnitType = item.unitType || product.unitType || "unit";

      // Validate based on unitType
      if (itemUnitType === "kg") {
        if (!item.weight || item.weight <= 0) {
          return res.status(400).json({
            error: "Each kg-based item must have weight > 0",
          });
        }
      } else {
        if (!item.quantity || item.quantity < 1) {
          return res.status(400).json({
            error: "Each unit-based item must have quantity >= 1",
          });
        }

        // Check stock for unit-based products
        if (product.stock < item.quantity) {
          return res.status(400).json({
            error: `Insufficient stock for product ${product.name}. Available: ${product.stock}`,
          });
        }
      }

      const pricePerUnit = item.pricePerUnit || item.price || product.price;
      const subtotal =
        itemUnitType === "kg"
          ? pricePerUnit * item.weight
          : pricePerUnit * item.quantity;

      // Add product details
      const processedItem = {
        productId: item.productId,
        name: product.name,
        price: item.price || product.price,
        pricePerUnit: pricePerUnit,
        unitType: itemUnitType,
        subtotal: subtotal,
      };

      if (itemUnitType === "kg") {
        processedItem.weight = item.weight;
      } else {
        processedItem.quantity = item.quantity;
        // Reduce stock for unit-based products
        product.stock -= item.quantity;
        await product.save();
      }

      processedItems.push(processedItem);
    }

    // Create transaction
    const transaction = new Transaction({
      items: processedItems,
      subtotal: parseFloat(subtotal),
      discount: discount ? parseFloat(discount) : 0,
      total: parseFloat(total),
      paymentMethod,
      cashReceived: parseFloat(cashReceived),
      change:
        parseFloat(change) ||
        (paymentMethod === "cash" ? cashReceived - total : 0),
      customerName: customerName || "Customer",
      note: note || "",
      status: "completed",
    });

    const savedTransaction = await transaction.save();

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: savedTransaction,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation error",
        details: messages,
      });
    }
    next(error);
  }
};

/**
 * Get transaction summary/report
 * Query params:
 * - startDate: from date
 * - endDate: to date
 * - paymentMethod: filter by payment method
 */
export const getTransactionSummary = async (req, res, next) => {
  try {
    const { startDate, endDate, paymentMethod } = req.query;

    // Build filter
    let filter = { status: "completed" };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    const transactions = await Transaction.find(filter).lean();

    // Calculate summary
    const summary = {
      totalTransactions: transactions.length,
      totalAmount: 0,
      totalDiscount: 0,
      totalItems: 0,
      byPaymentMethod: {
        cash: 0,
        qris: 0,
        card: 0,
      },
    };

    transactions.forEach((tx) => {
      summary.totalAmount += tx.total;
      summary.totalDiscount += tx.discount;
      summary.totalItems += tx.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      summary.byPaymentMethod[tx.paymentMethod] += tx.total;
    });

    res.json({
      success: true,
      data: summary,
      transactions: transactions.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete/Cancel transaction
 */
export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Invalid transaction ID format",
      });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found",
      });
    }

    // Mark as cancelled
    transaction.status = "cancelled";
    await transaction.save();

    // Restore product stock
    for (const item of transaction.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    res.json({
      success: true,
      message: "Transaction cancelled and stock restored",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get today's sales
 */
export const getTodaysSales = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const transactions = await Transaction.find({
      status: "completed",
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    }).lean();

    let totalSales = 0;
    let totalTransactions = 0;
    let totalDiscount = 0;

    transactions.forEach((tx) => {
      totalSales += tx.total;
      totalTransactions += 1;
      totalDiscount += tx.discount;
    });

    res.json({
      success: true,
      data: {
        date: today.toISOString().split("T")[0],
        totalSales,
        totalTransactions,
        totalDiscount,
        averageTransaction:
          totalTransactions > 0 ? totalSales / totalTransactions : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get transaction by receipt number
 */
export const getTransactionByReceiptNumber = async (req, res, next) => {
  try {
    const { receiptNumber } = req.params;

    const transaction = await Transaction.findOne({ receiptNumber }).populate(
      "items.productId",
      "name price category"
    );

    if (!transaction) {
      return res.status(404).json({
        error: "Transaction not found",
      });
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};
