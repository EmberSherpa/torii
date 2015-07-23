import afterSuper from 'torii/lib/after-super';

export default Ember.Mixin.create({
  beforeModel: function(transition) {
    return afterSuper(this.checkLogin, arguments, this);
  },
  checkLogin: function () {
    return this.session.fetchDefaultProvider()
      .catch(function(){
        // no-op, cause no session is ok
      });
  }
});
