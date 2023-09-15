import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() sendRecipeDetailsToRecipes = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe('Spaghet', 'Spaghetti and meatballs', 'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg'),
    new Recipe('Patatje pinda', 'Patat & een pinda', 'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg')
  ];

  constructor() { }

  ngOnInit() {
  }

  sendDataToRecipesComponent(recipe: Recipe){
    this.sendRecipeDetailsToRecipes.emit(recipe);
  }

}
