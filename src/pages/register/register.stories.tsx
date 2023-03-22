import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { RegisterComponent } from '.';

export default {
	title: 'Auth/Register',
	component: RegisterComponent,
} as ComponentMeta<typeof RegisterComponent>;

export const Primary: ComponentStory<typeof RegisterComponent> = args => (
	<RegisterComponent {...args} />
);
