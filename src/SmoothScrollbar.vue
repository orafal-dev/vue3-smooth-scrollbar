<script setup lang="ts">
import SmoothScrollbarLib from "smooth-scrollbar"
import { onBeforeUnmount, onMounted, onUpdated, ref, watch } from "vue"
import {
  checkLoadCapability,
  debounce,
  defaultsDeep,
  getScrollState,
} from "./helpers"
import type {
  InfiniteLoadingPayload,
  SmoothScrollbarOptions,
} from "./SmoothScrollbar.types"
import type {
  ScrollStatus,
  Scrollbar,
  ScrollbarPluginConstructor,
} from "./smooth-scrollbar.types"
import type {
  ScrollIntoViewOptions,
  ScrollToOptions,
} from "./smooth-scrollbar.types"

const Event = {
  loading: "loading",
  endY: "endy",
  endX: "endX",
  scroll: "scroll",
} as const

const defaultOptions: Required<SmoothScrollbarOptions> = {
  damping: 0.1,
  thumbMinSize: 20,
  renderByPixels: true,
  alwaysShowTracks: false,
  continuousScrolling: false,
  delegateTo: null,
  plugins: {},
}

const props = withDefaults(
  defineProps<{
    infiniteLoading?: boolean
    loadThreshold?: number
    options?: SmoothScrollbarOptions
    plugins?: ScrollbarPluginConstructor[]
  }>(),
  {
    infiniteLoading: false,
    loadThreshold: 50,
    options: () => ({}),
    plugins: () => [],
  },
)

const emit = defineEmits<{
  loading: [payload: InfiniteLoadingPayload]
  endy: []
  endX: []
  scroll: [status: ScrollStatus]
}>()

const resolve = ref(true)
const loading = ref(false)
const completed = ref(false)
const scrollBar = ref<Scrollbar | null>(null)
const listeners = ref<Array<(status: ScrollStatus) => void>>([])
const containerRef = ref<HTMLElement | null>(null)

const getLimit = (axis: "x" | "y" | "" = "") =>
  getScrollState(scrollBar.value, axis, "limit")

const getOffset = (axis: "x" | "y" | "" = "") =>
  getScrollState(scrollBar.value, axis, "offset")

const scrollTo = (
  x = 0,
  y = 0,
  duration = 300,
  options: Partial<ScrollToOptions> = {},
) => {
  scrollBar.value?.scrollTo(x, y, duration, options)
}

const scrollIntoView = (
  elem: HTMLElement,
  options: Partial<ScrollIntoViewOptions> = {},
) => {
  scrollBar.value?.scrollIntoView(elem, options)
}

const isVisible = (elem: HTMLElement) =>
  scrollBar.value?.isVisible(elem) ?? false

const addListener = (listener: (status: ScrollStatus) => void) => {
  listeners.value.push(listener)
  scrollBar.value?.addListener(listener)
}

const removeListener = (listener: (status: ScrollStatus) => void) => {
  listeners.value = listeners.value.filter((attached) => {
    if (attached === listener) {
      scrollBar.value?.removeListener(listener)
    }

    return attached !== listener
  })
}

const removeAllListeners = () => {
  listeners.value.forEach((listener) => {
    scrollBar.value?.removeListener(listener)
  })
  listeners.value = []
}

const update = () => {
  scrollBar.value?.update()
}

const emitLoad = () => {
  emit(Event.loading, {
    loaded: () => setLoaded(),
    completed: () => setCompleted(),
  })
}

const setLoaded = () => {
  resolve.value = true
  loading.value = false
  completed.value = false

  queueMicrotask(() => {
    const limitY = getLimit("y")
    const offsetY = getOffset("y")

    if (
      typeof limitY === "number" &&
      typeof offsetY === "number" &&
      checkLoadCapability(limitY, offsetY, props.loadThreshold)
    ) {
      emitLoad()
    }
  })
}

const setCompleted = () => {
  resolve.value = false
  loading.value = false
  completed.value = true
}

const resetInfLoad = () => {
  resolve.value = true
  loading.value = false
  completed.value = false
}

const debounceLoad = debounce(() => {
  if (resolve.value) {
    resolve.value = false
    loading.value = true
    emitLoad()
  }
}, 300)

const focus = () => {
  scrollBar.value?.containerEl.focus()
}

const blur = () => {
  scrollBar.value?.containerEl.blur()
}

const initScrollbar = () => {
  const view = containerRef.value
  if (!view) {
    return
  }

  if (props.plugins.length) {
    props.plugins.forEach((plugin) => {
      SmoothScrollbarLib.use(plugin)
    })
  }

  scrollBar.value = SmoothScrollbarLib.init(
    view,
    defaultsDeep({ ...defaultOptions }, props.options),
  )

  addListener((status) => {
    if (!props.infiniteLoading) return
    if (loading.value || completed.value) return

    const { limit, offset } = status
    const canLoad = checkLoadCapability(limit.y, offset.y, props.loadThreshold)
    resolve.value = canLoad

    if (!completed.value) {
      if (canLoad) {
        debounceLoad()
      }
    } else {
      loading.value = false
    }
  })

  addListener((status) => {
    const { limit, offset } = status

    if (limit.y > 0 && limit.y === offset.y) {
      emit(Event.endY)
    }

    if (limit.x > 0 && limit.x === offset.x) {
      emit(Event.endX)
    }

    emit(Event.scroll, status)
  })

  if (props.infiniteLoading) {
    emitLoad()
  }
}

onMounted(() => {
  queueMicrotask(initScrollbar)
})

onUpdated(() => {
  scrollBar.value?.update()
})

watch(
  () => props.options,
  () => {
    update()
  },
  { deep: true },
)

onBeforeUnmount(() => {
  if (scrollBar.value !== null) {
    removeAllListeners()
    scrollBar.value.destroy()
    scrollBar.value = null
  }
})

defineExpose({
  getLimit,
  getOffset,
  scrollTo,
  scrollIntoView,
  isVisible,
  addListener,
  removeListener,
  removeAllListeners,
  update,
  setLoaded,
  setCompleted,
  resetInfLoad,
  focus,
  blur,
  scrollBar,
})
</script>

<template>
  <div
    ref="containerRef"
    class="c-scroll-view"
    data-scrollbar
    @mouseenter="focus"
  >
    <div class="c-scroll-view__content">
      <slot />
    </div>
  </div>
</template>
