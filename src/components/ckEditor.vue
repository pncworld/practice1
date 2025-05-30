<template>
  <div class="main-container !w-full">
    <div
      class="editor-container editor-container_document-editor editor-container_include-fullscreen !w-full"
      ref="editorContainerElement">
      <div class="editor-container__menu-bar" ref="editorMenuBarElement"></div>
      <div class="editor-container__toolbar" ref="editorToolbarElement"></div>
      <div class="editor-container__editor-wrapper !w-full">
        <div class="editor-container__editor !w-full">
          <div ref="editorElement">
            <ckeditor
              v-if="editor && config"
              :modelValue="config.initialData"
              v-model="editorData"
              :editor="editor"
              :config="config"
              @ready="onReady" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/#installation/NoDgNARATAdAbDADBSBGA7AViiE6r6ZwCcxcAzHInHOsYuZgCwNOa74jubqKpwoIAawD2KcmGCow0xDPmIAupEwBTSuQBmmCIqA=
 */

import { computed, ref, onMounted, useTemplateRef } from "vue";
import { Ckeditor } from "@ckeditor/ckeditor5-vue";

import {
  DecoupledEditor,
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  Base64UploadAdapter,
  Bold,
  Code,
  Emoji,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Fullscreen,
  Heading,
  HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageEditing,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  ImageUtils,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Mention,
  PageBreak,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SimpleUploadAdapter,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
} from "ckeditor5";

import translations from "ckeditor5/translations/ko.js";

import "ckeditor5/ckeditor5.css";
import { watch } from "vue";

/**
 * Create a free account with a trial: https://portal.ckeditor.com/checkout?plan=free
 */
const LICENSE_KEY = "GPL"; // or <YOUR_LICENSE_KEY>.

const editorToolbar = useTemplateRef("editorToolbarElement");
const editorMenuBar = useTemplateRef("editorMenuBarElement");

const isLayoutReady = ref(false);

const editor = DecoupledEditor;
const props = defineProps({
  content: {
    type: String,
    default: "여기에 입력하세요.",
  },
});

onMounted(() => {
  editorData.value = props.content;
});
const config = computed(() => {
  if (!isLayoutReady.value) {
    return null;
  }

  return {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "link",
        "insertImage",
        "insertTable",
        "|",
        "alignment",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "outdent",
        "indent",
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      Alignment,
      Autoformat,
      AutoImage,
      AutoLink,
      Autosave,
      BalloonToolbar,
      Base64UploadAdapter,
      Bold,
      Code,
      Emoji,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      Fullscreen,
      Heading,
      HorizontalLine,
      ImageBlock,
      ImageCaption,
      ImageEditing,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      ImageUtils,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      Mention,
      PageBreak,
      Paragraph,
      PasteFromOffice,
      RemoveFormat,
      SimpleUploadAdapter,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
    ],
    balloonToolbar: [
      "bold",
      "italic",
      "|",
      "link",
      "insertImage",
      "|",
      "bulletedList",
      "numberedList",
    ],
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, "default", 18, 20, 22],
      supportAllValues: true,
    },
    fullscreen: {
      onEnterCallback: (container) =>
        container.classList.add(
          "editor-container",
          "editor-container_document-editor",
          "editor-container_include-fullscreen",
          "main-container"
        ),
    },
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
    image: {
      toolbar: [
        "toggleImageCaption",
        "imageTextAlternative",
        "|",
        "imageStyle:inline",
        "imageStyle:wrapText",
        "imageStyle:breakText",
        "|",
        "resizeImage",
      ],
    },

    initialData: props.content,
    language: "ko",
    licenseKey: LICENSE_KEY,
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    mention: {
      feeds: [
        {
          marker: "@",
          feed: [
            /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
          ],
        },
      ],
    },
    placeholder: "Type or paste your content here!",
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
    translations: [translations],
  };
});

onMounted(() => {
  isLayoutReady.value = true;
});

function onReady(editor) {
  [...editorToolbar.value.children].forEach((child) => child.remove());
  [...editorMenuBar.value.children].forEach((child) => child.remove());

  editorToolbar.value.appendChild(editor.ui.view.toolbar.element);
  editorMenuBar.value.appendChild(editor.ui.view.menuBarView.element);
}

const editorData = ref(props.content);
watch(
  () => props.content,
  (newVal) => {
    editorData.value = newVal;
  }
);
const emit = defineEmits(["editorData"]);
watch(editorData, () => {
  emit("editorData", editorData.value);
});
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap");

@media print {
  body {
    margin: 0 !important;
  }
}

.main-container {
  --ckeditor5-preview-height: 700px;
  font-family: "Lato";
  width: 100%;
  margin-left: auto;
  margin-right: 400px;
}

.ck-content {
  font-family: "Lato";
  line-height: 1.6;
  word-break: break-word;
}

.editor-container__editor-wrapper {
  display: flex;
  width: max-content;
}

.editor-container_document-editor {
  border: 1px solid var(--ck-color-base-border);
}

.editor-container_document-editor .editor-container__toolbar {
  display: flex;
  position: relative;
  box-shadow: 0 2px 3px hsla(0, 0%, 0%, 0.078);
}

.editor-container_document-editor .editor-container__toolbar > .ck.ck-toolbar {
  flex-grow: 1;
  width: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border-top: 0;
  border-left: 0;
  border-right: 0;
}

.editor-container_document-editor
  .editor-container__menu-bar
  > .ck.ck-menu-bar {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border-top: 0;
  border-left: 0;
  border-right: 0;
}

.editor-container_document-editor .editor-container__editor-wrapper {
  max-height: var(--ckeditor5-preview-height);
  min-height: var(--ckeditor5-preview-height);
  overflow-y: scroll;
  background: var(--ck-color-base-foreground);
}

.editor-container_document-editor .editor-container__editor {
  margin-top: 28px;
  margin-bottom: 28px;
  height: 100%;
  width: 100%;
}

.editor-container_document-editor
  .editor-container__editor
  .ck.ck-editor__editable {
  box-sizing: border-box;
  min-width: calc(210mm + 2px);
  max-width: 100%;
  min-height: 297mm;
  height: fit-content;
  padding: 20mm 12mm;
  border: 1px hsl(0, 0%, 82.7%) solid;
  background: hsl(0, 0%, 100%);
  box-shadow: 0 2px 3px hsla(0, 0%, 0%, 0.078);
  flex: 1 1 auto;
  margin-left: 72px;
  margin-right: 72px;
}
</style>
