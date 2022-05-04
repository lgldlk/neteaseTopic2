<template>
  <div class="fill testFormCon">
    <a-row class="height100pre">

      <a-col :span="7"
             class="innerCon leftBox column">
        <div class="leftBox-top row">
          <a-select show-search
                    class="fill"
                    placeholder="选择添加类型"
                    :options="typeOptions"
                    @change="typeSelectChange"
                    :filter-option="filterTypeOption"></a-select>
          <a-button type="primary"
                    :disabled="!modelInfo.value"
                    @click="addInfo">添加</a-button>
        </div>
        <div class="fill height100pre leftBox-center">
          <div>
            颜色
            <a-divider type="vertical" />
            <a-list item-layout="horizontal"
                    :data-source="colorResultList">
              <template #renderItem="{ item }">
                <a-list-item>
                  <template #actions>
                    <a-button @click="editItem(item)">编辑</a-button>
                    <a-button @click="deleteItem(item)"
                              danger>删除</a-button>

                  </template>
                  <a-list-item-meta>
                    <template #title>
                      {{ item.text }}
                    </template>
                    <template #avatar>
                      <div class="showColorBox"
                           :style="{ background: item.value }"></div>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </div>
          <div>
            图片
            <a-divider type="vertical" />
            <a-list item-layout="horizontal"
                    :data-source="imageResultList">
              <template #renderItem="{ item }">
                <a-list-item>
                  <template #actions>
                    <a-button @click="editItem(item)">编辑</a-button>

                    <a-button @click="deleteItem(item)"
                              danger>删除</a-button>

                  </template>
                  <a-list-item-meta>
                    <template #title>
                      {{ item.text }}
                    </template>
                    <template #avatar>
                      <img class="showImgBox"
                           :src="item.src" />
                    </template>

                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </div>
        </div>
        <div class="leftBox-bottom">
          <a-button @click="clearForm">清空</a-button>
          <a-button type="primary"
                    @click="sendForm">提交</a-button>
        </div>
      </a-col>

      <a-col class="innerCon rightBox"
             :span="16"
             :offset="1">

        <JSONViewer class="showJsonBox "
                    :value="jsonData"
                    :expand-depth="5"
                    copyable>

        </JSONViewer>

      </a-col>
    </a-row>

    <a-modal v-model:visible="addModelVisible"
             :title="modelInfo.title"
             cancelText="取消"
             :okText="editMod == 0 ? '添加' : '修改'"
             @ok="addConfirm"
             @cancel="cancelConfirm"
             class="addModal">
      <a-form :model="imageForm"
              :label-col="{ span: 8 }"
              v-if="modelInfo.value == 'image'"
              :wrapper-col="{ span: 16 }"
              ref="imageFormRef"
              autocomplete="off">

        <a-form-item label="属性名"
                     name="attributeName"
                     :rules="imageFormRule.attributeName">
          <a-input v-model:value="imageForm.attributeName" />
        </a-form-item>

        <a-form-item label="图片名"
                     name="text"
                     :rules="imageFormRule.text">
          <a-input v-model:value="imageForm.text" />
        </a-form-item>
        <a-form-item label="图片上传"
                     name="src"
                     :rules="imageFormRule.src">
          <a-upload list-type="picture"
                    action=''
                    accept=".jpg, .png"
                    :limit="1"
                    :maxCount="1"
                    :showUploadList="false"
                    :auto-upload="false"
                    :customRequest="getFile"
                    class="upload-list-inline">
            <img v-if="imageForm.src"
                 :src="imageForm.src"
                 style="height:104px;max-width:300px" />
            <a-button v-else>
              <UploadOutlined />
              上传图片
            </a-button>

          </a-upload>
        </a-form-item>
        <a-form-item label="图片宽度"
                     name="width"
                     :rules="imageFormRule.width">
          <a-input v-model:value="imageForm.width" />
        </a-form-item>
        <a-form-item label="图片高度"
                     name="height"
                     :rules="imageFormRule.height">
          <a-input v-model:value="imageForm.height" />
        </a-form-item>
      </a-form>

      <a-form :model="colorForm"
              :label-col="{ span: 8 }"
              v-if="modelInfo.value == 'color'"
              :wrapper-col="{ span: 16 }"
              ref="colorFormRef"
              autocomplete="off">

        <a-form-item label="属性名"
                     name="attributeName"
                     :rules="colorFormRule.attributeName">
          <a-input v-model:value="colorForm.attributeName" />
        </a-form-item>

        <a-form-item label="颜色名"
                     name="text"
                     :rules="colorFormRule.text">
          <a-input v-model:value="colorForm.text" />
        </a-form-item>
        <a-form-item label="颜色值"
                     name="value"
                     :rules="colorFormRule.value">
          <input type="color"
                 class="colorPicker"
                 @input="colorFormValueChange" />

          {{ colorForm.value }}
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script >
import { defineComponent, ref, computed } from 'vue'
import 'vue-json-viewer/style.css'
import JSONViewer from 'vue-json-viewer'
import { sendFile } from '@/api/img'
import { isCSSText } from '@/utils/verify'
import { debounce } from '@/utils'
import { UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
export default defineComponent({
  name: '',
  components: { JSONViewer, UploadOutlined },
  setup () {

    //左上方选择框
    const typeOptions = ref([
      { value: 'color', label: '颜色(color)' },
      { value: 'image', label: '图片(image)' },
    ]);
    const modelInfo = ref({
      value: undefined,
      title: ""
    }),
      filterTypeOption = (input, option) => {
        return option.label.indexOf(input) >= 0 || option.value.indexOf(input) >= 0;
      }, typeSelectChange = (value, option) => {
        console.log("🥖 ~ file: index.vue ~ line 70 ~ setup ~ value,option", value, option)
        modelInfo.value.value = option.value;
        modelInfo.value.title = option.label
      }


    //弹窗表单
    const addModelVisible = ref(false),
      addInfo = () => {
        addModelVisible.value = true
        editMod.value == 0
      },
      colorResultList = ref([]),
      colorForm = ref({
        attributeName: "",
        text: "",
        value: "#000"
      }),
      colorFormRule = {
        attributeName: [{ required: true, message: '请输入这个属性的属性名' }, {
          validator: (rule, val) => {
            //重复的属性名不能重复添加 再修改时不能修改为别的属性名
            const array = colorResultList.value
            for (let index = 0; index < array.length; index++) {
              const element = array[index];
              if (editIndex === null) {
                if (val == element.attributeName) {
                  return Promise.reject("已有的属性名不能重复添加")
                }
              } else {
                if (editIndex != index && val == element.attributeName) {
                  return Promise.reject("已有的属性名不能重复添加")
                }
              }
            }
            return Promise.resolve()
          }
        }],
        text: [{ required: true, message: '请输入这个颜色的颜色名' }],
        value: [{
          required: true,
        },]
      },
      colorFormValueChange = (event) => {
        // 增加防抖逻辑减少页面重绘量
        debounce(() => {
          colorForm.value.value = event.target.value
        }, 100)
      },
      colorFormRef = ref()
    const imageForm = ref({
      attributeName: "",
      text: "",
      src: "",
      width: "",
      height: ""
    }),
      imageFormRef = ref(),
      imageResultList = ref([]),
      imageFormRule = {
        attributeName: [{ required: true, message: '请输入这个属性的属性名' }, {
          validator: (rule, val) => {
            //重复的属性名不能重复添加 再修改时不能修改为别的属性名
            const array = imageResultList.value
            for (let index = 0; index < array.length; index++) {
              const element = array[index];
              console.log("🥖 ~ file: index.vue ~ line 286 ~ setup ~ editIndex", editIndex, index, element)
              if (editIndex === null) {
                if (val == element.attributeName) {
                  return Promise.reject("已有的属性名不能重复添加")
                }
              } else {
                if (editIndex != index && val == element.attributeName) {
                  return Promise.reject("已有的属性名不能重复添加")
                }
              }
            }
            return Promise.resolve()
          }
        }],
        text: [{ required: true, message: '请输入这个图片的图片名' }],
        src: [{
          required: true,
          message: ''
        },
        {
          validator: () => {
            //判断路径是否正确这里模拟用的，暂时注释
            // if (isUrl(val)) {
            //   return  Promise.resolve()
            // }
            // else {
            //   return  Promise.reject("链接有误")
            // }
            return Promise.resolve();
          }
        }
        ],
        width: [{
          required: true, message: '请输入这个图片的宽度'
        },
        {
          validator: (rule, val) => {

            if (!isCSSText(val)) {
              return Promise.reject("请输入正确的css宽高表达式")
            } else {
              return Promise.resolve();

            }
          }
        }
        ],
        height: [{
          required: true, message: '请输入这个图片的高度'

        },
        {
          validator: (rule, val) => {

            if (!isCSSText(val)) {
              return Promise.reject("请输入正确的css宽高表达式")
            } else {
              return Promise.resolve();

            }
          }
        }],
      },

      getFile = async ({ file }) => {
        let res = await sendFile(file)
        imageForm.value.src = res
        message.success("上传成功");

        //上传后若没写过宽高则赋予100%
        if (!imageForm.value.width) {
          imageForm.value.width = "100%"

        }

        if (!imageForm.value.height) {
          imageForm.value.height = "100%"

        }
      }


    let editMod = ref(0),//0是添加,1是修改
      beforeModelInfo = {},//记录修改前的弹窗信息
      editIndex = null
    const addConfirm = () => {
      if (editMod.value == 0) {
        if (modelInfo.value.value == 'color') {//判断是颜色类型的添加
          colorFormRef.value.validateFields().then(res => {
            console.log(res);
            res.type = modelInfo.value.value
            colorResultList.value.push(res)


            colorFormRef.value.resetFields()
            addModelVisible.value = false
          })
        } else if (modelInfo.value.value == 'image') {//判断是图片类型的添加
          imageFormRef.value.validateFields().then(res => {
            console.log(res);
            res.type = modelInfo.value.value
            imageResultList.value.push(res)


            imageFormRef.value.resetFields()
            addModelVisible.value = false
          })
        }
      } else if (editMod.value == 1) {

        if (modelInfo.value.value == 'color') {//判断是颜色类型的修改
          colorFormRef.value.validateFields().then((res) => {
            res.type = modelInfo.value.value
            colorResultList.value[editIndex] = res
            colorFormRef.value.resetFields()
            addModelVisible.value = false
            editIndex = null

          })
        } else if (modelInfo.value.value == 'image') {//判断是图片类型的修改
          imageFormRef.value.validateFields().then(res => {
            console.log(res);
            res.type = modelInfo.value.value
            imageResultList.value[editIndex] = res
            imageFormRef.value.resetFields()
            addModelVisible.value = false


            addModelVisible.value = false
            editIndex = null
          })

        }
        modelInfo.value = beforeModelInfo

      }

    },
      cancelConfirm = () => {//取消弹窗

        if (editMod.value == 1) {

          imageFormRef.value && imageFormRef.value.resetFields()
          colorFormRef.value && colorFormRef.value.resetFields()
          modelInfo.value = beforeModelInfo
          editMod.value = 0
          editIndex = null
        }
      },
      editItem = (item) => {//编辑某项

        editMod.value = 1
        beforeModelInfo = JSON.parse(JSON.stringify(modelInfo.value))
        modelInfo.value.value = item.type
        if (item.type == "image") {
          modelInfo.value.title = "修改图片信息"

          imageForm.value = JSON.parse(JSON.stringify(item))
          addModelVisible.value = true
          const array = imageResultList.value
          for (let index = 0; index < array.length; index++) {

            const element = array[index];
            console.log("🥖 ~ file: index.vue ~ line 438 ~ setup ~ array", element.attributeName)

            if (element.attributeName == item.attributeName) {

              editIndex = index
              break
            }
          }
        } else if (item.type == "color") {
          modelInfo.value.title = "修改颜色信息"
          colorForm.value = JSON.parse(JSON.stringify(item))
          addModelVisible.value = true
          const array = colorResultList.value
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (element.attributeName == item.attributeName) {

              editIndex = index
              break

            }
          }
        }

      },
      deleteItem = (item) => {//删除某项
        if (item.type == "image") {
          imageResultList.value = imageResultList.value.filter(item => item.attributeName != item.attributeName)
        } else if (item.type == "color") {
          colorResultList.value = colorResultList.value.filter(item => item.attributeName != item.attributeName)
        }
      },
      clearForm = () => {//清空表单
        imageResultList.value = []
        colorResultList.value = []
      },
      sendForm = () => {//模拟提交表单
        console.log(jsonData.value);
        message.success("提交成功");
      }



    const jsonData = computed(() => {
      let tmpObj = { color: {}, theme: {} }
      colorResultList.value.map(item => {
        tmpObj.color[item.attributeName] = {};

        tmpObj.color[item.attributeName].type = "color"
        tmpObj.color[item.attributeName].text = item.text
        tmpObj.color[item.attributeName].value = item.value

      })
      imageResultList.value.map(item => {
        tmpObj.theme[item.attributeName] = {};

        tmpObj.theme[item.attributeName].type = "image"
        tmpObj.theme[item.attributeName].text = item.text
        tmpObj.theme[item.attributeName].value = {
          src: item.src,
          width: item.width,
          height: item.height
        }

      })
      return tmpObj
    })
    return {
      editItem,
      getFile,
      imageResultList,
      cancelConfirm, editMod,
      sendForm,
      clearForm,
      imageFormRule,
      imageFormRef,
      typeSelectChange, addInfo,
      colorFormValueChange,
      addConfirm,
      colorFormRef,
      deleteItem,
      colorFormRule,
      imageForm,
      colorForm,
      colorResultList,
      modelInfo,
      filterTypeOption,
      addModelVisible,
      typeOptions,
      jsonData
    }
  }

})
</script>
<style scoped lang='scss'>
.testFormCon {
  padding: 20px;

  overflow: auto;
}

.innerCon {
  background: #fff;
  box-shadow: 1px 1px 20px rgba(0, 0, 0, 0.319);
  border-radius: 4px;
  height: 100%;
}

.leftBox {
  &-top {
    padding: 10px;

    * {
      margin-right: 10px;
    }
  }

  &-bottom {
    padding: 10px;
    text-align: right;

    * {
      margin-right: 10px;
    }
  }
}

.leftBox-center {
  overflow: auto;
  padding: 10px;
  width: 100%;

  .showColorBox {
    width: 30px;
    height: 30px;
  }

  .showImgBox {
    width: 160px;
  }
}

.rightBox {
  overflow: auto;

  .showJsonBox {
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
    overflow: auto;
  }
}

.addModal {
  .colorPicker {
    border: 0;
    padding: 0;
  }
}
</style>