export default function afterSuper(callback, args, thisArg) {
  var superBefore = thisArg._super.apply(this, args);
  if (superBefore && superBefore.then) {
    return superBefore.then(function() {
      return callback.apply(thisArg, args);
    });
  } else {
    return callback.apply(thisArg, args);
  }
}
