<template>
  <div class="form-wrapper">
    <p>※設定はこのデバイスのみに保存されます</p>
    <v-form v-model="valid">
      <h3>アプリ設定</h3>
      <!-- アプリ名 -->
      <v-text-field
        label="アプリ名"
        v-model="settings.appName"
        :counter="30"
        :rules="[appNameRule]"
      />
      <!-- API URL -->
      <v-text-field
        label="API URL"
        v-model="settings.apiUrl"
        :counter="150"
        :rules="[stringRule]"
      />
      <!-- Auth Token -->
      <v-text-field
        label="Auth Token"
        v-model="settings.authToken"
        :counter="150"
        :rules="[stringRule]"
      />
      <v-text-field
        label="テンプレートURL"
        v-model="settings.templateUrl"
        :counter="150"
        :rules="[stringRule]"
      />
      <!--
      <h3>カテゴリ／タグ設定</h3>
      <p>カンマ（ &#44; ）区切りで入力してください</p>
      <v-text-field
        label="カテゴリ"
        v-model="settings.strCategoryItems"
        :counter="150"
        :rules="[stringRule, ...categoryRules]"
      />
      <v-text-field
        label="取付部品"
        v-model="settings.strMountItems"
        :counter="150"
        :rules="[stringRule, ...categoryRules]"
      />
      <v-text-field
        label="取外部品"
        v-model="settings.strRemoveItems"
        :counter="150"
        :rules="[stringRule, ...categoryRules]"
      />
      -->
      <v-row class="mt-4">
        <v-spacer/>
        <v-btn color="primary" :disabled="!valid" @click="onClickSave">保存</v-btn>
      </v-row>
    </v-form>
  </div>
</template>

<script>
export default {
    name: 'Settings',

    data () {
        const createItems = v => v.split(',').map(v => v.trim()).filter(v => v.length !== 0)
        const itemMaxLength = v =>createItems(v).reduce((a, c) => Math.max(a, c.length), 0)

        return {
            /** 入力したデータが有効かどうか */
            valid: false,
            /** 設定 */
            settings: { ...this.$store.state.settings },

            /** バリデーションルール */
            appNameRule: v => v.length <= 30 || '30文字以内で入力してください',
            stringRule: v => v.length <= 150 || '150文字以内で入力してください',
            categoryRules: [
                v => createItems(v).length !== 0 || 'カテゴリは一つ以上必要です',
                v => itemMaxLength(v) <= 20 || '各カテゴリは20文字以内で入力してください'
            ]
        }
    },

    methods: {
        /** 保存ボタンを押したとき */
        onClickSave () {
            this.$store.dispatch('saveSettings', { settings: this.settings })
        }
    }
}
</script>

<style>
  .form-wrapper {
      max-width: 500px;
      margin: auto;
  }
</style>