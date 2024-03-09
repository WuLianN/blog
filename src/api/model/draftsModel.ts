import { Tag } from './tagsModel'

export interface Draft {
  title?: string;
  content?: string;
  id: number;
  create_time: Date;
  update_time: Date;
  tags: Tag[] | null;
  user_id: number;
  is_delete: number;
  is_publish: number;
  bg_image?: string | null;
}

export interface RecommendDraft extends Draft {
  excerpt?: string; // 添加摘要字段到推荐草稿列表接口
  bgImage?: string | null;
}