import { Directive, HostListener, ElementRef, Renderer2 } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
// Add a class on a clicked element
constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
opened: boolean = false;

  @HostListener('click') onClick(eventData: Event) {
    const element = this.elementRef.nativeElement;
    if(this.opened){
        this.renderer.removeClass(element, 'open');
        this.opened = !this.opened;
    } else{
        this.renderer.addClass(element, 'open');
        this.opened = !this.opened;
    }
  }

}