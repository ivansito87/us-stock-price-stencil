// import { TestWindow } from '@stencil/core/testing';
import { Spinner } from './spinner';

describe('spinner', () => {
  it('should build', () => {
    expect(new Spinner()).toBeTruthy();
  });

  // describe('rendering', () => {
  //   let element: HTMLSpinnerElement;
  //   let testWindow: TestWindow;
  //   beforeEach(async () => {
  //     testWindow = new TestWindow();
  //     element = await testWindow.load({
  //       components: [Spinner],
  //       html: '<spinner></spinner>'
  //     });
  //   });

  //   // See https://stenciljs.com/docs/unit-testing
  //   {cursor}

  // });
});
