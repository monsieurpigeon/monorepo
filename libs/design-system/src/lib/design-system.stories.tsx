import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DesignSystem } from './design-system';

export default {
  component: DesignSystem,
  title: 'DesignSystem',
} as ComponentMeta<typeof DesignSystem>;

const Template: ComponentStory<typeof DesignSystem> = (args) => (
  <DesignSystem {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
