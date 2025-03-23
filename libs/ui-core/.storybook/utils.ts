import { APP_INITIALIZER, Injector } from '@angular/core';
import { AngularRenderer } from '@storybook/angular';
import { DecoratorFunction } from 'storybook/internal/types';

export function injectInjectorToProps<TArgs = unknown>(): DecoratorFunction<AngularRenderer, TArgs> {
  return (storyFn) => {
    const story = storyFn();

    if (!story.applicationConfig) {
      story.applicationConfig = { providers: [] };
    }

    story.applicationConfig.providers.push({
      provide: APP_INITIALIZER,
      useFactory: (injector: Injector): void => {
        if (!story.props) {
          story.props = { injector };
        }
        Object.assign(story.props, { injector });
      },
      deps: [Injector],
    });

    return story;
  };
}
