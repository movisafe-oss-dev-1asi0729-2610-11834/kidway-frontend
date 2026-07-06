import { SchoolRouteEntity } from '../entities/school-route.entity';
import { RouteActivityModel } from './route-activity.model';
import { RouteReviewModel } from './route-review.model';
import { RouteSummaryModel } from './route-summary.model';

export interface RouteDashboardModel {
  summary: RouteSummaryModel;
  routes: SchoolRouteEntity[];
  reviews: RouteReviewModel[];
  activities: RouteActivityModel[];
}
