import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { schemaTypes } from './schemas';
import { structure } from './structure';
import { bookingsTool } from './plugins/bookings';
import { reactionsTool } from './plugins/reactions';
import { statsTool } from './plugins/stats';
import Logo from './plugins/my-studio-logo/Logo';

const projectId = 'p3ezynln';

export default defineConfig({
  name: 'la-barraca-admin',
  title: 'La Barraca Admin',
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure,
      title: "CMS",
    }),
    bookingsTool(),
    reactionsTool(),
    visionTool({
      defaultApiVersion: '2024-01-01',
    }),
    // statsTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  studio: {
    components: {
      logo: Logo,
    },
  },
});
