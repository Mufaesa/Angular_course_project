import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';

@Injectable()
export class DataStorageService {
    firebaseUrl: string = "YOUR_FIREBASE_URL";

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
        return this.http.get<Recipe[]>(this.firebaseUrl + 'recipes.json')
        .pipe(map(recipes => {
            return recipes.map(recipes => {
                return {...recipes, ingredients: recipes.ingredients ? recipes.ingredients : []}
            })
        }),
        tap(recipes => {
            this.recipeService.setRecipes(recipes);
        })
        )
    }
}