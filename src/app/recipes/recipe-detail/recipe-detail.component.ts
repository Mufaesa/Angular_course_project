import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private shoppingListService: ShoppingListService,
              private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router){}

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    )
  };

  addIngredientsToShoppingList() {
    this.recipe.ingredients.forEach((ingredient) => {
      this.shoppingListService.addNewIngredientToList(ingredient);
    });
  }

  onDeleteRecipe(){
    if (confirm("Are you sure you want to remove this recipe?")){
      this.recipeService.deleteRecipe(this.id);
      this.router.navigate(['/recipes']);
    }
  }
}