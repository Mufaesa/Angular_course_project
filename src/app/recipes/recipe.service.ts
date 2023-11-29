import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Subject } from 'rxjs/Subject';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanges = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      'Spaghet',
      'Spaghetti and meatballs', 
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg', 
      [
        new Ingredient('Spaghetti', 1),
        new Ingredient('Meatballs', 6),
        new Ingredient('Salt', 1),
        new Ingredient('Tomato', 2)
      ]),
    new Recipe(
      'Patatje pinda', 
      'Patat & een pinda', 
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg', 
      [
        new Ingredient('Patatjes', 25),
        new Ingredient('Pindasaus', 1)
      ])
  ];

  constructor() { }

  getRecipes(){
    return this.recipes.slice();
  }

  getRecipe(index: number){
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipesChanges.next(this.recipes.slice());
  }
  
  updateRecipe(index: number, newRecipe: Recipe){
    this.recipes[index] = newRecipe;
    this.recipesChanges.next(this.recipes.slice());
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipesChanges.next(this.recipes.slice());
  }

}
