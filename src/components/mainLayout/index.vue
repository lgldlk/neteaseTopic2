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

            <a-dropdown>
              <span class="userBox">
                <a-avatar :src="avatar" />
                {{ username }}
                <DownOutlined />
              </span>
              <template v-slot:overlay>
                <a-menu>
                  <a-menu-item>我是装样子的</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>

          </a-col>
        </a-row>
      </a-layout-header>
      <router-view></router-view>
    </a-layout>
  </a-layout>
</template>
<script >
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import { DownOutlined } from '@ant-design/icons-vue'
import subMenu from './components/subMenu/index.vue'
import { defineComponent, computed, ref } from "vue";
import baseApi from '@/hooks'
export default defineComponent({
  components: {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    subMenu, DownOutlined
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
        return store.getters["user/getRoute"]


      }),
      username = computed(() => {
        return store.getters["user/username"]
      }),
      avatar = computed(() => {
        return store.getters["user/avatar"]
      })


    return {
      routes,
      selectedKeys,
      openKeys, username, avatar,
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
    height: 100vh;
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
      .userBox {
        margin-right: 30px;
        display: block;
        cursor: pointer;
      }
    }
  }
}
</style>