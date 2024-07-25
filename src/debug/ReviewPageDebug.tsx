import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header/Header";
import {
  Card,
  CardSection,
  Container,
  Grid,
  Group,
  Paper,
  SegmentedControl,
  Space,
  TextInput,
  UnstyledButton,
  Image,
  Divider,
  Text,
  Rating,
  Title,
  Button,
  Pagination,
  Center,
  ActionIcon,
  Flex,
  Spoiler,
  ScrollArea,
} from "@mantine/core";
import { IconPencil, IconSearch } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { motion as m } from "framer-motion";
import { useJsApiLoader } from "@react-google-maps/api";
import ReviewsPage from "../components/ReviewsPage/ReviewsPage";

function ReviewsPageDebug() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, //rmb to remove
    libraries: ["places", "maps", "core", "marker", "routes"],
    version: "weekly",
  });

  return isLoaded ? <ReviewsPage></ReviewsPage> : null;
}

export default ReviewsPageDebug;
