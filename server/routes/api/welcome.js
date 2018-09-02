import { Router } from 'express';

const welcomeRoute = Router();

welcomeRoute.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Thor\'s API version for Authors Haven'
  });
});

export default welcomeRoute;
