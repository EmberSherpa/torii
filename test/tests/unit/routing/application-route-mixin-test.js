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

test('checkLogic fails silently when no session is available', function(assert){
  assert.expect(2);

  var fetchDefaultProviderCalled = false;
  var route = Ember.Route.extend(ApplicationRouteMixin, {
    session: {
      fetchDefaultProvider: function() {
        fetchDefaultProviderCalled = true;
        return Ember.RSVP.reject('no session is available');
      }
    }
  }).create();

  route.checkLogin()
    .then(function(){
      assert.ok(fetchDefaultProviderCalled, 'fetch default provider was called');
      assert.ok('successful callback inspite of rejection');
    })
})
