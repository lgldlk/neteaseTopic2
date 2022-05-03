<template>
  <a-layout class="mainLayout">
    <a-layout-sider collapsible
                    class="layout-sider"
                    width="250"
                    v-model:collapsed="collapse"
                    :trigger="null">
      <a-menu class="layout-menu"
              theme="dark"
              mode="inline"
              v-model:selectedKeys="selectedKeys"
              v-model:openKeys="openKeys">
        <a-menu v-model:openKeys="openKeys"
                mode="inline"
                theme="dark"
                :inline-collapsed="collapse"
                class="menu-class">
          <template v-for="item in routes"
                    :key="item.name">

            <template v-if="!item.children">
              <a-menu-item :key="item.name">
                <span>{{ item.meta.title }}</span>
              </a-menu-item>
            </template>
            <template v-else>
              <sub-menu :menu-info="item"
                        :key="item.name" />
            </template>

          </template>
        </a-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout class="layout-inner">
      <a-layout-header class="layout-header">
        <a-row>
          <a-col :xs="12"
                 :sm="12"
                 :md="12"
                 :lg="12"
                 :xl="12">
            <menu-unfold-outlined v-if="collapse"
                                  class="trigger"
                                  @click="toggleCollapse" />
            <menu-fold-outlined v-else
                                class="trigger"
                                @click="toggleCollapse" />
          </a-col>
          <a-col :xs="12"
                 :sm="12"
                 :md="12"
                 :lg="12"
                 :xl="12">

          </a-col>
        </a-row>
      </a-layout-header>
      <router-view></router-view>
    </a-layout>
  </a-layout>
</template>
<script >
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'

import subMenu from './components/subMenu/index.vue'
import { defineComponent, computed, ref } from "vue";
import baseApi from '@/hooks'
export default defineComponent({
  components: {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    subMenu
  },
  setup () {

    let { store } = baseApi()



    const selectedKeys = ref([]),
      openKeys = ref([]),
      collapse = computed(() => {
        return store.getters['system/collapse']
      }),
      toggleCollapse = () => {
        store.commit('system/toggleCollapse')
      },
      routes = computed(() => {
        console.log("🥖 ~ file: index.vue ~ line 73 ~ routes=computed ~ store.getters['user/getRoute']", store.getters["user/getRoute"])
        return store.getters["user/getRoute"]


      })


    return {
      routes,
      selectedKeys,
      openKeys,
      collapse,
      toggleCollapse
    };
  },
});
</script>
<style lang="scss" scoped>
.mainLayout {
  .layout-sider {
    height: 100vh;
    .menu-class {
      color: #fff;
    }
  }
  .layout-collapse {
    & + .layout-layout {
      padding-left: 81px;
      transition: all 0.2s;
    }
  }
  .layout-inner {
    .ant-col + .ant-col {
      display: flex;
      justify-content: flex-end;
      padding: 0 0;
    }
    .layout-header {
      padding: 0;
      background: #fff;
      .trigger {
        font-size: 18px;
        padding: 0 var(--mainPadding);
        line-height: var(--headerHeight);
        cursor: pointer;
        transition: color 0.3s;
        &:hover {
          color: #1890ff;
        }
      }
    }
  }
}
</style>