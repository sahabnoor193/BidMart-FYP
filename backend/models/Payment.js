const PaymentSchema = new mongoose.Schema({
    bidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid', required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
  });