import { A11yModule, FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { DialogRef } from '@angular/cdk/dialog';
import { BasePortalOutlet, CdkPortalOutlet, ComponentPortal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, ComponentRef, ElementRef, OnDestroy, OnInit, Renderer2, RendererFactory2, ViewChild } from '@angular/core';

@Component({
  selector: 'lib-default-dialog-container',
  standalone: true,
  imports: [CommonModule, PortalModule, A11yModule],
  templateUrl: './default-dialog-container.component.html',
  styleUrl: './default-dialog-container.component.scss',
})
export class DefaultDialogContainerComponent extends BasePortalOutlet implements OnInit, OnDestroy {
  private focusTrap!: FocusTrap;
  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet!: CdkPortalOutlet;
  protected componentPortal!: ComponentPortal<unknown>;
  private renderer: Renderer2;

  constructor(public dialogRef: DialogRef, private rendererFactory: RendererFactory2, private el: ElementRef, private focusTrapFactory: FocusTrapFactory) {
    super();
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  ngOnInit() {
    this.focusTrap = this.focusTrapFactory.create(this.el.nativeElement); // ✅ Enable focus trap
    this.focusTrap.focusInitialElement();
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    this.componentPortal = portal;

    if (this.portalOutlet) {
      const componentRef = this.portalOutlet.attachComponentPortal(portal);
      this.renderer.addClass(componentRef.location.nativeElement, 'display-contents');
      return componentRef;
    }
    throw new Error('No PortalOutlet found to attach the component portal.');
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>) {
    return this.portalOutlet.attachTemplatePortal(portal);
  }

  ngOnDestroy(): void {
    this.focusTrap.destroy();
  }
}
