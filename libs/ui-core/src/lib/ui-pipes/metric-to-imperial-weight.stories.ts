import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { MetricToImperialWeightPipe } from './metric-to-imperial-weight.pipe';

const meta: Meta = {
	title: 'Pipes/Metric to Imperial Weight',
	parameters: {
	  layout: 'centered', // Options: 'padded', 'centered', 'fullscreen'
	},
	decorators: [
		moduleMetadata({
			imports: [MetricToImperialWeightPipe],
		}),
	],
};

export default meta;

type Story = StoryObj<{ value: number }>;

export const Primary: Story = {
	args: {
		value: 80,
	},
	render: (args) => ({
		template: `<p class="text-body-regular">{{ value | metricToImperialWeight }}</p>`,
		props: {
			value: args.value,
		},
	}),
};
