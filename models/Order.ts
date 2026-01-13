import mongoose, { Schema, Model } from 'mongoose';
import { generateOrderNumber } from '@/lib/utils';

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        color: String,
        size: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentScreenshot: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'payment_verified', 'shipped', 'delivered'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate order number before saving
orderSchema.pre('save', function (this: any) {
  if (!this.orderNumber) {
    this.orderNumber = generateOrderNumber();
  }
});

// Indexes for performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order: Model<any> =
  mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
