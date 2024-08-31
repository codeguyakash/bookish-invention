import { LuminousAngularPage } from './app.po';

describe('luminous-angular App', () => {
  let page: LuminousAngularPage;

  beforeEach(() => {
    page = new LuminousAngularPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
