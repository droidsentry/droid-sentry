import { Meta, StoryObj } from "@storybook/react";

// import RouterBasedComponent from './RouterBasedComponent';
import HeaderLogoButton from "@/components/header-logo-button";

const meta: Meta<typeof HeaderLogoButton> = {
  component: HeaderLogoButton,
};
export default meta;

type Story = StoryObj<typeof HeaderLogoButton>;

export const Default: Story = {
  args: {},
};
