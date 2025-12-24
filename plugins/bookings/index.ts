import { definePlugin } from 'sanity';
import BookingsIcon from './BookingsIcon';
import Bookings from './Bookings';

export const bookingsTool = definePlugin({
  name: 'bookings-tool',
  tools: [
    {
      name: 'bookings',
      title: 'Reservaties',
      icon: BookingsIcon,
      component: Bookings,
    },
  ],
});
