import type SmoothScrollbar from "smooth-scrollbar"

export type {
  ScrollIntoViewOptions,
  ScrollListener,
  ScrollStatus,
  ScrollToOptions,
  Scrollbar,
  ScrollbarOptions,
} from "smooth-scrollbar/interfaces/scrollbar"

export type ScrollbarPluginConstructor = Parameters<
  typeof SmoothScrollbar.use
>[0]
