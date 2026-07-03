import type {
  ScrollIntoViewOptions,
  ScrollStatus,
  ScrollToOptions,
  Scrollbar,
  ScrollbarOptions,
  ScrollbarPluginConstructor,
} from "./smooth-scrollbar.types"

export type SmoothScrollbarOptions = Partial<
  Pick<
    ScrollbarOptions,
    | "damping"
    | "thumbMinSize"
    | "renderByPixels"
    | "alwaysShowTracks"
    | "continuousScrolling"
    | "delegateTo"
    | "plugins"
  >
>

export type InfiniteLoadingPayload = {
  loaded: () => void
  completed: () => void
}

export type SmoothScrollbarProps = {
  infiniteLoading?: boolean
  loadThreshold?: number
  options?: SmoothScrollbarOptions
  plugins?: ScrollbarPluginConstructor[]
}

export type SmoothScrollbarEmits = {
  loading: [payload: InfiniteLoadingPayload]
  endy: []
  endX: []
  scroll: [status: ScrollStatus]
}

export type SmoothScrollbarExpose = {
  getLimit: (
    axis?: "x" | "y" | "",
  ) => ScrollStatus["limit"] | number | undefined
  getOffset: (
    axis?: "x" | "y" | "",
  ) => ScrollStatus["offset"] | number | undefined
  scrollTo: (
    x?: number,
    y?: number,
    duration?: number,
    options?: Partial<ScrollToOptions>,
  ) => void
  scrollIntoView: (
    elem: HTMLElement,
    options?: Partial<ScrollIntoViewOptions>,
  ) => void
  isVisible: (elem: HTMLElement) => boolean
  addListener: (listener: (status: ScrollStatus) => void) => void
  removeListener: (listener: (status: ScrollStatus) => void) => void
  removeAllListeners: () => void
  update: () => void
  setLoaded: () => void
  setCompleted: () => void
  resetInfLoad: () => void
  focus: () => void
  blur: () => void
  scrollBar: Scrollbar | null
}
