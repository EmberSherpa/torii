import Ember from 'ember';
import {
  authenticatedRoutes
} from 'torii/routing';
import configuration from 'torii/configuration';

let isEmpty = Ember.isEmpty;

export default Ember.Mixin.create({
  beforeModel(transition) {
    let routeName = this.get('routeName');
    let shouldCheckLogin = !isEmpty(authenticatedRoutes) && routeName === 'application';
    if (authenticatedRoutes.contains(routeName)) {
      return this.authenticateRoute(transition);
    } else if (shouldCheckLogin) {
      return this.checkLogin();
    }
  },
  authenticateRoute: function (transition) {
    var isAuthenticated = this.get('session.isAuthenticated');
    if (isAuthenticated === undefined) {
      this.session.attemptedTransition = transition;
      return this.fetchSession().catch(() => {
        return this.accessDenied();
      });
    } else if (isAuthenticated) {
      // no-op; cause the user is already authenticated
      return Ember.RSVP.resolve();
    } else {
      return this.accessDenied();
    }
  },
  checkLogin: function() {
    return this.fetchSession().catch(function(){
      // no-op, cause no session is ok
    })
  },
  accessDenied: function() {
    return this.transitionTo('login');
  },
  fetchSession: function() {
    return this.session.fetch(configuration.sessionProvider);
  }
});
