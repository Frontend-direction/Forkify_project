// Global app controller
// 880f2cc7c156d11a61c8d9c2d85c585d
// https://www.food2fork.com/api/search

import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
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
  
      console.log(state.recipe);
    } catch(error) {
      alert('Error processing recipe');
    }
  }
 };

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

