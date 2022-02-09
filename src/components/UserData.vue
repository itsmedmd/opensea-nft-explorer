<template>
  <div class="user-data">
    <img
      v-if="imgSource"
      :src="imgSource"
      :alt="username + 'profile picture'"
      class="user-data__image"
      :class="{ 'user-data__image--big': isBig }"
    />
    <span class="user-data__name" :class="{ bold: isAnonymous }">
      {{ name }}
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import UserDataType from "@/types/UserDataType";

export default defineComponent({
  name: "UserData",
  props: {
    imgSource: {
      required: true,
      type: String,
    },
    username: {
      required: true,
      type: String,
    },
    dataType: {
      required: true,
      type: String as PropType<UserDataType>,
    },
    isBig: {
      required: false,
      type: Boolean,
    },
  },
  setup(props) {
    const isAnonymous = computed(() => (props.username ? false : true));

    const name = computed(() => {
      if (props.username) {
        return props.username;
      }
      return props.dataType === "user"
        ? "Anonymous user"
        : "Anonymous collection";
    });

    return {
      name,
      isAnonymous,
    };
  },
});
</script>

<style lang="scss" src="@/assets/styles/components/user-data.scss"></style>
