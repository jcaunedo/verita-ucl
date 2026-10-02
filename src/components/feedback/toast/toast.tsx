import * as React from "react";
import { Toaster as SonnerToaster, toast as sonnerToast, type ToasterProps as SonnerToasterProps } from "sonner";
import { AlertCircle, AlertTriangle, CheckCircle, InfoCircle, XClose } from "@untitledui/icons";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { mediaAbove } from "@/lib/breakpoints";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Button } from "@/components/buttons/button";
import { Typography } from "@/components/typography";

/**
 * Figma: verita.ds → `sonner` (`node-id=6085-3802`). A 480px card on `background/default` with a 1px
 * `border/neutral/border`, `radius/sonner` (16px) and `shadow/md`; 16px top/bottom, 20px left and 12px right padding;
 * 40px between the content and the actions.
 */
const toastVariants = cva(
  "flex w-[480px] max-w-full items-center gap-10 rounded-sonner border border-border bg-background py-4 pr-3 pl-5 shadow-md",
  {
    variants: {
      // Figma shows `success` (check-circle) only; the other tones follow DESIGN.md "Message icons follow the message type".
      tone: { success: "", info: "", warning: "", destructive: "" },
    },
    defaultVariants: { tone: "success" },
  },
);

type ToastTone = NonNullable<VariantProps<typeof toastVariants>["tone"]>;

/** Icon + color per tone — the same map as `Alert`/`InlineAlert` (DESIGN.md "Message icons follow the message type"). */
const toneIcons: Record<ToastTone, { icon: React.FC<{ className?: string }>; className: string }> = {
  success: { icon: CheckCircle, className: "text-tone-success" },
  info: { icon: InfoCircle, className: "text-tone-info" },
  warning: { icon: AlertTriangle, className: "text-tone-warning" },
  destructive: { icon: AlertCircle, className: "text-tone-destructive" },
};

interface ToastProps extends VariantProps<typeof toastVariants> {
  /** Toast title (Figma: `sm -semibold`, `icon/foreground`). */
  title: React.ReactNode;
  /** Supporting line under the title (Figma: `sm`, `foreground/muted`, 4px below). Optional. */
  description?: React.ReactNode;
  /** Action button label (Figma: `Action Button`, `showActionButton`). Omit for no action. */
  actionLabel?: string;
  /** Called when the action button is pressed. */
  onAction?: () => void;
  /** Called when the close (×) button is pressed. Omit to hide the close button (Figma: `showCloseButton`). */
  onClose?: () => void;
  /** Accessible label for the close button. Defaults to "Dismiss". */
  closeLabel?: string;
  className?: string;
}

/**
 * A toast notification card. Figma: `sonner`. Usually shown through `toast()`, which renders it inside `Toaster`; use
 * it directly only to place a notification yourself.
 *
 * The close (×) is a 32px tertiary icon `Button` at 50% opacity, rising to 100% while the toast is hovered or the
 * button has keyboard focus (design direction, 2026-10-02). The fade is on a wrapper so the Button keeps its own hover
 * fill and transition (same approach as `NextStepCard`'s dismiss).
 */
function Toast({
  tone,
  title,
  description,
  actionLabel,
  onAction,
  onClose,
  closeLabel = "Dismiss",
  className,
}: ToastProps) {
  const resolvedTone = tone ?? "success";
  const { icon: Icon, className: iconClassName } = toneIcons[resolvedTone];

  return (
    <div data-slot="toast" data-tone={resolvedTone} className={cn("group", toastVariants({ tone }), className)}>
      {/* Figma `Notification content`: 20px icon, 12px gap, then the text group. */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Icon aria-hidden="true" className={cn("size-5 shrink-0", iconClassName)} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Typography as="span" size="sm" weight="semibold" className="text-icon-foreground">
            {title}
          </Typography>
          {description && (
            <Typography as="span" size="sm" className="text-foreground-muted">
              {description}
            </Typography>
          )}
        </div>
      </div>
      {(actionLabel || onClose) && (
        <div className="flex shrink-0 items-center gap-2">
          {actionLabel && (
            <Button size="xs" onPress={onAction}>
              {actionLabel}
            </Button>
          )}
          {onClose && (
            <span className="flex opacity-50 transition-opacity duration-160 ease-in-out group-hover:opacity-100 has-[[data-focus-visible]]:opacity-100">
              <Button color="tertiary" size="xs" iconLeading={XClose} aria-label={closeLabel} onPress={onClose} />
            </span>
          )}
        </div>
      )}
    </div>
  );
}

type ToasterProps = Omit<SonnerToasterProps, "theme" | "richColors" | "icons" | "closeButton" | "invert">;

/**
 * Where toasts appear. Mount once near the root of the app; then call `toast()` from anywhere. Wraps `sonner`'s
 * `Toaster`, which handles stacking, auto-dismiss (paused while hovered), swipe to dismiss, and the screen-reader live
 * region. Defaults: 24px from the edges, 8px between toasts, at most 3 visible; its width follows the card's 480px.
 *
 * Placement (DESIGN.md "Toasts: bottom right on desktop, bottom center on mobile"): bottom right above `md`, bottom
 * center at `md` (768px) and below. Pass `position` only to override that for a specific surface.
 */
function Toaster({ position, offset = 24, gap = 8, visibleToasts = 3, style, ...props }: ToasterProps) {
  const isAboveMd = useMediaQuery(mediaAbove("md"));

  return (
    <SonnerToaster
      position={position ?? (isAboveMd ? "bottom-right" : "bottom-center")}
      offset={offset}
      gap={gap}
      visibleToasts={visibleToasts}
      style={{ "--width": "480px", ...style } as React.CSSProperties}
      {...props}
    />
  );
}

interface ToastOptions extends Pick<ToastProps, "tone" | "description" | "closeLabel"> {
  /** Toast title. */
  title: React.ReactNode;
  /** Optional action. Pressing it runs `onClick`, then dismisses the toast. */
  action?: { label: string; onClick: () => void };
  /** How long the toast stays, in ms. Defaults to `sonner`'s 4000; `Infinity` keeps it until dismissed. */
  duration?: number;
  /** Set to `false` to hide the close (×) button. Defaults to `true`. */
  dismissible?: boolean;
  /** Reuse an id to update an existing toast instead of adding a new one. */
  id?: string | number;
}

/** Shows a toast in the mounted `Toaster` and returns its id. `toast.dismiss(id)` closes it; `toast.dismiss()` closes all. */
function toast({ title, description, tone, action, closeLabel, duration, dismissible = true, id }: ToastOptions) {
  return sonnerToast.custom(
    (toastId) => (
      <Toast
        tone={tone}
        title={title}
        description={description}
        actionLabel={action?.label}
        onAction={
          action
            ? () => {
                action.onClick();
                sonnerToast.dismiss(toastId);
              }
            : undefined
        }
        onClose={dismissible ? () => sonnerToast.dismiss(toastId) : undefined}
        closeLabel={closeLabel}
      />
    ),
    { duration, id },
  );
}
toast.dismiss = (id?: string | number) => sonnerToast.dismiss(id);

export { Toast, toastVariants, Toaster, toast, type ToastProps, type ToastTone, type ToasterProps, type ToastOptions };
