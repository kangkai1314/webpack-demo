<template>
    <div>
        <p>解析vue文件</p>
        <p>{{name}}</p>
    </div>
</template>
<script lang="ts">
import { defineComponent ,ref} from 'vue'

export default defineComponent({
    setup() {
        const name=ref('txm')
        return {
            name
        }
        
    },
})
</script>
