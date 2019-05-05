// Global app controller
// 880f2cc7c156d11a61c8d9c2d85c585d
// https://www.food2fork.com/api/search

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 *  - Search object
 *  - Current recipe object
 *  - Shopping list object
 *  - Liked recipes
 */
const state = {};

/**
 *  SEARCH CONTROLLER
 */

const controlSearch = async () => {
  // 1) Get the query from view
  const query = searchView.getInput();

  if(query) {
    // 2) New search obj and add to state
    state.search = new Search(query);

    // 3) Prepearing the view
    searchView.clearInput();
    searchView.cleatResults();
    renderLoader(elements.searchRes)

    try {
      // 4) Search for recipes
      await state.search.getResults();

      // 5) render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch(error) {
      alert( error);
      clearLoader();
    }
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if(btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.cleatResults();  
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 *  RECIPE CONTROLLER
 */

 const controlRecipe = async () => {
   // Get ID from url
  const id  = window.location.hash.replace('#', '');

  if(id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected search item
    if(state.search) {
      searchView.highlightedSelected(id);
    }

    // Create new recipe object
      state.recipe = new Recipe(id);

    // Get recipe data and parse ingredients
    try{
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // Calculate servings
        state.recipe.calcTime();
        state.recipe.calcServings();
      // Render the recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch(error) {
      alert(error);
    }
  }
 };

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 *  LIST CONTROLLER
 */

 const controlList= () => {
  // create a new list if there is no list yet
  if(!state.list) state.list = new List();

  // Add each ingredients to the list and UI
  state.recipe.ingredients.forEach(el =>{
   const item = state.list.additem(el.count, el.unit, el.ingredient);
   listView.renderItem(item);
  });
 }

// Handle delete and update list item events
elements.shoping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle the delete btn
  if(e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state 
    state.list.deleteItem(id);
     // Delete from  UI
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});


// Handling recipe btn clicks
elements.recipe.addEventListener('click', e => {
  if(e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease btn is clicked
    if(state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if(e.target.matches('.btn-increase, .btn-increase *')) {
    // increase btn is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  }
});





