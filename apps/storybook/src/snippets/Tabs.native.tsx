import { Tab, TabPanel, Tabs } from '@kalads/react-native-components';

export default function Example() {
  return (
    <Tabs label="Settings" defaultValue="general" onChange={(value) => console.log(value)}>
      <Tab value="general">General</Tab>
      <Tab value="billing">Billing</Tab>
      <TabPanel value="general">General settings</TabPanel>
      <TabPanel value="billing">Billing settings</TabPanel>
    </Tabs>
  );
}
