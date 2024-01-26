import { genMessage } from '../helper';
import locale from 'element-plus/dist/locale/en';

const modules = import.meta.glob('./en/**/*.ts', { eager: true });
export default {
  message: {
    ...genMessage(modules as Recordable<Recordable>, 'en'),
    locale,
  },
  dateLocale: null,
  dateLocaleName: 'en',
};
