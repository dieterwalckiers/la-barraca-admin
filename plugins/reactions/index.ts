import { definePlugin } from 'sanity';
import ReactionsIcon from './ReactionsIcon';
import Reactions from './Reactions';

export const reactionsTool = definePlugin({
  name: 'reactions-tool',
  tools: [
    {
      name: 'reactions',
      title: 'Reacties',
      icon: ReactionsIcon,
      component: Reactions,
    },
  ],
});
