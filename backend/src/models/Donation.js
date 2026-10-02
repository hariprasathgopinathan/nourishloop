const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor ID is required'],
    },
    foodName: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    pickupAddress: {
      type: String,
      required: [true, 'Pickup address is required'],
    },
    pincode: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    availableUntil: {
      type: Date,
      required: [true, 'Available until date is required'],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: [
          'AVAILABLE',
          'CLAIMED',
          'READY_FOR_PICKUP',
          'PICKED_UP',
          'EXPIRED',
          'CANCELLED',
        ],
        message:
          'Status must be one of: AVAILABLE, CLAIMED, READY_FOR_PICKUP, PICKED_UP, EXPIRED, CANCELLED',
      },
      default: 'AVAILABLE',
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    claimedAt: {
      type: Date,
    },
    pickedUpAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
