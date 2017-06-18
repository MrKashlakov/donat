import mongoose from 'mongoose';
import DonationSchema from '../models/donation';

const donation = (req, res, socket) => {
  const body = req.body;
  const label = body.label;
  const amount = body.amount;
  if (label) {
    mongoose.connect('mongodb://localhost/donat');
    const Donation = mongoose.model('Donation', DonationSchema);
    Donation.find({ id: label }, (err, donation) => {
      if (err) {
        throw err;
      }
      if (donation === null) {
        return;
      }
      socket.emit('donation alert', { sum: amount, username: donation.username, message: donation.message });
    });
  }
  res.send('OK');
}

export default donation;
