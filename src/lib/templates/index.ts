/*
 * @Author: Do not edit
 * @Date: 2023-05-09 23:22:56
 * @LastEditors: LiuYu
 * @LastEditTime: 2023-05-09 23:36:00
 * @FilePath: /ly-tools/src/lib/templates/index.ts
 */
const vueComponent = 
`<script>
import <%= data.name %> from '<%= data.path %>';

export default {
  name: '<%= data.upperName %>',
  extends: <%= data.name %>,
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>
`;

export {
  vueComponent
};