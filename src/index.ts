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
  cardDismissVariants,
  cardEnterFromRightVariants,
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
export { LinkedInLogo, type LinkedInLogoProps } from "./components/branding/linkedin-logo";

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

export { Hyperlink, hyperlinkVariants, type HyperlinkProps } from "./components/buttons/hyperlink";

/* -------------------------------------------------------------------------- */
/* Forms — primitives                                                         */
/* -------------------------------------------------------------------------- */

export {
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  selectItemVariants,
  type SelectContentProps,
  type SelectItemProps,
  type SelectTriggerProps,
} from "./components/forms/select";

export { SearchField, type SearchFieldProps } from "./components/forms/search-field";
export { TagInput, type TagInputProps, type TagInputSuggestion } from "./components/forms/tag-input";
export { Input, type InputProps } from "./components/forms/input";
export { Textarea, type TextareaProps } from "./components/forms/textarea";
export {
  fieldVariants,
  fieldTextVariants,
  fieldState,
  FieldIcon,
  type FieldState,
  type FieldIconProp,
} from "./components/forms/field";

/* -------------------------------------------------------------------------- */
/* Icons                                                                       */
/* -------------------------------------------------------------------------- */

export { FaceSlightlySmilingPlus, type IconProps } from "./components/icons";

/* -------------------------------------------------------------------------- */
/* Data display                                                               */
/* -------------------------------------------------------------------------- */

export { Avatar, avatarVariants, type AvatarProps } from "./components/data-display/avatar";

export {
  AvatarCompanies,
  type AvatarCompaniesProps,
} from "./components/data-display/avatar-companies";

export { Badge, badgeVariants, type BadgeProps } from "./components/data-display/badge";
export {
  Tag,
  TagGroup,
  TagList,
  tagVariants,
  type TagProps,
  type TagGroupProps,
  type TagListProps,
} from "./components/data-display/tag";

/* -------------------------------------------------------------------------- */
/* Feedback                                                                   */
/* -------------------------------------------------------------------------- */

export { Alert, alertVariants, type AlertProps, type AlertTone } from "./components/feedback/alert";

export {
  InlineAlert,
  inlineAlertVariants,
  type InlineAlertProps,
  type InlineAlertTone,
} from "./components/feedback/inline-alert";

export { EmptyState, type EmptyStateProps } from "./components/feedback/empty-state";
export {
  Toast,
  toastVariants,
  Toaster,
  toast,
  type ToastProps,
  type ToastTone,
  type ToasterProps,
  type ToastOptions,
} from "./components/feedback/toast";

/* -------------------------------------------------------------------------- */
/* Cards                                                                      */
/* -------------------------------------------------------------------------- */

export {
  ApplicationCard,
  ApplicationCardGroup,
  type ApplicationCardProps,
} from "./components/cards/application-card";

export { CalloutCard, type CalloutCardProps } from "./components/cards/callout-card";

export {
  ContractCard,
  type ContractCardProps,
  type ContractCardProgress,
} from "./components/cards/contract-card";

export { MatchCard, type MatchCardProps } from "./components/cards/match-card";

export { NextStepCard, nextStepCardVariants, type NextStepCardProps } from "./components/cards/next-step-card";

export { OfferCard, type OfferCardProps } from "./components/cards/offer-card";

export {
  SectionEmptyState,
  type SectionEmptyStateProps,
} from "./components/cards/section-empty-state";

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export { Sidebar, type SidebarProps } from "./components/navigation/sidebar";
export {
  MetricTabs,
  MetricTabList,
  MetricTab,
  MetricTabPanel,
  metricTabVariants,
  type MetricTabProps,
  type MetricTabListProps,
} from "./components/navigation/metric-tab";
export {
  TabButtons,
  TabButtonList,
  TabButton,
  TabButtonPanel,
  tabButtonVariants,
  type TabButtonProps,
  type TabButtonListProps,
} from "./components/navigation/tab-button";
export {
  TabUnderlines,
  TabUnderlineList,
  TabUnderline,
  TabUnderlinePanel,
  tabUnderlineVariants,
  type TabUnderlineProps,
  type TabUnderlineListProps,
} from "./components/navigation/tab-underline";

/* -------------------------------------------------------------------------- */
/* Overlays                                                                   */
/* -------------------------------------------------------------------------- */

export {
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  menuItemVariants,
  countMenuItems,
  type MenuContentProps,
  type MenuItemProps,
} from "./components/overlays/menu";

export {
  AccountMenu,
  AccountMenuItem,
  type AccountMenuProps,
  type AccountMenuItemProps,
} from "./components/overlays/account-menu";

export {
  SidebarTooltip,
  SidebarTooltipTrigger,
  type SidebarTooltipProps,
} from "./components/overlays/sidebar-tooltip";
export { Modal, type ModalProps } from "./components/overlays/modal";
export {
  ShareReferralLinkModal,
  type ShareReferralLinkModalProps,
  type ReferralConnection,
  type ReferralOpportunity,
} from "./components/overlays/share-referral-link-modal";
