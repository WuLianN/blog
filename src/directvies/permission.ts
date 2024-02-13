import type { App, Directive, DirectiveBinding } from 'vue';
import { getToken } from '@/utils/auth';

function isAuth(el: Element, _binding: any) {
  const token = getToken();

  if (!token) {
    el.parentNode?.removeChild(el);
  }
}

const mounted = (el: Element, binding: DirectiveBinding<any>) => {
  isAuth(el, binding);
};

const authDirective: Directive = {
  mounted,
};

export function setupPermissionDirective(app: App) {
  app.directive('auth', authDirective);
}

export default authDirective;
