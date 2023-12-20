import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { DropdownDirective } from './dropdown.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AlertComponent, LoadingSpinnerComponent, DropdownDirective],
  imports: [CommonModule],
  exports: [AlertComponent, LoadingSpinnerComponent, DropdownDirective],
})
export class SharedModule {}

// Actually using the SharedModule has been giving me issues.
// The CommonModule does not seem to be loading correctly in any Modules that import the Shared module.
