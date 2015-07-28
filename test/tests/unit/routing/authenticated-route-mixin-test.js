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

test('previously successful authentication results in successful resolution', function(assert){
  assert.expect(1);
  var route = createAuthenticatedRoute({
    session: {
      isAuthenticated: true
    }
  });

  return route.authenticate()
    .then(function(){
      assert.ok(true);
    })
});

test('attempting authentication calls fetchDefaultProvider', function(assert){
  assert.expect(1);
  var fetchDefaultProviderCalled = false;
  var route = createAuthenticatedRoute({
    session: {
      isAuthenticated: undefined,
      fetchDefaultProvider: function(){
        fetchDefaultProviderCalled = true;
        return Ember.RSVP.resolve();
      }
    }
  });
  return route.authenticate()
    .then(function(){
      assert.ok(fetchDefaultProviderCalled, 'fetch default provider was called');
    });
});

test('failed authentication calls accessDenied', function(assert){
  assert.expect(2);
  var fetchDefaultProviderCalled = false;
  var accessDeniedCalled = false;
  var route = createAuthenticatedRoute({
    session: {
      isAuthenticated: undefined,
      fetchDefaultProvider: function(){
        fetchDefaultProviderCalled = true;
        return Ember.RSVP.reject();
      }
    },
    accessDenied: function() {
      accessDeniedCalled = true;
    }
  });
  return route.authenticate()
    .then(function(){
      assert.ok(fetchDefaultProviderCalled, 'fetch default provider was called');
      assert.ok(accessDeniedCalled, 'accessDenied was called');
    });
});

test('failed authentication causes accessDenied action to be sent', function(assert){
  assert.expect(2);
  var fetchDefaultProviderCalled = false;
  var sentActionName;
  var route = createAuthenticatedRoute({
    session: {
      isAuthenticated: undefined,
      fetchDefaultProvider: function(){
        fetchDefaultProviderCalled = true;
        return Ember.RSVP.reject();
      }
    },
    send: function(actionName) {
      sentActionName = actionName;
    }
  });
  return route.authenticate()
    .then(function(){
      assert.ok(fetchDefaultProviderCalled, 'fetch default provider was called');
      assert.equal(sentActionName, 'accessDenied', 'accessDenied action was sent');
    });
});

function createAuthenticatedRoute(attrs) {
  return Ember.Router.extend(AuthenticatedRouteMixin, attrs).create()
}
