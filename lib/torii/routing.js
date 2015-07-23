var authenticatedRoutes = [];

export default function authenticatedRoute(dsl, name) {
  var args = [].slice.call(arguments, 2);
  args.unshift(name);
  dsl.route.apply(dsl, args);
  addAuthenticatedRoute(name);
}

export function resetAuthenticatedRoutes() {
  authenticatedRoutes = [];
}

export function addAuthenticatedRoute(name) {
  authenticatedRoutes.push(name);
}

export function getAuthenticatedRoutes() {
  return authenticatedRoutes;
}
