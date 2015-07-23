import ApplicationRouteMixin from 'torii/routing/application-route-mixin';

module('Application Route Mixin - Unit');

test("beforeModel calls checkLogin after _super#beforeModel", function(assert){
  var route;
  var callOrder = [];
  route = Ember.Route
    .extend({
      beforeModel: function() {
        callOrder.push('super');
      }
    })
    .extend(ApplicationRouteMixin, {
      checkLogin: function() {
        callOrder.push('mixin');
      }
    }).create();

  route.beforeModel();

  assert.deepEqual(callOrder, ['super', 'mixin'],
    'super#beforeModel is called mixin#beforeModel');
});

test("beforeModel calls checkLogin after promise from _super#beforeModel is resolved", function(assert){
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
    .extend(ApplicationRouteMixin, {
      checkLogin: function() {
        callOrder.push('mixin');
      }
    }).create();

  return route.beforeModel()
    .then(function(){
      assert.deepEqual(callOrder, ['super', 'mixin'],
        'super#beforeModel is called before mixin#beforeModel');
    });
});
