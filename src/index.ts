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

export { AccountTrigger, type AccountTriggerProps } from "./components/buttons/account-trigger";

/* -------------------------------------------------------------------------- */
/* Data display                                                               */
/* -------------------------------------------------------------------------- */

export { Avatar, avatarVariants, type AvatarProps } from "./components/data-display/avatar";

export { Badge, badgeVariants, type BadgeProps } from "./components/data-display/badge";

/* -------------------------------------------------------------------------- */
/* Cards                                                                      */
/* -------------------------------------------------------------------------- */

export { ApplicationCard, type ApplicationCardProps } from "./components/cards/application-card";

export { CalloutCard, type CalloutCardProps } from "./components/cards/callout-card";

export {
  ContractCard,
  type ContractCardProps,
  type ContractCardProgress,
} from "./components/cards/contract-card";

export { NextStepCard, type NextStepCardProps } from "./components/cards/next-step-card";

export {
  SectionEmptyState,
  type SectionEmptyStateProps,
} from "./components/cards/section-empty-state";

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
