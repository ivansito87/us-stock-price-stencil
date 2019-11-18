import { newE2EPage } from '@stencil/core/testing';

// @ts-ignore
describe('my-component', () => {
// @ts-ignore
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<my-component></my-component>');
    const element = await page.find('my-component');
// @ts-ignore
    expect(element).toHaveClass('hydrated');
  });

// @ts-ignore
  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<my-component></my-component>');
    const component = await page.find('my-component');
    const element = await page.find('my-component >>> div');
// @ts-ignore
    expect(element.textContent).toEqual(`Hello, World! I'm `);

    component.setProperty('first', 'James');
    await page.waitForChanges();
// @ts-ignore
    expect(element.textContent).toEqual(`Hello, World! I'm James`);

    component.setProperty('last', 'Quincy');
    await page.waitForChanges();
// @ts-ignore
    expect(element.textContent).toEqual(`Hello, World! I'm James Quincy`);

    component.setProperty('middle', 'Earl');
    await page.waitForChanges();
// @ts-ignore
    expect(element.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);
  });
});
