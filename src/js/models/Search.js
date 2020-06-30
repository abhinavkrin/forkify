import axios from 'axios'
export default class Search{
    constructor(query){
        this.query=query;
    }
    async getResults(){
        try{
            const results=await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.results=results.data.recipes;
        }
        catch(error){
            console.log(error);
            throw {
                message: "No recipe found!"
            };
        }

    }
}