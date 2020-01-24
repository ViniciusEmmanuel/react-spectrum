import {cleanup, render, waitForDomChange} from '@testing-library/react';
import {Item} from '@react-spectrum/tree';
import {Provider} from '@react-spectrum/provider';
import React from 'react';
import scaleMedium from '@adobe/spectrum-css-temp/vars/spectrum-medium-unique.css';
import {SideNav} from '../src';
import themeLight from '@adobe/spectrum-css-temp/vars/spectrum-light-unique.css';
import {SideNav as V2SideNav, SideNavItem as V2SideNavItem} from '@react/react-spectrum/SideNav';

let theme = {
  light: themeLight,
  medium: scaleMedium
};

function renderComponent(Component, props) {
  if (Component === V2SideNav) {
    return render(
      <V2SideNav>
        <V2SideNavItem>Foo</V2SideNavItem >
        <V2SideNavItem>Bar</V2SideNavItem>
        <V2SideNavItem>Bob</V2SideNavItem>
        <V2SideNavItem>Alice</V2SideNavItem>
      </V2SideNav>
    );
  } else {
    return render(
      <Provider theme={theme}>
        <SideNav >
          <Item>Foo</Item>
          <Item>Bar</Item>
          <Item>Bob</Item>
          <Item>Alice</Item>
        </SideNav>
      </Provider>
    );
  }
}

describe('SideNav', function () {
  afterEach(() => {
    cleanup();
  });

  let stub1, stub2;
  beforeAll(function () {
    stub1 = jest.spyOn(window.HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(() => 200);
    stub2 = jest.spyOn(window.HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(() => 400);
  });
  afterAll(function () {
    stub1.mockReset();
    stub2.mockReset();
  });

  it.each`
    Name           | Component    | props
    ${'SideNav'}   | ${SideNav}   | ${{}}
    ${'V2SideNav'} | ${V2SideNav} | ${{}}
  `('$Name has default behavior', async function ({Component}) {
    let {getByRole, getAllByRole, getByText} = renderComponent(Component);

    if (Component === SideNav) {
      await waitForDomChange();
    }

    let sideNav = getByRole('navigation');
    expect(sideNav).toBeTruthy();
    expect(sideNav.getAttribute('id')).toBeDefined();

    let sideNavList = getByRole('list');
    expect(sideNavList).toBeTruthy();
    expect(sideNav.getAttribute('id')).toBeDefined();

    let [foo, bar, bob, alice] = [
      getByText('Foo'),
      getByText('Bar'),
      getByText('Bob'),
      getByText('Alice')
    ];

    expect(foo).toBeTruthy();
    expect(bar).toBeTruthy();
    expect(bob).toBeTruthy();
    expect(alice).toBeTruthy();

    let sideNavListItems = getAllByRole('listitem');
    expect(sideNavListItems.length).toBe(4);

    let sideNavListItemLinks = getAllByRole('link');
    expect(sideNavListItemLinks.length).toBe(4);
    expect(sideNavListItemLinks[0].getAttribute('target')).toBe('_self');
  });
});
