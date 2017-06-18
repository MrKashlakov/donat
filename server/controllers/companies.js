import ControllerWithAuth from './controller-with-auth';
import mongoose from 'mongoose';

class CompnaiesController extends ControllerWithAuth{
  handle(req, res) {
    console.log('!!!!!')
    if (!this.isAuthorized(req, res)) {
      this.notAuth(req, res);
    }

  }
}


export default CompnaiesController;
