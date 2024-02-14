import type { App, Directive, DirectiveBinding } from 'vue';
import type { UserInfo } from '@/api/model/userModel'

function isAuthor(el: HTMLElement, binding: DirectiveBinding<any>) {
  const localUserInfo = localStorage.getItem('userInfo');
  const userInfo: UserInfo | null = localUserInfo ? JSON.parse(localUserInfo) : null;

  if (userInfo?.id !== binding.value) {
    el.style.display = 'none';
  } else {
    el.style.display = 'block';
  }
}

const mounted = (el: HTMLElement, binding: DirectiveBinding<any>) => {
  isAuthor(el, binding);
};

const updated = (el: HTMLElement, binding: DirectiveBinding<any>) => {
  isAuthor(el, binding);
};

const authorDirective: Directive = {
  mounted,
  updated,
};

export function setupPermissionDirective(app: App) {
  app.directive('is-author', authorDirective);
}

export default authorDirective;
