import * as React from "react";
import {
  Dialog as AriaDialog,
  Heading as AriaHeading,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
} from "react-aria-components";
import { AnimatePresence, motion } from "motion/react";
import { XClose } from "@untitledui/icons";

import { cn } from "@/lib/utils";
import { modalOverlayVariants, modalVariants, standardTransition, useMotionPreference } from "@/lib/motion";
import { Button } from "@/components/buttons/button";
import { Typography, typographyVariants } from "@/components/typography";

const MotionModalOverlay = motion.create(AriaModalOverlay);
const MotionModal = motion.create(AriaModal);

interface ModalProps {
  /** Whether the modal is open. The modal is controlled: pair with `onOpenChange`. */
  isOpen: boolean;
  /** Called with `false` when the modal asks to close (close button, Esc, or a click on the scrim). */
  onOpenChange: (isOpen: boolean) => void;
  /** Dialog title (Figma: `2xl -semibold`). Also the dialog's accessible name. */
  title: React.ReactNode;
  /** Supporting text under the title (Figma: `sm`, `foreground/muted`, 16px below it). */
  description?: React.ReactNode;
  /** Accessible label for the close (×) button. Defaults to "Close". */
  closeLabel?: string;
  /** Whether a click on the scrim closes the modal. Defaults to `true`; Esc always closes it. */
  isDismissable?: boolean;
  /** The modal's body, 24px below the title block. */
  children?: React.ReactNode;
  /** Extra classes for the dialog surface (e.g. a different `max-w-*`). */
  className?: string;
}

/**
 * A centered modal dialog over a scrim. Figma: verita.ds → `share-referral-link-modal` (`node-id=6083-2555`), the
 * first modal in the system: a 560px `background/default` surface, `radius/popover` (16px), `shadow/modal`, 32px
 * padding, and 24px between its sections. The title block is the title and a 32px tertiary close (×) on one row,
 * with the description 16px below.
 *
 * Built on React Aria's `ModalOverlay` + `Modal` + `Dialog` (Untitled UI's own foundation), so focus is trapped and
 * restored, Esc closes, the page behind is inert, and the title labels the dialog. Motion: the scrim fades
 * (`modalOverlayVariants`) and the surface fades in with a soft scale and a 12px rise (`modalVariants`). Both leave
 * with a slow, even 600ms fade and no movement (`modalExitTransition`, design direction 2026-10-02); reduced motion
 * keeps only the fades. `AnimatePresence` keeps the modal mounted until its exit finishes. When the content changes height (e.g. a modal swapping views), the surface glides to its new centered
 * position (`layout="position"` on `standardTransition`) instead of jumping; off under reduced motion. The scrim is
 * `--overlay` (black at 40%); Figma's component frame doesn't show one.
 */
function Modal({
  isOpen,
  onOpenChange,
  title,
  description,
  closeLabel = "Close",
  isDismissable = true,
  children,
  className,
}: ModalProps) {
  const { prefersReducedMotion } = useMotionPreference();
  const fadeOnly = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionModalOverlay
          data-slot="modal-overlay"
          isOpen
          onOpenChange={onOpenChange}
          isDismissable={isDismissable}
          variants={modalOverlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-overlay p-4"
        >
          <MotionModal
            data-slot="modal"
            variants={prefersReducedMotion ? fadeOnly : modalVariants}
            layout={prefersReducedMotion ? false : "position"}
            transition={{ layout: standardTransition }}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              "w-full max-w-[560px] overflow-hidden rounded-popover bg-background shadow-modal outline-none",
              className,
            )}
          >
            <AriaDialog data-slot="modal-dialog" className="flex flex-col items-start gap-6 p-8 outline-none">
              {({ close }) => (
                <>
                  <div className="flex w-full flex-col items-start gap-4">
                    <div className="flex w-full items-center justify-between gap-4">
                      <AriaHeading
                        slot="title"
                        className={cn(typographyVariants({ size: "2xl", weight: "semibold" }), "text-foreground")}
                      >
                        {title}
                      </AriaHeading>
                      <Button color="tertiary" size="xs" iconLeading={XClose} aria-label={closeLabel} onPress={close} />
                    </div>
                    {description && (
                      <Typography size="sm" className="text-foreground-muted">
                        {description}
                      </Typography>
                    )}
                  </div>
                  {children}
                </>
              )}
            </AriaDialog>
          </MotionModal>
        </MotionModalOverlay>
      )}
    </AnimatePresence>
  );
}

export { Modal, type ModalProps };
