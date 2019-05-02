// Global app controller
// 880f2cc7c156d11a61c8d9c2d85c585d
// https://www.food2fork.com/api/search

import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 *  - Search object
 *  - Current recipe object
 *  - Shopping list object
 *  - Liked recipes
 */
const state = {};

const controlSearch = async () => {
  // 1) Get the query from view
  const query = searchView.getInput();
  console.log(query)

  if(query) {
    // 2) New search obj and add to state
    state.search = new Search(query);

    // 3) Prepearing the view
    searchView.clearInput();
    
    renderLoader(elements.searchRes)

    // 4) Search for recipes
    await state.search.getResults();

    // 5) render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
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



