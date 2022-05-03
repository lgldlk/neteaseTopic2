<template>
  <a-sub-menu :key="menuInfo.name"
              v-bind="$attrs">
    <template #title>
      <span>

        <span>{{ menuInfo.meta.title }}</span>
      </span>
    </template>
    <template v-for="item in menuInfo.children"
              :key="item.name">

      <template v-if="!item.children">
        <a-menu-item :key="item.name">

          <span>
            {{ item.meta.title }}
          </span>
        </a-menu-item>
      </template>
      <template v-else>
        <sub-menu :menu-info="item"
                  :key="item.name" />
      </template>

    </template>
  </a-sub-menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Menu } from "ant-design-vue";

export default defineComponent({
  name: "SubMenu",
  components: {},
  props: {
    ...Menu.SubMenu.props,
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
});
</script>

<style lang="scss" scoped></style>

