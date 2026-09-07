export { cn } from "./lib/utils";

export {
  motionDuration,
  motionDistance,
  motionScale,
  motionStagger,
  standardTransition,
  enterTransition,
  exitTransition,
  subtleSpring,
  responsiveSpring,
  layoutSpring,
  fadeVariants,
  revealVariants,
  dismissVariants,
  overlayVariants,
  panelVariants,
  slideVariants,
  staggerContainerVariants,
  liftPattern,
  pressPattern,
  mediaHoverPattern,
  glidePattern,
  confirmPattern,
  reducedMotionTransition,
  resolveTransition,
  useMotionPreference,
} from "./lib/motion";

/* -------------------------------------------------------------------------- */
/* Branding                                                                   */
/* -------------------------------------------------------------------------- */

export { Logo, logoVariants, type LogoProps } from "./components/branding/logo";

/* -------------------------------------------------------------------------- */
/* Typography                                                                 */
/* -------------------------------------------------------------------------- */

export {
  Typography,
  typographyVariants,
  type TypographyProps,
  type TypographySize,
  type TypographyWeight,
} from "./components/typography";

/* -------------------------------------------------------------------------- */
/* Buttons                                                                    */
/* -------------------------------------------------------------------------- */

export {
  Button,
  buttonVariants,
  type ButtonProps,
  type LinkButtonProps,
  type ButtonComponentProps,
} from "./components/buttons/button";

export {
  SidebarMenuItem,
  sidebarMenuItemVariants,
  type SidebarMenuItemProps,
} from "./components/buttons/sidebar-menu-item";

export { AccountMenu, type AccountMenuProps } from "./components/buttons/account-menu";

/* -------------------------------------------------------------------------- */
/* Data display                                                               */
/* -------------------------------------------------------------------------- */

export { Avatar, avatarVariants, type AvatarProps } from "./components/data-display/avatar";

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export { Sidebar } from "./components/navigation/sidebar";

/* -------------------------------------------------------------------------- */
/* Overlays                                                                   */
/* -------------------------------------------------------------------------- */

export {
  SidebarTooltip,
  SidebarTooltipTrigger,
  type SidebarTooltipProps,
} from "./components/overlays/sidebar-tooltip";
