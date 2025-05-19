
import { generalTranslations } from './general';
import authTranslations from './auth';
import dashboardTranslations from './dashboard';
import profileTranslations from './profile';
import testsTranslations from './tests';
import aboutTranslations from './about';
import sessionTranslations from './session';

// Combine all translation categories
const enTranslations = {
  ...generalTranslations,
  ...authTranslations,
  ...dashboardTranslations,
  ...profileTranslations,
  ...testsTranslations,
  ...aboutTranslations,
  ...sessionTranslations,
};

export default enTranslations;
