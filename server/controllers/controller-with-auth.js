class ControllerWithAuth {
  isAuthorized(req, res) {
    console.log(req.cookies);
  }

  notAuth(req, res) {
    res.status(403).send('Permission denied');
  }
}
export default ControllerWithAuth;
