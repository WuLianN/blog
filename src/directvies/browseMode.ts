import type { App, Directive, DirectiveBinding } from 'vue';
import { getUserId } from '@/utils/auth';

function isBrowseMode(el: Element, _binding: any) {
  const userId = getUserId();

  if (userId) {
    el.parentNode?.removeChild(el);
  }
}

const mounted = (el: Element, binding: DirectiveBinding<any>) => {
  isBrowseMode(el, binding);
};

const browseModeDirective: Directive = {
  mounted,
};

export function setupBrowseModeDirective(app: App) {
  app.directive('isBrower', browseModeDirective);
}

export default browseModeDirective;
