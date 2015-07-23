import AuthenticatedRouteMixin from 'torii/routing/authenticated-route-mixin';

module('Authenticated Route Mixin - Unit');

test("beforeModel calls authenicate after _super#beforeModel", function(assert){
  var route;
  var callOrder = [];
  route = Ember.Route
    .extend({
      beforeModel: function() {
        callOrder.push('super');
      }
    })
    .extend(AuthenticatedRouteMixin, {
      authenticate: function() {
        callOrder.push('mixin');
      }
    }).create();

  route.beforeModel();

  assert.deepEqual(callOrder, ['super', 'mixin'],
    'super#beforeModel is called before authenicate');
});

test("route respects beforeModel super priority when promise is returned", function(assert){
  var route;
  var callOrder = [];
  route = Ember.Route
    .extend({
      beforeModel: function() {
        return new Ember.RSVP.Promise(function(resolve){
          Ember.run.later(function(){
            callOrder.push('super');
            resolve();
          }, 20);
        })
      }
    })
    .extend(AuthenticatedRouteMixin, {
      authenticate: function() {
        callOrder.push('mixin');
      }
    }).create();

  return route.beforeModel()
    .then(function(){
      assert.deepEqual(callOrder, ['super', 'mixin'],
        'super#beforeModel is called before authenticate');
    });
});
