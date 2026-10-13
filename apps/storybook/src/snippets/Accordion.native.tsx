import { Accordion, AccordionItem } from '@kalads/react-native-components';

export default function Example() {
  return (
    <Accordion>
      <AccordionItem heading="Shipping" defaultOpen>
        Orders ship within two working days.
      </AccordionItem>
      <AccordionItem heading="Returns">You can return items within 30 days.</AccordionItem>
    </Accordion>
  );
}
