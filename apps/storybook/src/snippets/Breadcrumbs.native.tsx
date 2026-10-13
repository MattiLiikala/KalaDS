import { BreadcrumbItem, Breadcrumbs } from '@kalads/react-native-components';

declare function navigate(screen: string): void;

export default function Example() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem onPress={() => navigate('Home')}>Home</BreadcrumbItem>
      <BreadcrumbItem onPress={() => navigate('Settings')}>Settings</BreadcrumbItem>
      <BreadcrumbItem>Profile</BreadcrumbItem>
    </Breadcrumbs>
  );
}
