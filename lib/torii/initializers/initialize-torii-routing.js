import Ember from 'ember';
import configuration from 'torii/configuration';
import ToriiAuthenticatedRouteMixin from 'torii/routing/authenticated-route-mixin';

export default {
  name: 'torii-routing',
  initialize: function(){
    if (configuration.sessionServiceName) {
      Ember.Route.reopen(ToriiAuthenticatedRouteMixin);
    }
  }
};
