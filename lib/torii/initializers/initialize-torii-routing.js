import Ember from 'ember';
import ToriiAuthenticatedRouteMixin from 'torii/routing/authenticated-route-mixin';

export default {
  name: 'torii-routing',
  initialize: function(){
    Ember.Route.reopen(ToriiAuthenticatedRouteMixin);
  }
};
