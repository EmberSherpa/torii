import Ember from 'ember';

export let authenticatedRoutes = [];

export default function authenticatedRoute(dsl, name) {
  var args = [].slice.call(arguments, 2);
  args.unshift(name);

  dsl.route.apply(dsl, args);

  authenticatedRoutes.push(name);
}
