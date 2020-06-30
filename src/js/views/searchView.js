import {elements} from './base'
export const getInput = () => elements.searchInput.value;
export const clearInput = ()=> {
	elements.searchInput.value='';
}
export const clearResults = () => {
	elements.searchResList.innerHTML='';	
	elements.searchResPages.innerHTML='';
}
export const limitTitleSize= (title,limit= 17) =>{
	if(title.length>limit){
		let acc,arr,newTitle='';
		arr=title.split(' ');
		acc=0;
		for(let i=0;i<arr.length;i++){
			if(acc+arr[i].length <= limit){
				newTitle=newTitle+' '+arr[i];
			}
			acc=newTitle.length;
		}
		if(newTitle.length===0){
			newTitle=title.substr(0,limit);
		}
		return newTitle+'...';
	}
	return title;
}
const createButton = (page,type) =>
	`
	<button class="btn-inline results__btn--${type}" data-goto="${type==='prev'?page - 1: page + 1}">
		${
			type=='prev'?
			`<svg class="search__icon">
			<use href="img/icons.svg#icon-triangle-${type==='prev'?'left':'right'}"></use>
			</svg>`:``
		}
		<span>Page ${type==='prev'?page - 1: page + 1}</span>
		${
			type=='next'?
			`<svg class="search__icon">
			<use href="img/icons.svg#icon-triangle-${type==='prev'?'left':'right'}"></use>
			</svg>`:``
		}
	</button>
	`;
const renderRecipe = recipe =>{
    const html= `
	<li>
	<a class="results__link" href="#${recipe.recipe_id}">
		<figure class="results__fig">
			<img src="${recipe.image_url}" alt="Test">
		</figure>
		<div class="results__data">
			<h4 class="results__name">${limitTitleSize(recipe.title)}</h4>
			<p class="results__author">${recipe.publisher}</p>
		</div>
	</a>
	</li>
	`;
	elements.searchResList.insertAdjacentHTML('beforeend',html);
}
const renderButtons = (page,numResults,maxPerPage)=>{
	const pages=Math.ceil(numResults/maxPerPage);
	let button='';
	if(page!=1){
		//Render prev
		button+=createButton(page,'prev');
	}
	if(page!==pages){
		//Render next
		button+=createButton(page,'next');
	}
	elements.searchResPages.insertAdjacentHTML('afterbegin',button);
}
export const renderResults = (recipes, page=1, maxPerPage=10) => {
	const start=(page-1)*maxPerPage;
	const end=page*maxPerPage
	recipes.slice(start,end).forEach(renderRecipe);
	renderButtons(page,recipes.length,maxPerPage);
}

export const highlightSelected = id =>{
	Array.from(document.querySelectorAll('.results__link')).forEach(el => {
		el.classList.remove('results__link--active')
	});
	const item=document.querySelector(`.results__link[href="#${id}"]`);
	if(item)
	 item.classList.add('results__link--active');
}