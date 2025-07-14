<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { PropType } from 'vue'

interface IconAnimation {
  pulse?: boolean
  spin?: boolean
  bounce?: boolean
  shake?: boolean
  beat?: boolean
  fade?: boolean
  beatFade?: boolean
  spinPulse?: boolean
  spinReverse?: boolean
}

type ButtonColor =
  | 'primary'
  | 'link'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'dark'
  | 'light'
  | 'white'
  | 'black'
  | 'text'
  | 'transparent'
  | undefined

type ButtonSize = 'small' | 'normal' | 'medium' | 'large' | undefined
type IconPosition = 'left' | 'right'
type IconSize = 'small' | 'normal' | 'medium' | 'large'
type SpacingSize = '0' | '1' | '2' | '3' | '4' | '4p5' | '5' | '5p5' | '6' | '8p5' | 'auto'


const props = defineProps({
  // Button styling
  color: {
    type: String as () => ButtonColor,
    default: undefined,
  },
  size: {
    type: String as () => ButtonSize,
    default: undefined,
  },
  outlined: Boolean,
  rounded: Boolean,
  inverted: Boolean,
  focused: Boolean,
  active: Boolean,
  loading: Boolean,
  static: Boolean,
  fullWidth: Boolean,
  disabled: Boolean,

  // Padding
  padding: {
    type: String as () => SpacingSize,
    default: undefined,
  },
  px: {
    type: String as () => SpacingSize,
    default: undefined,
  },
  py: {
    type: String as () => SpacingSize,
    default: undefined,
  },
  pl: {
    type: String as () => SpacingSize,
    default: undefined,
  },
  pr: {
    type: String as () => SpacingSize,
    default: undefined,
  },
  pt: {
    type: String as () => SpacingSize,
    default: undefined,
  },
  pb: {
    type: String as () => SpacingSize,
    default: undefined,
  },

  // Margin between icon and text
  iconGap: {
    type: String as () => SpacingSize,
    default: '3',
  },

  // Icon
  icon: String,
  iconPosition: {
    type: String as () => IconPosition,
    default: 'left',
  },
  iconAnimate: {
    type: Object as PropType<IconAnimation>,
      default: () => ({})
  },
  iconSize: {
    type: String as () => IconSize,
    default: undefined,
  },
  labelSize: {
    type: String as () => SpacingSize,
    default: undefined,
  },
  iconColor: {
    type: String as () => ButtonColor,
    default: undefined,
  },
  labelColor: {
    type: String as () => ButtonColor,
    default: undefined,
  },
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const showIcon = computed(() => props.icon || !!useSlots().icon)

const buttonClasses = computed(() => ({
  [`is-${props.color}`]: props.color,
  [`is-${props.size}`]: props.size,
  'is-outlined': props.outlined,
  'is-rounded': props.rounded,
  'is-inverted': props.inverted,
  'is-focused': props.focused,
  'is-active': props.active,
  'is-loading': props.loading,
  'is-static': props.static,
  'is-fullwidth': props.fullWidth,
  'is-rounded-4': !props.rounded,
}))

const paddingClasses = computed(() => ({
  [`p-${props.padding}`]: props.padding,
  [`px-${props.px}`]: props.px,
  [`py-${props.py}`]: props.py,
  [`pl-${props.pl}`]: props.pl,
  [`pr-${props.pr}`]: props.pr,
  [`pt-${props.pt}`]: props.pt,
  [`pb-${props.pb}`]: props.pb,
}))

const iconMarginClasses = computed(() => ({
  [`ml-${props.iconGap}`]: props.iconPosition === 'right' && showIcon.value,
  [`mr-${props.iconGap}`]: props.iconPosition === 'left' && showIcon.value,
}))

const iconSizeClass = computed(() => ({
  [`is-${props.iconSize}`]: props.iconSize,
}))

// Computed object to extract just the truthy animations
const activeAnimations = computed(() => {
  console.log(props.iconAnimate)
  return Object.entries(props.iconAnimate)
    .filter(([_, value]) => value)
    .map(([key]) => key);
});

const labelSizeClass = computed(() => ({
  [`is-size-${props.labelSize}-touch`]: props.labelSize,
}))

const iconColorCSS = computed(() => 
  `var(--bulma-${props.iconColor})`
)

const labelColorClass = computed(() => ({
  [`has-text-${props.labelColor}`]: props.labelColor,
}))
</script>

<template>
  <button
    class="button"
    :class="[buttonClasses, paddingClasses]"
    :disabled="disabled || loading"
    @click="emit('click', $event)"
  >
    <template v-if="iconPosition === 'left'">
      <span v-if="showIcon" class="icon" :class="[iconSizeClass, iconMarginClasses]">
        <slot name="icon">
          <font-awesome-icon v-if="icon" :icon="icon" />
        </slot>
      </span>
      <span v-if="$slots.default" class="is-family-secondary" :class="[labelColorClass, labelSizeClass]">
        <!-- label goes here-->
        <slot />
      </span>
    </template>

    <template v-else>
      <span v-if="$slots.default" class="is-family-secondary" :class="[labelColorClass, labelSizeClass]">
        <!-- label goes here-->
        <slot />
      </span>
      <span v-if="showIcon" class="icon" :class="[iconSizeClass, iconMarginClasses]">
        <slot name="icon">
          <!-- <font-awesome-icon v-if="icon" :icon="icon" :class="activeAnimations"/> -->
          <!-- <font-awesome-icon v-if="icon" :icon="icon" beatFade /> -->
          <font-awesome-icon v-if="icon" :icon="icon" />
        </slot>
      </span>
    </template>
  </button>
</template>

<style scoped>
  :slotted(svg) {
    color: v-bind(iconColorCSS)
  }
</style>
