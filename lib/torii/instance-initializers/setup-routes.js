import configuration from 'torii/configuration';
import bootstrapRouting from 'torii/bootstrap/routing';
import "torii/router-dsl-ext";

export default {
  name: 'torii-setup-routes',
  initialize: function(appInstance){
    if (configuration.sessionServiceName) {
      var router = appInstance.get('router');
      var setupRoutes = function(){
        var authenticatedRoutes = router.router.authenticatedRoutes;
        var hasAuthenticatedRoutes = !Ember.isEmpty(authenticatedRoutes);
        if (hasAuthenticatedRoutes) {
          bootstrapRouting(appInstance.container, authenticatedRoutes);
        }
        router.off('willTransition', setupRoutes);
      };
      router.on('willTransition', setupRoutes);
    }
  }
};
