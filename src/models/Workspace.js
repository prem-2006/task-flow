import mongoose from 'mongoose';

const WorkspaceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  layout: {
    type: Object,
    default: {
      sidebarOpen: true,
      theme: 'system',
    },
  },
}, { timestamps: true });

export default mongoose.models.Workspace || mongoose.model('Workspace', WorkspaceSchema);
