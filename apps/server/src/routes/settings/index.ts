import type { FastifyInstance } from "fastify";

import { get } from "./get";
import { getBanners } from "./get-banners-admin";
import { addBanner } from "./add-banner-admin";
import { deleteBanner } from "./delete-banner-admin";
import { getNews } from "./get-news-admin";
import { addNews } from "./add-news-admin";
import { deleteNews } from "./delete-news-admin";
import { getPopup } from "./get-popup-admin";
import { updatePopupImage } from "./update-popup-image-admin";
import { updatePopupStatus } from "./update-popup-status-admin";

export function settingsRouter(app: FastifyInstance) {
  get(app);

  getBanners(app);
  addBanner(app);
  deleteBanner(app);
  getNews(app);
  addNews(app);
  deleteNews(app);
  getPopup(app);
  updatePopupImage(app);
  updatePopupStatus(app);
}
