import { definePlugin } from 'sanity';
import StatsIcon from './StatsIcon';
import Stats from './Stats';

export const statsTool = definePlugin({
  name: 'stats-tool',
  tools: [
    {
      name: 'stats',
      title: 'Stats',
      icon: StatsIcon,
      component: Stats,
    },
  ],
});
