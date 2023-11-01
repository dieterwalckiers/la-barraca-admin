import React from "react";
import { route } from "part:@sanity/base/router";
import Bookings from "./Bookings";
import BookingsIcon from "./BookingsIcon";

export default {
  title: "Reservaties",
  name: "bookings",
  router: route("/:selectedProductionSlug"),
  icon: BookingsIcon,
  component: Bookings,
};
