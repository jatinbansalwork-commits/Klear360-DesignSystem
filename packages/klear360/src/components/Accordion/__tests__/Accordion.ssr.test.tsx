/* eslint-disable @typescript-eslint/no-empty-function */
import { Accordion, AccordionItem, AccordionItemBody, AccordionItemHeader } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<Accordion />', () => {
  it('should render Accordion on server', () => {
    const { container } = renderWithSSR(
      <Accordion>
        <AccordionItem>
          <AccordionItemHeader title="How can I setup Route?" />
          <AccordionItemBody>
            You can use Klear Route from the Dashboard or using APIs to transfer money to customers.
            You may also check our docs for detailed instructions.
          </AccordionItemBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeader title="How can I setup QR Codes?" />
          <AccordionItemBody>
            Just use Klear. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        </AccordionItem>
      </Accordion>,
    );

    expect(container).toMatchSnapshot();
  });

  // Skipped because `useId` is rendering different internal ids for `aria-controls`

  it.skip('should render Deprecated API of Accordion on server', () => {
    const { container } = renderWithSSR(
      <Accordion>
        <AccordionItem
          title="How can I setup Route?"
          description="You can use Klear Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions."
        />
        <AccordionItem
          title="How can I setup QR Codes?"
          description="Just use Klear. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
        />
        <AccordionItem title="How can I setup Subscriptions?" description="Just use Klear." />
      </Accordion>,
    );

    expect(container).toMatchSnapshot();
  });
});
