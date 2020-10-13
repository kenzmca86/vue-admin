import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
      options: {
        customProperties: true,
      },
    themes: {
      light: {
        primary: '#ee44aa',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
    },
    icons: {
      iconfont: 'mdi', // default
      values: {
        product: 'mdi-dropbox',
        support: 'mdi-lifebuoy',
        steam: 'mdi-steam-box',
        pc: 'mdi-desktop-classic',
        xbox: 'mdi-xbox',
        playstation: 'mdi-playstation',
        switch: 'mdi-nintendo-switch',
      },
    },
  },
});
