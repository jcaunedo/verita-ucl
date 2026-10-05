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
import {
  exitTransition,
  modalOverlayVariants,
  modalVariants,
  standardTransition,
  useMotionPreference,
} from "@/lib/motion";
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
  /**
   * Renders `children` alone, filling the surface: no padding, title row, or ×, for a view that brings its own header
   * (e.g. `PreviewEmail`). `title` still names the dialog for screen readers. Switching it while open swaps the
   * whole modal: the current view shrinks out toward the center (`modalVariants.swapOut`), then the new one grows in
   * from it, taking its own width (the bare view's) while hidden, so nothing reflows on screen.
   */
  bare?: boolean;
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
 * (`modalOverlayVariants`) and the surface grows in from the center of the viewport, fading in as it scales from 0.92 to 1 (`modalVariants`). It leaves in
 * reverse, shrinking back to 0.92 toward the center as it fades, while the scrim fades, both over a slow 600ms
 * (`modalExitTransition`, design direction 2026-10-02/03); reduced motion keeps only the fades. `AnimatePresence`
 * keeps the modal mounted until its exit finishes. Toggling `bare` swaps the whole modal for another view: the
 * surface shrinks out toward the center and the new view grows back from it (design direction, 2026-10-05). It's the
 * same surface and dialog throughout, so focus stays inside. When the content changes height (e.g. a modal swapping
 * views), the surface glides to its new centered position (`layout="position"` on `standardTransition`) instead of
 * jumping; off under reduced motion. The scrim is
 * `--overlay` (neutral-800 at 18%) over a 1px background blur (`backdrop-blur-overlay`), Figma's `Overlay` component
 * (verita.ds `node-id=6072-11956`). The blur fades in and out with the scrim's opacity.
 */
function Modal({
  isOpen,
  onOpenChange,
  title,
  description,
  closeLabel = "Close",
  isDismissable = true,
  bare = false,
  children,
  className,
}: ModalProps) {
  const { prefersReducedMotion } = useMotionPreference();
  const fadeOnly = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    swapOut: { opacity: 0, transition: exitTransition },
  };
  // The view on screen: follows `bare` once the old view has shrunk out, and at once on opening.
  const [shownBare, setShownBare] = React.useState(bare);
  const [wasOpen, setWasOpen] = React.useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    setShownBare(bare);
  }
  const isSwapping = bare !== shownBare;
  // From the swap until the new view has grown in. The position glide is off meanwhile: the new view's size differs,
  // and the glide would slide it in from the old view's corner instead of growing it from the center.
  const [isGrowing, setGrowing] = React.useState(false);
  // While the old view shrinks out, it keeps showing what it showed: the consumer has already moved on to the new one.
  const shownContent = React.useRef({ title, description, children });
  if (!isSwapping) shownContent.current = { title, description, children };
  const content = shownContent.current;

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
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-overlay p-4 backdrop-blur-overlay"
        >
          <MotionModal
            data-slot="modal"
            variants={prefersReducedMotion ? fadeOnly : modalVariants}
            layout={prefersReducedMotion || isSwapping || isGrowing ? false : "position"}
            transition={{ layout: standardTransition }}
            initial="initial"
            animate={isSwapping ? "swapOut" : "animate"}
            exit="exit"
            // The old view has shrunk out: show the new one, which `animate` then grows in. Swapping back before this
            // (e.g. a quick second click) just grows the old view back.
            onAnimationComplete={(definition) => {
              if (definition === "swapOut") {
                setShownBare(bare);
                setGrowing(true);
              } else if (definition === "animate") {
                setGrowing(false);
              }
            }}
            className={cn(
              "w-full max-w-[560px] overflow-hidden rounded-popover bg-background shadow-modal outline-none",
              shownBare && "w-auto max-w-full",
              className,
            )}
          >
            <AriaDialog data-slot="modal-dialog" className="outline-none">
              {({ close }) => (
                <div className={shownBare ? "flex flex-col" : "flex flex-col items-start gap-6 p-8"}>
                  {shownBare ? (
                    <>
                      <AriaHeading slot="title" className="sr-only">
                        {content.title}
                      </AriaHeading>
                      {content.children}
                    </>
                  ) : (
                    <>
                      <div className="flex w-full flex-col items-start gap-4">
                        <div className="flex w-full items-center justify-between gap-4">
                          <AriaHeading
                            slot="title"
                            className={cn(typographyVariants({ size: "2xl", weight: "semibold" }), "text-foreground")}
                          >
                            {content.title}
                          </AriaHeading>
                          <Button
                            color="tertiary"
                            size="xs"
                            iconLeading={XClose}
                            aria-label={closeLabel}
                            onPress={close}
                          />
                        </div>
                        {content.description && (
                          <Typography size="sm" className="text-foreground-muted">
                            {content.description}
                          </Typography>
                        )}
                      </div>
                      {content.children}
                    </>
                  )}
                </div>
              )}
            </AriaDialog>
          </MotionModal>
        </MotionModalOverlay>
      )}
    </AnimatePresence>
  );
}

export { Modal, type ModalProps };
