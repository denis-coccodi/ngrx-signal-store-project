import type { Meta, StoryObj } from '@storybook/angular';
import { IconComponent } from '@ui-lib/components';

const meta: Meta<IconComponent> = {
  component: IconComponent,
  title: 'Components/Icon Component',
  parameters: {
    layout: 'centered', // Options: 'padded', 'centered', 'fullscreen'
  },
  decorators: [
    storyFn => ({
      template: `
				<div class="storybook-wrapper" class="ml-16">
					<div class="storybook-content" style="fill: blue; width: 100px">
						${storyFn().template}
					</div>
				</div>
			`,
      props: storyFn().props,
    }),
  ],
};
export default meta;
type Story = StoryObj<IconComponent>;

export const RedArrows: Story = {
  args: {
    name: 'ArrowsClockwise',
    customStyles: {
      fill: 'red',
      'background-color': 'grey'
    },
  },
};

export const CalendarBlank: Story = {
  args: {
    name: 'CalendarBlank',
  },
};

export const PencilSimple: Story = {
  args: {
    name: 'PencilSimple',
    customStyles: {
      fill: 'grey',
	  width: '20px'
    },
  },
};
