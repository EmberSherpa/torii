import AuthenticatedRouteMixin from 'torii/routing/authenticated-route-mixin';
import configuration from 'torii/configuration';

import {
  addAuthenticatedRoute,
  resetAuthenticatedRoutes,
  getAuthenticatedRoutes
} from 'torii/routing';

var originalSessionServiceName, originalSessionProvider;

module('Authenticated Route Mixin - Unit', {
  setup: function(){
    originalSessionServiceName = configuration.sessionServiceName;
    delete configuration.sessionServiceName;
    originalSessionProvider = configuration.sessionProvider;
    delete configuration.sessionProvider;
    resetAuthenticatedRoutes();
  },
  teardown: function(){
    configuration.sessionServiceName = originalSessionServiceName;
    configuration.sessionProvider = originalSessionProvider;
  }
});

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
      checkAuth: function() {
        callOrder.push('mixin');
      }
    }).create();

  return route.beforeModel()
    .then(function(){
      assert.deepEqual(callOrder, ['super', 'mixin'],
        'super#beforeModel is called before mixin#beforeModel');
    });
})

test('application route checks login when authenticatedRoutes present', function(assert){
  addAuthenticatedRoute('index');
  var checked = false;
  var route = Ember.Route.extend(AuthenticatedRouteMixin, {
    checkLogin: function() {
      checked = true;
    }
  }).create({
    routeName: 'application'
  });

  route.beforeModel();
  assert.ok(checked, "Checked was called")
});
