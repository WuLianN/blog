import { genMessage } from '../helper';
import locale from 'element-plus/dist/locale/zh-cn';

const modules = import.meta.glob('./zh-CN/**/*.ts', { eager: true });
export default {
  message: {
    ...genMessage(modules as Recordable<Recordable>, 'zh-CN'),
    locale,
  },
};
