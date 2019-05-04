import { elements } from './base';

export const getInput = () => elements.serachInput.value;

export const clearInput = () => {
  elements.serachInput.value = '';
}

export const cleatResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
};

const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if(title.length > limit) {
    title.split(' ').reduce((acc, el) => {
      if(acc + el.lenth <= limit) {
        newTitle.push(el)
      };
      return acc + el.length;
    }, 0);
    return `${newTitle.join(' ')}...`;
  }
  return title;
}  

const renderRecipe = recipe => {
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
          <p class="results__author">${recipe.publisher}</p>
        </div>
      </a>
    </li>
  `;
  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto = ${type === 'prev'? page - 1 : page + 1}>
    <span>Page ${type === 'prev'? page - 1 : page + 1}</span> 
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${type === 'prev'? 'left' : 'right'}"></use>
    </svg>
  </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;

  if(page === 1 && pages > 1) {
   button = createButton(page, 'next');
  } else if(page < pages) {
    // Both buttons
    button = `
              ${createButton(page, 'next')}
              ${createButton(page, 'prev')}`;
  } else if (page === pages && pages > 1) {
    button = createButton(page, 'prev');
  }

  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // render results of current page

  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  // renser pagination btns
  renderButtons(page, recipes.length, resPerPage);
};