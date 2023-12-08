import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";

import { Recipe } from '../recipes/recipe.model';

@Injectable()
export class DataStorageService {
    firebaseUrl: string = "https://ng-complete-guide-5f905-default-rtdb.europe-west1.firebasedatabase.app/";

    constructor(private http: HttpClient,
                private recipeService: RecipeService) {}

    
    storeRecipes(){
        const recipes = this.recipeService.getRecipes();
        this.http.put
        (
            this.firebaseUrl + 'recipes.json',
            recipes
        )
        .subscribe(response => {
            console.log(response);
        })
    }

    fetchRecipes(){
        this.http.get<Recipe[]>(this.firebaseUrl + 'recipes.json')
        .subscribe(recipes => {
            this.recipeService.setRecipes(recipes);
        })
    }
}