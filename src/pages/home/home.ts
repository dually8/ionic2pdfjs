import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import 'pdfjs-dist';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  pdfDoc: PDFDocumentProxy;
  pageNum: number;

  constructor(public navCtrl: NavController) {
    debugger;
    PDFJS.getDocument('../../assets/pdfs/f1040.pdf')
      .then((pdf) => {
        this.pdfDoc = pdf;
        this.pageNum = 1;
        this.renderPage(this.pageNum);
      })
  }

  renderPage(pageNum: number): void {
    this.pdfDoc.getPage(pageNum)
      .then((page) => {
        const scale = 1;
        let viewport = page.getViewport(scale);

        //
        // Prepare canvas using PDF page dimensions
        //
        let canvas = <HTMLCanvasElement>document.getElementById('the-canvas');
        let context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        //
        // test viewport conversion methods
        // convertToViewportRectangle and normalizeRect are used in the acroforms example:
        // https://github.com/mozilla/pdf.js/blob/master/examples/acroforms/forms.js
        //
        const rect = viewport.convertToViewportRectangle([100, 100, 0, 0]);
        const normalizedRect = PDFJS.Util.normalizeRect(rect);
        const point = viewport.convertToViewportPoint(100, 100);
        const pdfPoint = viewport.convertToPdfPoint(100, 100);

        //
        // Render PDF page into canvas context
        //
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      });
  }

  goNext(): void {
    if (this.pdfDoc && this.pageNum < this.pdfDoc.numPages) {
      ++this.pageNum;
      this.renderPage(this.pageNum);
    }
  }

}
