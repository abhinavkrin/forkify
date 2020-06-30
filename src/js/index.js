// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, clearLoader , renderLoader } from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
const state={};
window.state=state;

/* *
 * SEARCH CONTROLLER
 * */
const controlSearch= async ()=>{
    //1. Get query from the view
    const query=searchView.getInput();
    
    if(query){
        //2. Add Search to state
        state.search=new Search(query);
        
        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResList);
        try{
            //4. Search for recipes
            await state.search.getResults();
            
            //5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.results);
        }catch(e){
            searchView.clearResults();
            clearLoader();
            alert(e.message);
        }
    }
}

elements.searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    controlSearch();
});
elements.searchResPages.addEventListener('click', e=>{
    const btn=e.target.closest('.btn-inline');
    if(btn){
        const gotoPage=parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.results,gotoPage);
    }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe=async ()=>{
    const id=window.location.hash.replace("#","");
    if(id){
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        if(state.search){
            searchView.highlightSelected(id);
        }
        //Create new recipe object
        state.recipe=new Recipe(id);

        //Get recipe data
        try{
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //calculate serving and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            //render recipe
            clearLoader();
            recipeView.clearRecipe();
            recipeView.renderRecipe(state.recipe,state.likes.isLiked(id));
        }
        catch(ex){
            console.log(ex);
            alert('Error processing recipe!');
        }
    }
}

/**
 * LIKES CONTROLLER
 */
const controlLikes=()=>{
    if(!state.likes)state.likes=new Likes();
    let newLike;
    const currId=state.recipe.id;
    const isLike=state.likes.isLiked(currId);
    if(isLike){
        state.likes.deleteLike(currId);
        likesView.deleteLike(currId);
    } else {
        newLike=state.likes.addLike(currId,state.recipe.title,state.recipe.author,state.recipe.img);
        likesView.renderLike(newLike);
    }
    likesView.toggleLikeBtn(!isLike);
    likesView.toggleLikesMenu(state.likes.getNumLikes());
}
const controlList =()=>{
    if(!state.list) state.list=new List();
    state.recipe.ingredients.forEach(el => {
        const item=state.list.addItem(el.count,el.unit,el.ingredient);
        listView.renderItem(item);
    });
}
const initLikes=()=>{
    state.likes=new Likes();
    state.likes.readStorage();
    likesView.toggleLikesMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => {
        likesView.renderLike(like);
    })
}
window.addEventListener('hashchange',controlRecipe);
window.addEventListener('load',()=>{
    initLikes();
    controlRecipe();
});

elements.recipe.addEventListener('click',e=>{
    if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateRecipeView(state.recipe);
    }else if(e.target.matches('.btn-decrease, .btn-decrease *')){
        state.recipe.updateServings('dec');
        recipeView.updateRecipeView(state.recipe);
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLikes();
    }
});
const valueChangeControl=(e,id)=>{
    const val=parseFloat(e.target.value);
        if(val>0)
            state.list.updateCount(id,val);
        else{
            state.list.deleteItem(id);
            listView.deleteItem(id);
        }
}
elements.shopping.addEventListener('click',e=>{
    const id=e.target.closest('.shopping__item').dataset.itemid;
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);
        listView.deleteItem(id);
    }else if(e.target.matches('.shopping__count-value')){
        valueChangeControl(e,id);
    }
});
elements.shopping.addEventListener('change',e=>{
    const id=e.target.closest('.shopping__item').dataset.itemid;
    if(e.target.matches('.shopping__count-value')){
        valueChangeControl(e,id);
    }
});
