import {
  getAuthenticatedRoutes
} from 'torii/routing';
import afterSuper from 'torii/lib/after-super';
import configuration from 'torii/configuration';

var isEmpty = Ember.isEmpty;

export default Ember.Mixin.create({
  beforeModel: function (transition) {
    return afterSuper(this.authenticate, arguments, this);
  },
  authenticate: function (transition) {
    var isAuthenticated = this.get('session.isAuthenticated');
    if (isAuthenticated === undefined) {
      this.session.attemptedTransition = transition;
      return this.session.fetchDefaultProvider()
        .catch(function() {
          return this.accessDenied();
        });
    } else if (isAuthenticated) {
      // no-op; cause the user is already authenticated
      return Ember.RSVP.resolve();
    } else {
      return this.accessDenied();
    }
  },
  accessDenied: function () {
    this.send('accessDenied');
  }
});
