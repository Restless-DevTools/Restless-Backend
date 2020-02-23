import Console from 'console';
import models from './models';
import app from './index';

const PORT = process.env.EXPRESS_PORT || 3016;
models.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    Console.log(`App is running on port ${PORT}`);
  });
});
