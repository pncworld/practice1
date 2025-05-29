<template>
  <div id="toolbar">
    <span class="ql-formats">
      <select class="ql-size">
        <option
          v-for="val in fontSize"
          :key="val"
          :value="val"
          :selected="val === defaultSize">
          {{ val.replace(/[^0-9]/g, "") }}
        </option>
      </select>
    </span>
  </div>

  <quill-editor
    v-model:content="content"
    theme="snow"
    :options="editorOption" />
</template>

<script setup>
import { ref } from "vue";
import { quillEditor } from "vue3-quill";
import Quill from "quill";
import Toolbar from "quill/modules/toolbar";
import "quill/dist/quill.snow.css";

Quill.register("modules/toolbar", Toolbar);
const fontSize = ["12px", "14px", "16px", "18px", "20px", "24px"];
const defaultSize = "16px";

const Size = Quill.import("attributors/style/size");
Size.whitelist = fontSize;
Quill.register(Size, true);

const content = ref("");

const editorOption = {
  placeholder: "place holder test",
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // <strong>, <em>, <u>, <s>
      ["blockquote", "code-block"], // <blockquote>, <pre class="ql-syntax" spellcheck="false">
      [{ header: 1 }, { header: 2 }], // <h1>, <h2>
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // <sub>, <sup>
      [{ indent: "-1" }, { indent: "+1" }], // class제어
      [{ direction: "rtl" }], //class 제어
      [{ size: Size.whitelist }], // 글자 크기 (class 제어)
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // <h1>~<h6>, normal
      [{ font: [] }], // 글꼴 class로 제어
      [{ color: [] }, { background: [] }], // 글자색, 배경색 style 제어
      [{ align: [] }], // 정렬 class 제어
      ["link", "image", "video"], // 링크, 이미지, 비디오
      // ["clean"], // 필요 시 사용
    ],
    syntax: {
      highlight: (text) => hljs.highlightAuto(text).value,
    },
  },
};
</script>

<style>
.ql-size-12 {
  font-size: 12px;
}
.ql-size-14 {
  font-size: 14px;
}
.ql-size-16 {
  font-size: 16px;
}
.ql-size-18 {
  font-size: 18px;
}
.ql-size-20 {
  font-size: 20px;
}
.ql-size-24 {
  font-size: 24px;
}
</style>
