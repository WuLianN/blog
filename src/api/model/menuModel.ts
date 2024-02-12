import { Tag } from './tagsModel'

interface Meta {
  id: number
  icon: string
}

export interface MenuItem {
  id: number;
  path: string;
  component: any;
  meta: Meta;
  parent_id: number
  name: string;
  redirect?: string;
  children?: MenuItem[];
  label?: string;
  tags?: Tag[] | null;
}

/**
 * @description: Get menu return value
 */
export type MenuListResultModel = MenuItem[];
