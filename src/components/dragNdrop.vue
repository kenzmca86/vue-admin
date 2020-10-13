<template>
<div class="hello">
    <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" @vdropzone-file-added="fileAdded">

    </vue-dropzone>
    <AttachmentList :tempAttachments="getTempAttachments" :attachments="getAttachments" />
</div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import AttachmentList from "./attachmentlist";

export default {
    name: 'DropZone',
    components: {
        vueDropzone: vue2Dropzone,
        AttachmentList
    },
    data: function () {
        return {
            tempAttachments: [],
            attachments: [],
            dropzoneOptions: {
                url: "https://httpbin.org/post",
                includeStyling: false,
                previewsContainer: false,
                thumbnailWidth: 250,
                thumbnailHeight: 140,
                uploadMultiple: true,
                addRemoveLinks: true,
            }
        }
    },
    computed: {
        getTempAttachments() {
            return this.tempAttachments;
        },
        getAttachments() {
            return this.attachments;
        }
    },
    methods: {
        fileAdded(file) {

            // Construct your file object to render in the UI
            let attachment = {};
            attachment._id = file.upload.uuid;
            attachment.title = file.name;
            attachment.type = "file";
            attachment.extension = "." + file.type.split("/")[1];
            attachment.user = JSON.parse(localStorage.getItem("user"));
            attachment.content = "File Upload by Select or Drop";
            attachment.thumb = file.dataURL;
            attachment.thumb_list = file.dataURL;
            attachment.isLoading = true;
            attachment.progress = null;
            attachment.size = file.size;
            attachment.file = file;
            this.tempAttachments = [...this.tempAttachments, attachment];
            console.log("File Dropped => ", this.tempAttachments);
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="css" scoped>
#drop1 {
    height: 200px;
    padding: 40px;
    color: white;
    background: black;
}

#drop1 .dz-preview {
    width: 160px;
}
</style>
