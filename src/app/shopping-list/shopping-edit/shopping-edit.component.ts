import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @Output() addNewIngredients = new EventEmitter<Ingredient>
  constructor() { }

  ngOnInit() {
  }

  addNewIngredient(IngredientName: string, IngredientAmount: number){
    this.addNewIngredients.emit(new Ingredient(IngredientName, IngredientAmount));
  }
}
