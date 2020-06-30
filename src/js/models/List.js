import uniqid from 'uniqid';
export default class List{
    constructor(){
        this.items=[];
    }
    addItem(count,unit,ingredient){
        const item={id:uniqid(),count,unit,ingredient};
        this.items.push(item);
        return item;
    }
    updateCount(id,newCount){
        this.items.find(i=> i.id===id).count=newCount;
    }
    deleteItem(id){
        const index=this.items.findIndex(i=>i.id===id);
        this.items.splice(index,1);
    }
}