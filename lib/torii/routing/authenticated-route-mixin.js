import {
  authenticatedRoutes
} from 'torii/routing';
import configuration from 'torii/configuration';

var isEmpty = Ember.isEmpty;

export default Ember.Mixin.create({
  beforeModel: function (transition) {
    var route = this;
    var superBefore = this._super.apply(this, arguments);
    var authBeforeFilter = function() {
      var routeName = route.get('routeName');
      var shouldCheckLogin = !isEmpty(authenticatedRoutes) && routeName === 'application';
      if (authenticatedRoutes.indexOf(routeName) !== -1) {
        return route.authenticateRoute(transition);
      } else if (shouldCheckLogin) {
        return route.checkLogin();
      }
    };
    if (superBefore && superBefore.then) {
      return superBefore.then(function() {
        return authBeforeFilter();
      });
    } else {
      return authBeforeFilter();
    }
  },
  authenticateRoute: function (transition) {
    var isAuthenticated = this.get('session.isAuthenticated');
    if (isAuthenticated === undefined) {
      this.session.attemptedTransition = transition;
      return this.fetchSession().catch(function() {
        return this.accessDenied();
      });
    } else if (isAuthenticated) {
      // no-op; cause the user is already authenticated
      return Ember.RSVP.resolve();
    } else {
      return this.accessDenied();
    }
  },
  checkLogin: function () {
    return this.fetchSession().catch(function(){
      // no-op, cause no session is ok
    });
  },
  accessDenied: function () {
    this.send('accessDenied');
  },
  fetchSession: function () {
    return this.session.fetch(configuration.sessionProvider);
  }
});
