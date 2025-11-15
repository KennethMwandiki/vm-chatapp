import { Button } from './Button';

export default {
  title: 'UI Kit/Button',
  component: Button,
  argTypes: {
    primary: { control: 'boolean' },
    label: { control: 'text' },
  },
};

export const Primary = {
  args: {
    primary: true,
    label: 'Primary Button',
  },
};

export const Secondary = {
  args: {
    label: 'Secondary Button',
  },
};