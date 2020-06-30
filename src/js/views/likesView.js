import {elements} from './base';
import {limitTitleSize} from './searchView';
export const toggleLikeBtn = isLiked=> {
    const iconName=isLiked? 'icon-heart':'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href',`img/icons.svg#${iconName}`);
}
export const toggleLikesMenu = numLikes =>{
    elements.likesMenu.style.visibility= numLikes>0?'visible':'hidden';
}
export const renderLike= like=>{
    const html= `
                <li>
                    <a class="likes__link" href="#${like.id}">
                        <figure class="likes__fig">
                            <img src="${like.img}" alt="${like.title}">
                        </figure>
                        <div class="likes__data">
                            <h4 class="likes__name">${limitTitleSize(like.title)}</h4>
                            <p class="likes__author">${like.author}</p>
                        </div>
                    </a>
                </li>
                `;
    elements.likesList.insertAdjacentHTML('beforeend',html);
}
export const deleteLike= id =>{
    const item=document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    if(item)
    item.parentElement.removeChild(item);
}