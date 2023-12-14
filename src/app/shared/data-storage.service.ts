import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { exhaustMap, map, take, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { AuthService } from "../auth/auth.service";

@Injectable()
export class DataStorageService {
    firebaseUrl: string = "YOUR_FIREBASE_URL";

    constructor(private http: HttpClient,
                private recipeService: RecipeService,
                private authService: AuthService) {}

    
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
        // Pipe(take(1)) sets a maximum of updates it will take from a subscription
        return this.authService.user.pipe(
            take(1), 
            exhaustMap(user => {
                return this.http.get<Recipe[]>(
                    this.firebaseUrl + 'recipes.json',
                    {
                        params: new HttpParams().set('auth', user.token)
                    }
                );
            }),
            map(recipes => {
                return recipes.map(recipes => {
                    return {...recipes, ingredients: recipes.ingredients ? recipes.ingredients : []}
                })
            }),
            tap(recipes => {
                this.recipeService.setRecipes(recipes);
            })
        );
    }
}