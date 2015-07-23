import configuration from 'torii/configuration';
import bootstrapRouting from 'torii/bootstrap/routing';
import {
  getAuthenticatedRoutes,
  resetAuthenticatedRoutes
} from 'torii/routing';

export default {
  name: 'torii-setup-routes',
  initialize: function(appInstance){
    if (configuration.sessionServiceName) {

      var setupRoutes = function(){
        var authenticatedRoutes = getAuthenticatedRoutes();
        var hasAuthenticatedRoutes = !Ember.isEmpty(authenticatedRoutes);
        if (hasAuthenticatedRoutes) {
          bootstrapRouting(appInstance.container, authenticatedRoutes);
        }
        resetAuthenticatedRoutes();
        router.off('willTransition', setupRoutes);
      };

      var router = appInstance.get('router');
      router.on('willTransition', setupRoutes);
    }
  }
};
