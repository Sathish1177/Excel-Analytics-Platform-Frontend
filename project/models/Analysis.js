import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  chartType: {
    type: String,
    enum: ['2d', '3d'],
    required: true
  },
  selectedAxes: {
    x: String,
    y: String,
    z: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Analysis = mongoose.model('Analysis', analysisSchema);
export default Analysis;