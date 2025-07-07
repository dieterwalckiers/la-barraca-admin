import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {dashboardTool} from '@sanity/dashboard'
import {netlifyWidget} from 'sanity-plugin-dashboard-widget-netlify'
import schemaTypes from './schemas/index'
import {structure} from './deskStructure'
import {studioLogo} from './plugins/my-studio-logo'
// Import tool components directly
import BookingsIcon from './plugins/bookings/BookingsIcon.jsx'
import Bookings from './plugins/bookings/Bookings.jsx'
import ReactionsIcon from './plugins/reactions/ReactionsIcon.jsx'
import Reactions from './plugins/reactions/Reactions.jsx'
import StatsIcon from './plugins/stats/StatsIcon.jsx'
import Stats from './plugins/stats/Stats.jsx'


const isDevelopment = process.env.NODE_ENV === 'development'

export default defineConfig({
  name: 'default',
  title: 'La Barraca Admin',

  projectId: 'p3ezynln',
  dataset: isDevelopment ? 'development' : 'production',

  plugins: [
    structureTool({
      structure
    }),
    ...(isDevelopment ? [visionTool()] : []),
    dashboardTool({
      widgets: [
        netlifyWidget({
          title: 'Netlify deploys',
          sites: [
            {
              title: 'La Barraca website',
              apiId: 'b20a5190-a462-4b04-aa16-c201aebb9472',
              buildHookId: '5ec65889e09ff5211934a869',
              name: 'sanity-labarraca-web'
            }
          ]
        })
      ]
    }),
    studioLogo
  ],

  tools: [
    {
      name: 'bookings',
      title: 'Reservaties',
      icon: BookingsIcon,
      component: Bookings
    },
    {
      name: 'reactions', 
      title: 'Reacties',
      icon: ReactionsIcon,
      component: Reactions
    },
    {
      name: 'stats',
      title: 'Stats', 
      icon: StatsIcon,
      component: Stats
    }
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      return prev
    }
  }
})