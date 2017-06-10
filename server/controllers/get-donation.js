const mongoose = require('mongoose');

class GetDonationController {
  handle(req, res, socket) {
    const body = req.body;
    const label = body.label;
    const amount = body.amount;
    if (label) {
      socket.emit('donation alert', { sum: amount, username: '@test', message: label });
    }
    res.send('OK');
  }
}

module.exports = GetDonationController;
