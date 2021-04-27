import AuthService from '../services/AuthService';

export default new class UserController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res) {
    const loginState = await this.authService.login(req.body);
    if (!loginState.token) {
      res.status(401);
    }
    return res.send(loginState);
  }

  async githubLogin(req, res) {
    const loginState = await this.authService.githubLogin(req.body);
    return res.send(loginState);
  }

  async validateToken(req, res) {
    const validateResult = this.authService.validateToken(req.body.token);
    if (validateResult && !validateResult.message) {
      return res.send(validateResult);
    }
    res.status(401);
    return res.send({ message: 'Token are not valid', status: false });
  }

  async requestRecoverPassword(req, res) {
    const requestedRecoverPassword = await this.authService.requestRecoverPassword(req.body);
    return res.send(requestedRecoverPassword);
  }

  async recoverPassword(req, res) {
    const recoveredPassword = await this.authService.recoverPassword(req.body);
    return res.send(recoveredPassword);
  }
}();
