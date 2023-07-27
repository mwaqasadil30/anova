import { within, waitForElementToBeRemoved } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';

export const selectMaterialUiSelectOption = async (
  element: any,
  optionText: any
) =>
  new Promise((resolve) => {
    // The the button that opens the dropdown, which is a sibling of the input
    // const selectButton = element.parentNode.querySelector('[role=button]');

    // Open the select dropdown
    UserEvent.click(element);

    // Get the dropdown element. We don't use getByRole() because it includes <select>s too.
    const listbox = document.body.querySelector('ul[role=listbox]');

    // Click the list item
    // @ts-ignore
    const listItem = within(listbox).getByText(optionText);
    UserEvent.click(listItem);

    // Wait for the listbox to be removed, so it isn't visible in subsequent calls
    waitForElementToBeRemoved(() =>
      document.body.querySelector('ul[role=listbox]')
    ).then(resolve);
  });
