export default Ember.Mixin.create({
  beforeModel: function (transition) {
    var route = this;
    var superBefore = this._super.apply(this, arguments);
    if (superBefore && superBefore.then) {
      return superBefore.then(function() {
        return route.authenticate();
      });
    } else {
      return route.authenticate();
    }
  },
  authenticate: function (transition) {
    var route = this;
    var isAuthenticated = this.get('session.isAuthenticated');
    if (isAuthenticated === undefined) {
      this.session.attemptedTransition = transition;
      return this.session.fetchDefaultProvider()
        .catch(function() {
          return route.accessDenied();
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
