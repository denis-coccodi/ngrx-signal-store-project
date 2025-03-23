import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { MetricToImperialHeightPipe } from './metric-to-imperial-height.pipe';

const meta: Meta = {
	title: 'Pipes/Metric to Imperial Height',
	parameters: {
	  layout: 'centered', // Options: 'padded', 'centered', 'fullscreen'
	},
	decorators: [
		moduleMetadata({
			imports: [MetricToImperialHeightPipe],
		}),
	],
};

export default meta;

type Story = StoryObj<{ value: number }>;

export const Primary: Story = {
	args: {
		value: 180,
	},
	render: (args) => ({
		template: `<p class="text-body-regular">{{ value | metricToImperialHeight }}</p>`,
		props: {
			value: args.value,
		},
	}),
};
