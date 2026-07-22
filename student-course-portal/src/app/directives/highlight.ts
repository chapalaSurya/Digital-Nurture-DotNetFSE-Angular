import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class Highlight {
  @Input() appHighlight: string = 'yellow';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  /*
   * @HostListener('mouseenter') binds to the host element's mouseenter event
   * without needing to manually add/remove event listeners. Angular handles cleanup automatically.
   */
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appHighlight || '#fef3c7'); // Default to light amber if appHighlight is empty
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }
}
