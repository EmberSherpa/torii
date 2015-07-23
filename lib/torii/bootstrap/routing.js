import ApplicationRouteMixin from 'torii/routing/application-route-mixin';
import AuthenticatedRouteMixin from 'torii/routing/authenticated-route-mixin';

export default function(container, authenticatedRoutes){

  var ApplicationRoute = container.lookup('route:application');
  ApplicationRoute.reopen(ApplicationRouteMixin);

  for (var i = 0; i < authenticatedRoutes.length; i++) {
    var routeName = authenticatedRoutes[i];
    var factoryName = 'route:' + routeName;
    var routeClass = container.lookup(factoryName);
    routeClass.reopen(AuthenticatedRouteMixin);
  }

  return container;
}
