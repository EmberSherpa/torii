import AuthenticatedRouteMixin from 'torii/routing/authenticated-route-mixin';

module('Authenticated Route Mixin - Unit');

test("route respects beforeModel super priority", function(assert){

  var route;
  var callOrder = [];
  route = Ember.Route
    .extend({
      beforeModel: function() {
        callOrder.push('super');
      }
    })
    .extend(AuthenticatedRouteMixin, {
      checkAuth: function() {
        callOrder.push('mixin');
      }
    }).create();

  route.beforeModel();

  assert.deepEqual(callOrder, ['super', 'mixin'],
    'super#beforeModel is called mixin#beforeModel');

  callOrder = [];
  route = Ember.Route
    .extend({
      beforeModel: function() {
        return new Ember.RSVP.Promise(function(resolve){
          Ember.run.later(function(){
            callOrder.push('super');
            resolve();
          }, 1);
        })
      }
    })
    .extend(AuthenticatedRouteMixin, {
      checkAuth: function() {
        callOrder.push('mixin');
      }
    }).create();

    return route.beforeModel().then(function(){
      assert.deepEqual(callOrder, ['super', 'mixin'],
        'super#beforeModel is called mixin#beforeModel when returning a promise');
    });
});
