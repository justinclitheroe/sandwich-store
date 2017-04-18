window.helpers = (function () {
  function newSandwich(attrs = {}) {
    const sandwich = {
      customer: attrs.customer || 'Sandwich',
      ingredients: parseIngredients(attrs.ingredients) || 'ingredients',
      id: uuid.v4() // eslint-disable-line no-undef
    };

    return sandwich;
  }

  function parseIngredients(str) {
    return str.split(', '||',');
  }

  function renderIngredients(arr) {
    if (Array.isArray(arr)) {
      return arr.join(', ');
    }
  } 

  function findById(array, id, cb) {
    array.forEach((el) => {
      if (el.id === id) {
        cb(el);
        return;
      }
    });
  }

  return {
    newSandwich,
    parseIngredients,
    findById,
    renderIngredients,
  };
}());
