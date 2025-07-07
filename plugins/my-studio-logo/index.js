import {definePlugin} from 'sanity'
import Logo from './Logo.jsx'

export const studioLogo = definePlugin({
  name: 'studio-logo',
  studio: {
    components: {
      logo: Logo
    }
  }
})